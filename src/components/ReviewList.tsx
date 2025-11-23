import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

interface Review {
  id: number;
  playlistId: string;
  userId: string;
  userName: string;
  descricao: string;
  estrelas: number;
  data?: string;
}

interface ReviewListProps {
  playlistId?: string;
  playlistName?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ playlistId: propPlaylistId }) => {  const params = useParams<{ playlistId: string }>();
  const playlistId = propPlaylistId || params.playlistId;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPlaylistData = async () => {
    try {
      // Fetch playlist details if we don't have the name
      if (playlistId) {
        const response = await fetch(`http://localhost:3001/playlists/${playlistId}`);
        if (!response.ok) {
          console.error("Error fetching playlist details");
        }
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/reviews?playlistId=${playlistId}`
      );
      const data = await response.json();
      
      // Fetch user names for each review
      const reviewsWithUserNames = await Promise.all(
        data.map(async (review: Review) => {
          if (review.userId) {
            try {
              const userResponse = await fetch(`http://localhost:3001/users?id=${review.userId}`);
              const userData = await userResponse.json();
              if (userData.length > 0) {
                return { ...review, userName: userData[0].name };
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
          return review;
        })
      );
      
      setReviews(reviewsWithUserNames);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistData();
      fetchReviews();
    }
  }, [playlistId]);
  // Function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-white-400" />
        ) : (
          <FaRegStar key={i} className="text-white" />
        )
      );
    }
    return stars;
  };

  // Format date to display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Use playlist name from props or state
  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#181818] rounded-lg p-8 text-center">
            <p className="text-gray-400">Esta playlist ainda não tem avaliações.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#181818] rounded-xl p-5 hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">{renderStars(review.estrelas)}</div>
                </div>
                <p className="text-white mb-6">{review.descricao}</p>
                <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-800 pt-4">
                  <p className="font-medium">{review.userName || "Usuário anônimo"}</p>
                  <p>{formatDate(review.data) || "Data não disponível"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
