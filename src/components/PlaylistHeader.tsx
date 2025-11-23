import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Play } from "lucide-react";

type PlaylistHeaderProps = {
  playlist: any;
  isOwner: boolean;
  reviews: any[];
  onDeleteClick: () => void;
  onViewReviews?: () => void;
  onStarClick?: (rating: number) => void; // Nova prop para clicar nas estrelas
};

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  playlist,
  isOwner,
  reviews,
  onDeleteClick,
  onViewReviews,
  onStarClick
}) => {
  // Calculate average stars
  const calcularMediaEstrelas = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.estrelas, 0);
    return total / reviews.length;
  };
  
  // Renderiza as estrelas e as torna clicáveis se onStarClick for fornecido
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(rating);
      stars.push(
        <span 
          key={i} 
          className={`${onStarClick ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          onClick={onStarClick ? () => onStarClick(i) : undefined}
          title={onStarClick ? `Avaliar com ${i} ${i === 1 ? 'estrela' : 'estrelas'}` : undefined}
        >
          {isFilled ? (
            <FaStar className="text-white-400" />
          ) : (
            <FaRegStar className="text-white" />
          )}
        </span>
      );
    }
    return stars;
  };

  const media = calcularMediaEstrelas();
  const totalReviews = reviews.length;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <img
        src={(playlist.images && playlist.images.length > 0) ? playlist.images[0].url : "/placeholder-playlist.png"}
        alt={`Capa da playlist ${playlist.name}`}
        className="w-full md:w-64 h-auto rounded-xl shadow-md"
      />
      <div>
        <h1 className="text-3xl font-bold mb-2">{playlist.name || "Sem título"}</h1>
        <p className="text-gray-300 mt-4">
          {playlist.description?.trim() !== ""
            ? playlist.description
            : "Playlist sem descrição"}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm my-4">
            {playlist.owner?.display_name || "Desconhecido"} • {new Date(playlist.creation_date || Date.now()).toLocaleDateString()}
          </p>
          {playlist.external_urls?.spotify && (
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-green-600 hover:bg-green-700 rounded-full p-2 transition-colors"
            >
              <Play size={18} />
            </a>
          )}
        </div>
        
        <div className="flex items-center space-x-2 my-4">
          {isOwner && onViewReviews && totalReviews > 0 ? (
            <div 
              onClick={onViewReviews}
              className="flex items-center cursor-pointer transition-colors group"
              title="Clique para ver avaliações"
            >
              <div className="flex">{renderStars(media)}</div>
              <div className="group-hover:text-spotify text-sm text-gray-400 ml-2">
                ({totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'})
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <div className="flex">{renderStars(media)}</div>
                <div className="text-sm text-gray-400 ml-2">
                  ({totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'})
                </div>
              </div>
              {onStarClick && (
                <div className="text-xs text-gray-400 ml-2 italic">
                  (Clique nas estrelas para avaliar)
                </div>
              )}
            </>
          )}
        </div>

        {isOwner && (
          <button
            onClick={onDeleteClick}
            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition-colors"
          >
            Eliminar Playlist
          </button>
        )}
      </div>
    </div>
  );
}

export default PlaylistHeader;
