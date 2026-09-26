import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export const RequestSearch = ({
  value,
  onChange,
  debounceMs = 150,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, value, onChange, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex items-center w-full sm:w-80 md:w-96">
      <Search className="absolute left-3 text-slate-400 pointer-events-none" size={15} aria-hidden="true" />
      <input
        type="text"
        className="w-full h-9 pl-9 pr-8 text-xs bg-slate-50/60 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
        placeholder="Search requests by title..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search requests by title"
        data-testid="search-input"
      />
      {localValue && (
        <button
          type="button"
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
          onClick={handleClear}
          aria-label="Clear search input"
          data-testid="clear-search-btn"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
