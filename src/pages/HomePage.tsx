import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlaylistSection from "../components/PlaylistSection";
import Footer from "../components/Footer";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="mt-4 mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <PlaylistSection searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
}
