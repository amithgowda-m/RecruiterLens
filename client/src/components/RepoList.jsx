export default function RepoList({ repos }) {
  const getBadgeStyle = (triage) => {
    switch(triage) {
      case 'SHOWCASE': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'POLISH': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'ARCHIVE': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const sortedRepos = [...repos].sort((a, b) => {
    const triageValue = { SHOWCASE: 3, POLISH: 2, ARCHIVE: 1 };
    if (triageValue[a.triage] !== triageValue[b.triage]) {
      return (triageValue[b.triage] || 0) - (triageValue[a.triage] || 0);
    }
    return b.stars - a.stars;
  });

  return (
    <div className="bg-card rounded-2xl border border-gray-800 shadow-lg overflow-hidden animate-slide-up animation-delay-200">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-xl font-semibold text-white">Repository Triage</h3>
        <p className="text-sm text-gray-400 mt-1">How a recruiter sees your public work</p>
      </div>
      <div className="divide-y divide-gray-800 max-h-[500px] overflow-y-auto">
        {sortedRepos.length === 0 && (
          <div className="p-6 text-center text-gray-400">No public repositories found.</div>
        )}
        {sortedRepos.map((repo) => (
          <div key={repo.name} className="p-4 sm:p-6 hover:bg-gray-800/50 transition-colors flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h4 className="text-white font-medium truncate">{repo.name}</h4>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {repo.stars}
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-medium border rounded-full shrink-0 ${getBadgeStyle(repo.triage)}`}>
              {repo.triage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
