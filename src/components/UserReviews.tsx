import { useEffect, useState } from 'react';
import { FaStar, FaRegStar, FaArrowLeft } from 'react-icons/fa';
import { getUserReviews } from '../services/spotify';

interface Review {
  id: string;
  userId: string;
  playlistId: string;
  rating: number;
  comment: string;
  createdAt: string;
  playlistName?: string;
  playlistImage?: string;
}

interface UserReviewsProps {
  userId: string;
  onBack: () => void;
}

const UserReviews = ({ userId, onBack }: UserReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const userReviews = await getUserReviews(userId);
        setReviews(userReviews);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      index < rating 
        ? <FaStar key={index} className="text-white-400" /> 
        : <FaRegStar key={index} className="text-white" />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-white mr-4 hover:text-gray-400 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Voltar
        </button>
        <h2 className="text-white text-2xl font-bold">Avaliações</h2>
      </div>
      
      {loading ? (
        <p className="text-white">Carregando avaliações...</p>
      ) : reviews.length === 0 ? (
        <p className="text-white">Nenhuma avaliação encontrada.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <img 
                  src={review.playlistImage || '/placeholder-playlist.png'} 
                  alt={review.playlistName || 'Playlist'} 
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <div>
                  <h3 className="text-white font-semibold">{review.playlistName || 'Playlist'}</h3>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-white mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
