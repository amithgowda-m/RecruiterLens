export async function getGitHubData(username) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RecruiterLens-App'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!profileRes.ok) {
      if (profileRes.status === 404) throw new Error("Profile not found");
      if (profileRes.status === 403) throw new Error("GitHub API rate limit exceeded. Please try again later.");
      throw new Error(`GitHub API error: ${profileRes.status}`);
    }
    const profileData = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    if (!reposRes.ok) throw new Error(`GitHub API error fetching repos: ${reposRes.status}`);
    const rawRepos = await reposRes.json();

    const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers });
    const eventsData = eventsRes.ok ? await eventsRes.json() : [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const pushEvents = Array.isArray(eventsData) ? eventsData.filter(e => e.type === 'PushEvent' && new Date(e.created_at) > thirtyDaysAgo) : [];
    const pushCount = pushEvents.length;

    // Fetch READMEs
    const repos = await Promise.all((Array.isArray(rawRepos) ? rawRepos : []).map(async (repo) => {
      let hasReadme = false;
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, { headers });
        hasReadme = readmeRes.status === 200;
      } catch (e) {
        hasReadme = false;
      }

      const isArchive = 
        /test|demo|hello|temp/i.test(repo.name) || 
        !repo.description || 
        (new Date() - new Date(repo.updated_at)) > 6 * 30 * 24 * 60 * 60 * 1000;
      
      let triage = "";
      if (isArchive) {
        triage = "ARCHIVE";
      } else if (repo.description && hasReadme && (repo.topics && repo.topics.length > 0) && repo.stargazers_count > 0) {
        triage = "SHOWCASE";
      } else {
        triage = "POLISH";
      }

      return {
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        has_readme: hasReadme,
        triage
      };
    }));

    let completeness = 0;
    if (profileData.bio) completeness += 8;
    if (profileData.location) completeness += 4;
    if (profileData.avatar_url) completeness += 5; 
    const anyStarred = repos.some(r => r.stars > 0);
    if (profileData.public_repos > 0 && anyStarred) completeness += 8;

    let quality = 0;
    const descCount = Math.min(repos.filter(r => r.description).length, 5);
    quality += descCount * 2;
    const readmeCount = Math.min(repos.filter(r => r.has_readme).length, 5);
    quality += readmeCount * 2;
    const topicsCount = Math.min(repos.filter(r => r.topics && r.topics.length > 0).length, 5);
    quality += topicsCount * 2;

    let activity = 0;
    if (pushCount >= 5) activity += 25;
    else if (pushCount === 4) activity += 20;
    else if (pushCount === 3) activity += 15;
    else if (pushCount === 2) activity += 10;
    else if (pushCount === 1) activity += 5;

    let diversity = 0;
    const uniqueLangs = new Set(repos.map(r => r.language).filter(Boolean));
    diversity += Math.min(uniqueLangs.size, 5) * 4;

    const total = completeness + quality + activity + diversity;

    const sortedForDeepDive = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 3);
    const deepDiveDetails = await Promise.all(sortedForDeepDive.map(async (repo) => {
      let commits = [];
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`, { headers });
        if (commitsRes.ok) {
          const commitsData = await commitsRes.json();
          commits = commitsData.map(c => c.commit.message).filter(Boolean);
        }
      } catch(e) {}

      let readmeSnippet = "";
      if (repo.has_readme) {
        try {
           const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, { headers: { ...headers, 'Accept': 'application/vnd.github.v3.raw' } });
           if (readmeRes.ok) {
             const text = await readmeRes.text();
             readmeSnippet = text.substring(0, 500);
           }
        } catch(e) {}
      }

      return {
        name: repo.name,
        recent_commits: commits,
        readme_snippet: readmeSnippet
      };
    }));

    return {
      profile: {
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        avatar: profileData.avatar_url,
        followers: profileData.followers,
        following: profileData.following,
        public_repos: profileData.public_repos,
        created_at: profileData.created_at
      },
      repos,
      deep_dive: deepDiveDetails,
      score: {
        total,
        breakdown: { completeness, quality, activity, diversity }
      }
    };
  } catch (error) {
    if (error.message === "Profile not found") {
      throw error;
    }
    console.error("GitHub service error:", error);
    throw new Error("Failed to fetch GitHub data");
  }
}
