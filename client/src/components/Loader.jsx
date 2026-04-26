export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-accent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin animation-delay-200"></div>
        <div className="absolute inset-4 border-b-4 border-blue-400 rounded-full animate-spin animation-delay-400"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Auditing Profile</h3>
        <p className="text-gray-400 animate-pulse">Running scoring engine & AI analysis...</p>
      </div>
    </div>
  );
}
