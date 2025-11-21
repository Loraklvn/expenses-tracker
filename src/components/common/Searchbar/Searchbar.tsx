import { SearchIcon, XIcon } from "lucide-react";
import React, { ReactElement } from "react";

type SearchbarProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  placeholder: string;
};

const Searchbar = ({
  searchQuery,
  setSearchQuery,
  placeholder,
}: SearchbarProps): ReactElement => {
  return (
    <div className="flex items-center gap-2 bg-white border shadow-none border-gray-200 rounded-lg px-4 py-3">
      <SearchIcon className="h-5 w-5 text-gray-500" />
      <input
        className="flex-1 text-sms text-gray-900 outline-none"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery.length > 0 && (
        <button onClick={() => setSearchQuery("")} className="ml-2 p-1">
          <XIcon className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};
export default Searchbar;
