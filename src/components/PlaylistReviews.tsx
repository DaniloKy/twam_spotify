import { useState, useEffect } from "react";
import ReviewList from "./ReviewList";

type PlaylistReviewsProps = {
  playlist: any;
  isOwner: boolean;
  onBackToTracks: () => void;
};

const PlaylistReviews = ({ playlist, isOwner, onBackToTracks }: PlaylistReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playlist?.id) {
      setLoading(true);
      
      // Fetch reviews for the playlist
      fetch(`http://localhost:3001/reviews?playlistId=${playlist.id}`)
        .then(response => response.json())
        .then(data => {
          setReviews(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching reviews:", error);
          setLoading(false);
        });
    }
  }, [playlist?.id]);

  // Only allow the owner to see reviews in this component view
  if (!isOwner) {
    return null;
  }
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Avaliações</h2>
        <button 
          onClick={onBackToTracks}
          className="text-green-500 hover:text-green-400 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Voltar às músicas
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <ReviewList playlistId={playlist.id} playlistName={playlist.name} />
      )}
    </div>
  );
}

export default PlaylistReviews;