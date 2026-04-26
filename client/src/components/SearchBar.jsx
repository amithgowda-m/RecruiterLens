import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-500 group-focus-within:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="block w-full pl-12 pr-32 py-4 bg-card border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-lg transition-all"
        placeholder="Enter GitHub username..."
        required
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button
          type="submit"
          className="bg-accent hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-md"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
