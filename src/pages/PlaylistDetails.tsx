import Header from "../components/Header";
import Footer from "../components/Footer";
import ReviewForm from "../components/ReviewForm";
import PlaylistReviews from "../components/PlaylistReviews";
import { useEffect, useState, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getPlaylistDetails } from "../services/spotify";
import { getMockPlaylistById } from "../mock/mockPlaylists";
import ConfirmationModal from "../components/ConfirmationModal";
import PlaylistHeader from "../components/PlaylistHeader";
import PlaylistTracks from "../components/PlaylistTracks";

type Review = {
  id: number;
  playlistId: string;
  descricao: string;
  estrelas: number;
};

export default function PlaylistDetails() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [initialStars, setInitialStars] = useState(0);
  const reviewFormRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchPlaylistData = async () => {
    if (!id) return;
    
    setLoading(true);
    
    let result;
    const isAuthenticated = !!localStorage.getItem("spotify_access_token");
    
    if (!isAuthenticated) {
      // Se não estiver autenticado, use os dados mockados
      result = getMockPlaylistById(id);
      
      // Quando não estamos autenticados, o usuário nunca é o dono
      setIsOwner(false);
    } else {
      // Se estiver autenticado, busque os dados da API
      result = await getPlaylistDetails(id);
      
      // Verifica se o usuário atual é o dono da playlist
      const currentUserId = localStorage.getItem("spotify_user_id");
      if (currentUserId && result && result.owner && result.owner.id === currentUserId) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
    
    if (!result) {
      setNotFound(true);
    } else {
      // Garantir que a playlist tenha as propriedades necessárias
      if (!result.creation_date) {
        result.creation_date = Date.now(); // Data default
      }
      
      // Garantir que tracks.items seja um array mesmo que esteja vazio
      if (!result.tracks || !result.tracks.items) {
        result.tracks = { items: [] };
      }
      
      // Garantir que todos os tracks tenham uma propriedade uri
      if (result.tracks && result.tracks.items) {
        result.tracks.items = result.tracks.items.map((item: any) => {
          if (item.track && !item.track.uri && item.track.id) {
            item.track.uri = `spotify:track:${item.track.id}`;
          }
          return item;
        });
      }
      
      setPlaylist(result);
    }
    
    setLoading(false);
  };

  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`http://localhost:3001/reviews?playlistId=${id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchPlaylistData();
    fetchReviews();
  }, [id]);

  // Função para rolar até o formulário de avaliação e definir estrelas iniciais
  const scrollToReviewForm = (stars: number) => {
    setInitialStars(stars);
    if (reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle deleting a playlist
  const handleDeletePlaylist = async () => {
    try {
      const token = localStorage.getItem("spotify_access_token");
      if (!token || !id) return;
      
      const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/followers`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        navigate('/my-playlists');
      } else {
        alert('Erro ao eliminar playlist. Tente novamente.');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('Erro ao eliminar playlist. Tente novamente.');
    }
  };

  // Redirect to NotFound page if the playlist doesn't exist
  if (notFound) {
    return <Navigate to="/not-found" replace />;
  }

  if (loading) return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
      <Footer />
    </div>
  );

  // Additional check for null playlist after loading (just to be safe)
  if (!playlist) return <Navigate to="/not-found" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Header />
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeletePlaylist();
        }}
        title="Eliminar Playlist"
        message={
          <p className="text-left">
            Tem certeza que deseja eliminar a playlist "{playlist.name}"?
            <br />
            Esta ação não pode ser desfeita.
          </p>
        }
      />
      <main className="flex-grow container mx-auto p-6">
        {/* Playlist Header */}
        <PlaylistHeader 
          playlist={playlist} 
          isOwner={isOwner} 
          reviews={reviews}
          onDeleteClick={() => setShowDeleteModal(true)}
          onViewReviews={() => setShowReviews(true)}
          onStarClick={!isOwner ? scrollToReviewForm : undefined}
        />
        
        <hr className="border-gray-700 my-4" />

        {!showReviews ? (
          /* Playlist Tracks */
          <PlaylistTracks 
            playlist={playlist} 
            isOwner={isOwner}
            onTracksChanged={fetchPlaylistData}
          />
        ) : (
          /* Playlist Reviews */
          <PlaylistReviews
            playlist={playlist} 
            isOwner={isOwner}
            onBackToTracks={() => setShowReviews(false)}
          />
        )}
        
        
        {/* Always show review form if not the owner, even if not authenticated */}
        {!isOwner && !showReviews && (
          <div ref={reviewFormRef}>
            <ReviewForm 
              playlistId={playlist.id} 
              onReviewAdded={fetchReviews}
              initialStars={initialStars} 
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
