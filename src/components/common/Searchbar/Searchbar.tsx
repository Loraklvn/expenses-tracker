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
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
      <input
        className="w-full h-11 pl-11 pr-10 bg-background border border-border/50 rounded-xl outline-none transition-all"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery.length > 0 && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          <XIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};
export default Searchbar;
