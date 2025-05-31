/** @format */

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  className?: string;
  defaultValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  onSearch,
  debounceMs = 500,
  className = "",
  defaultValue = "",
}) => {
  const [searchValue, setSearchValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch, debounceMs]);

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className={`form-control ${className}`}>
      <div className="input-group">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            className="input input-bordered w-full pr-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {searchValue ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            ) : (
              <Search size={16} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
