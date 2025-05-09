
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch,
  className = "hidden md:flex items-center relative w-64 lg:w-72 shrink-0"
}) => {
  return (
    <form 
      onSubmit={handleSearch} 
      className={className}
    >
      <input
        type="text"
        placeholder="Caută cursuri..."
        className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    </form>
  );
};

export default SearchBar;
