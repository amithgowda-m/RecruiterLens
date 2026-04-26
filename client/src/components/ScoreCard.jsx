export default function ScoreCard({ score }) {
  const getScoreColor = (total) => {
    if (total >= 70) return 'text-green-400 border-green-400 shadow-green-500/20';
    if (total >= 40) return 'text-yellow-400 border-yellow-400 shadow-yellow-500/20';
    return 'text-red-400 border-red-400 shadow-red-500/20';
  };

  const getProgressColor = (total) => {
    if (total >= 70) return 'bg-green-400';
    if (total >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const { total, breakdown } = score;
  const colorClass = getScoreColor(total);
  const progressClass = getProgressColor(total);

  return (
    <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">RecruiterLens Score</h3>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg ${colorClass}`}>
          <span className="text-2xl font-bold">{total}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <ProgressBar label="Completeness" value={breakdown.completeness} max={25} colorClass={progressClass} />
        <ProgressBar label="Project Quality" value={breakdown.quality} max={30} colorClass={progressClass} />
        <ProgressBar label="Activity Score" value={breakdown.activity} max={25} colorClass={progressClass} />
        <ProgressBar label="Tech Diversity" value={breakdown.diversity} max={20} colorClass={progressClass} />
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, colorClass }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
