export default function ActionRoadmap({ steps, spotlightRepo }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg space-y-6 animate-slide-up animation-delay-300">
      <h3 className="text-xl font-semibold text-white">Your 5-Step Action Roadmap</h3>
      <ol className="space-y-4">
        {steps && steps.map((step, index) => (
          <li key={index} className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
              {index + 1}
            </span>
            <p className="text-gray-300 mt-1">{step}</p>
          </li>
        ))}
      </ol>

      {spotlightRepo && (
        <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <h4 className="text-accent font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Repo to Spotlight
          </h4>
          <p className="text-white mt-2 font-medium">{spotlightRepo}</p>
        </div>
      )}
    </div>
  );
}
