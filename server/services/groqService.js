import Groq from "groq-sdk";

export async function getGroqAnalysis(data) {
  const { profile = {}, repos = [], score = { total: 0 }, deep_dive = [] } = data;
  
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "fallback_key" });
  
  const systemPrompt = "You are a senior tech recruiter and engineering manager at a fast-growing startup. You review GitHub profiles every day. Dive deep into the code evidence, commit messages, and repository setups. Be direct, specific, and honest. Return ONLY a valid JSON object. No markdown. No explanation outside the JSON. No code fences.";
  
  const username = profile.name || profile.login || "User";
  const bio = profile.bio || "No bio";
  const followers = profile.followers || 0;
  const public_repos = profile.public_repos || 0;
  
  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].join(', ') || "None";
  const noDescCount = repos.filter(r => !r.description).length;
  const readmeCount = repos.filter(r => r.has_readme).length;
  
  const topRepos = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 3).map(r => `${r.name} (${r.stars} stars)`).join(', ') || "None";
  
  const deepDiveStr = deep_dive.map(d => `Repo: ${d.name}\nCommits: ${JSON.stringify(d.recent_commits)}\nREADME Snippet: ${d.readme_snippet}`).join('\n\n');

  const userPrompt = `Analyze this GitHub profile for recruiter readiness and engineering quality:
Username: ${username}
Bio: ${bio}
Followers: ${followers}
Public Repos: ${public_repos}
Languages used: ${languages}
Repos with no description: ${noDescCount}
Repos with README: ${readmeCount}
Top repos by stars: ${topRepos}
RecruiterLens Score: ${score.total || 0}/100

Deep Dive into top 3 repos (Commits and READMEs):
${deepDiveStr}

Based on this, generate a deep and professional assessment. Return this exact JSON shape:
{
  "recruiter_first_impression": "string (2-3 sentences, honest overall impression)",
  "pros": ["string", "string", "string"],
  "cons": ["string", "string"],
  "tech_stack_analysis": "string (Detailed: what they are good at, what they are learning)",
  "ai_reliance_assessment": "string (Does their activity/commits look heavily AI-assisted? Provide reasons based on commit messages or patterns)",
  "repo_to_spotlight": "string (one repo name + reason to polish it)",
  "action_steps": ["string", "string", "string", "string", "string"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const raw = completion.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Groq Analysis Error:", error);
    return {
      recruiter_first_impression: "This profile has some interesting projects but lacks clear presentation.",
      pros: ["Shows potential and interest in coding", "Has some public activity"],
      cons: ["Missing descriptions and READMEs", "Needs more detailed commit histories"],
      tech_stack_analysis: "Seems to be learning general programming concepts. Further detail requires more comprehensive repository setups.",
      ai_reliance_assessment: "Cannot determine conclusively. Adding more descriptive and human-like commit messages helps build trust.",
      repo_to_spotlight: repos[0]?.name || "Any repo",
      action_steps: [
        "Add a descriptive bio to your profile.",
        "Add descriptions to all your repositories.",
        "Include a detailed README in your best projects.",
        "Write clear, descriptive commit messages (e.g. 'Fix login bug' instead of 'Update file').",
        "Contribute more consistently to show activity."
      ]
    };
  }
}
