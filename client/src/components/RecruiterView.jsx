import ScoreCard from './ScoreCard';
import RepoList from './RepoList';
import ActionRoadmap from './ActionRoadmap';

export default function RecruiterView({ githubData, analysisData, onBack }) {
  const { profile, repos, score } = githubData;
  const { 
    recruiter_first_impression, 
    pros, 
    cons,
    tech_stack_analysis,
    ai_reliance_assessment,
    repo_to_spotlight, 
    action_steps 
  } = analysisData;

  const scoreColor = score.total >= 70 ? 'text-green-400' : score.total >= 40 ? 'text-yellow-400' : 'text-red-400';
  const scoreBorderColor = score.total >= 70 ? 'border-green-400/50' : score.total >= 40 ? 'border-yellow-400/50' : 'border-red-400/50';
  const scoreGradient = score.total >= 70 ? 'from-green-500/20 to-transparent' : score.total >= 40 ? 'from-yellow-500/20 to-transparent' : 'from-red-500/20 to-transparent';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <button 
        onClick={onBack}
        className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to search
      </button>

      {/* Header Profile */}
      <div className={`bg-card rounded-3xl p-8 border border-gray-800 shadow-xl relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${scoreGradient} opacity-50`}></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <img 
            src={profile.avatar} 
            alt={`${profile.name}'s avatar`} 
            className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-2xl"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">{profile.name || 'GitHub User'}</h2>
            <a href={`https://github.com/${profile.login || profile.name}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              @{profile.login || profile.name || 'username'}
            </a>
            <p className="text-gray-300 mt-4 max-w-2xl">{profile.bio || 'No bio provided'}</p>
          </div>
          <div className="flex-shrink-0">
            <div className={`w-32 h-32 rounded-full border-4 ${scoreBorderColor} flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm shadow-xl`}>
              <span className={`text-4xl font-black ${scoreColor}`}>{score.total}</span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg animate-slide-up">
            <h3 className="text-xl font-semibold text-white mb-4">Recruiter's First Impression</h3>
            <p className="text-gray-300 leading-relaxed italic border-l-4 border-accent pl-4">
              "{recruiter_first_impression}"
            </p>
          </div>

          <ScoreCard score={score} />

          <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg animate-slide-up">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
               Tech Stack Assessment
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {tech_stack_analysis}
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg animate-slide-up">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
               AI Reliance Check
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {ai_reliance_assessment}
            </p>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl animate-slide-up animation-delay-100">
              <h4 className="text-green-400 font-semibold mb-3">Key Strengths</h4>
              <ul className="space-y-2">
                {pros && pros.map((pro, i) => (
                  <li key={i} className="text-green-100/80 text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl animate-slide-up animation-delay-100">
              <h4 className="text-red-400 font-semibold mb-3">Areas of Concern</h4>
              <ul className="space-y-2">
                {cons && cons.map((con, i) => (
                  <li key={i} className="text-red-100/80 text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <RepoList repos={repos} />
          <ActionRoadmap steps={action_steps} spotlightRepo={repo_to_spotlight} />
        </div>
      </div>
    </div>
  );
}
