import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import RecruiterView from './components/RecruiterView';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setGithubData(null);
    setAnalysisData(null);

    try {
      const githubRes = await fetch(`${API_BASE}/api/github/${username}`);
      if (!githubRes.ok) {
        const errData = await githubRes.json().catch(() => ({}));
        if (githubRes.status === 404) {
          throw new Error("User not found");
        }
        throw new Error(errData.error || "Failed to fetch GitHub data");
      }
      const gData = await githubRes.json();
      setGithubData(gData);

      const analysisRes = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: gData.profile,
          repos: gData.repos,
          score: gData.score
        })
      });
      
      if (!analysisRes.ok) {
        throw new Error("Failed to analyze profile");
      }
      const aData = await analysisRes.json();
      setAnalysisData(aData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Recruiter<span className="text-accent">Lens</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Know exactly what a recruiter sees when they open your GitHub.
          </p>
        </header>

        {!githubData && !loading && (
          <div className="max-w-xl mx-auto mt-12 animate-fade-in">
            <SearchBar onSearch={handleSearch} />
            {error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-fade-in">
                {error}
              </div>
            )}
          </div>
        )}

        {loading && <Loader />}

        {githubData && analysisData && !loading && (
          <RecruiterView githubData={githubData} analysisData={analysisData} onBack={() => {
            setGithubData(null);
            setAnalysisData(null);
          }} />
        )}
      </div>
    </div>
  );
}

export default App;
