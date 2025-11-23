import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { isLoggedIn } from "../services/spotifyAuth";
import { getUserPlaylists } from "../services/spotify";

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  playlistId: string;
  estrelas: number;
}

const UserPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }

    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const userPlaylists = await getUserPlaylists();
          if (userPlaylists && 'items' in userPlaylists) {
          // Calculate average rating for each playlist
          const playlistsWithRatings = await Promise.all(userPlaylists.items.map(async (playlist: Playlist) => {
            // Fetch only reviews for this specific playlist
            const reviewsResponse = await fetch(`http://localhost:3001/reviews?playlistId=${playlist.id}`);
            const playlistReviews = await reviewsResponse.json();
            let rating = 0;
            
            if (playlistReviews.length > 0) {
              const totalStars = playlistReviews.reduce((sum: number, review: Review) => sum + review.estrelas, 0);
              rating = totalStars / playlistReviews.length;
            }
            
            return { 
              ...playlist, 
              rating, 
              reviewCount: playlistReviews.length 
            };
          }));
          
          setPlaylists(playlistsWithRatings);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Não foi possível carregar as suas playlists. Por favor, tente novamente mais tarde.");
        setIsLoading(false);
      }
    };

    // Check if user is a playlist creator
    const storedUserId = localStorage.getItem("spotify_user_id");
    if (storedUserId) {
      fetch(`http://localhost:3001/users?id=${storedUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const type = data[0].userType;
            if (type === "criador de playlists") {
              fetchPlaylists();
            } else {
              setError("Apenas criadores de playlists podem ver esta página.");
              setIsLoading(false);
            }
          }
        })
        .catch(error => {
          console.error("Error fetching user type:", error);
          setIsLoading(false);
        });
    }
  }, [navigate]);

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <>
      <Header />      <div className="min-h-screen flex flex-col bg-spotify-dark text-white px-4 pt-12 pb-24">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">As minhas playlists</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
            </div>
          ) : error ? (
            <div className="bg-black bg-opacity-30 p-6 rounded-lg text-center">
              <p>{error}</p>
              {error === "Apenas criadores de playlists podem ver esta página." && (
                <button 
                  onClick={() => navigate("/profile")}
                  className="mt-4 px-6 py-2 bg-spotify hover:bg-spotify-light rounded-full text-white transition-colors"
                >
                  Voltar ao Perfil
                </button>
              )}
            </div>          ) : playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl mb-8 mt-16 text-center">De momento não tem nenhuma playlist</p>
              <button 
                onClick={() => navigate('/create-playlist')} 
                className="bg-white text-black py-3 px-4 rounded-full max-w-md w-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                + Criar Playlist
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-sm text-center mb-2 text-gray-400 pb-4">
                {playlists.length} {playlists.length === 1 ? 'Criação' : 'Criações'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-[#181818] p-4 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
                    onClick={() => handlePlaylistClick(playlist.id)}
                  >
                    <img
                      src={(playlist.images && playlist.images.length > 0) ? playlist.images[0].url : "/placeholder-playlist.png"}
                      alt={`Capa da playlist ${playlist.name}`}
                      className="w-full h-56 object-cover rounded-xl mb-4"
                    />                    <h3 className="font-semibold text-lg text-white truncate">{playlist.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="text-xs mr-1">★</span> {playlist.rating ? playlist.rating.toFixed(1) : '0.0'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {playlist.reviewCount || 0} {playlist.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => navigate('/create-playlist')} 
                  className="bg-white text-black py-3 px-4 rounded-full w-64 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  + Criar Playlist
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserPlaylists;
