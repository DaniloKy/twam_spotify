import { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import { searchPlaylists } from "../services/spotify";
import { isLoggedIn } from "../services/spotifyAuth";
import { mockPlaylists } from "../mock/mockPlaylists";

type PlaylistSectionProps = {
  searchQuery: string;
};

export default function PlaylistSection({ searchQuery }: PlaylistSectionProps) {  const [playlists, setPlaylists] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const fetchRatingAndCount = async (playlistId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/reviews?playlistId=${playlistId}`);
      const data = await res.json();
      if (data.length === 0) return { rating: 0, count: 0 };
      const total = data.reduce((sum: number, r: any) => sum + r.estrelas, 0);
      return { rating: total / data.length, count: data.length };
    } catch {
      return { rating: 0, count: 0 };
    }
  };
  useEffect(() => {
    const fetchPlaylistsAndRatings = async () => {
      let finalPlaylists = [];

      if (!isLoggedIn()) {
        finalPlaylists = mockPlaylists;
      } else {
        const query = searchQuery.trim() !== "" ? searchQuery : "rock";
        finalPlaylists = await searchPlaylists(query);
      }

      setPlaylists(finalPlaylists);

      const newRatings: Record<string, number> = {};
      const newReviewCounts: Record<string, number> = {};
      
      for (const p of finalPlaylists) {
        if (p?.id) {
          const { rating, count } = await fetchRatingAndCount(p.id);
          newRatings[p.id] = rating;
          newReviewCounts[p.id] = count;
        }
      }
      
      setRatings(newRatings);
      setReviewCounts(newReviewCounts);
    };

    fetchPlaylistsAndRatings();
  }, [searchQuery]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">      
      {playlists
        .filter((p) => p !== null && p.id)  // Garantindo que p.id existe
        .map((p) => {
          // Garantindo valores seguros e com fallbacks apropriados
          const id = p.id || '';
          const title = p.name || 'Playlist sem título';
          const author = (p.owner && p.owner.display_name) ? p.owner.display_name : 'Desconhecido';
          const rating = ratings[id] || 0;
          const reviewCount = reviewCounts[id] || 0;
          const cover = (p.images && p.images.length > 0) ? p.images[0].url : "/placeholder-playlist.png";
          
          return (
            <PlaylistCard
              key={id}
              id={id}
              title={title}
              author={author}
              rating={rating}
              reviewCount={reviewCount}
              cover={cover}
            />
          );
        })}
    </div>
  );
}
