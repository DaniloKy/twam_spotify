import { Search } from "lucide-react";
import React, { useState } from "react";
import { isLoggedIn } from "../services/spotifyAuth";
import ToastPopup from "./ToastPopup";

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      setShowPopup(true);
      return;
    }
    if (query.trim()) onSearch(query);
  };

  return (
    <>
    {showPopup && (
        <ToastPopup
          message="É necessário estar autenticado para pesquisar."
          onClose={() => setShowPopup(false)}
          success={false}
        />
      )}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar playlists..."
            className="w-full p-3 pr-12 rounded-xl bg-[#242424] text-spotify-dark border  bg-white border-[#2a2a2a] placeholder-spotify-dark focus:outline-none focus:ring-2 focus:ring-spotify"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-dark hover:text-spotify"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
};

export default SearchBar;
