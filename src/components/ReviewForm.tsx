import { FaStar, FaRegStar } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { isLoggedIn, redirectToSpotifyAuth } from "../services/spotifyAuth";
import ToastPopup from "./ToastPopup";

type Props = {
  playlistId: string;
  onReviewAdded?: () => void;
  initialStars?: number; // Nova propriedade para definir estrelas iniciais
};

const ReviewForm = ({ playlistId, onReviewAdded, initialStars = 0 }: Props) => {
  const [descricao, setDescricao] = useState("");
  const [estrelas, setEstrelas] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const maxCaracteres = 200;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(false);

  // Aplicar estrelas iniciais quando o valor mudar
  useEffect(() => {
    if (initialStars > 0) {
      setEstrelas(initialStars);
    }
  }, [initialStars]);

  const displayToast = (message: string, success = false) => {
    setToastMessage(message);
    setToastSuccess(success);
    setShowToast(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (estrelas === 0 || descricao.trim() === "") {
      displayToast(
        "Por favor, selecione uma classificação em estrelas e escreva um comentário antes de enviar a sua avaliação.",
        false
      );
      return;
    }

    const userId = localStorage.getItem("spotify_user_id");
    const userName = localStorage.getItem("spotify_user_name");

    if (!userId || !userName) {
      displayToast("É necessário estar autenticado para enviar uma avaliação.", false);
      return;
    }

    const novaReview = {
      playlistId,
      descricao,
      estrelas,
      userId,
      userName,
      data: new Date().toISOString()
    };

    const response = await fetch("http://localhost:3001/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaReview),
    });

    if (response.ok) {
      setDescricao("");
      setEstrelas(0);
      displayToast("Avaliação submetida com sucesso", true);
      if (onReviewAdded) onReviewAdded();
    } else {
      displayToast("Erro ao enviar avaliação", false);
    }
  };
  
  // Se o usuário não estiver autenticado, mostramos uma mensagem para fazer login
  if (!isLoggedIn()) {
    return (
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl mx-auto text-center mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Avaliar Playlist</h3>
        <p className="text-gray-300 mb-4">Você precisa estar autenticado para avaliar esta playlist.</p>
        <button 
          onClick={() => redirectToSpotifyAuth()}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-spotify-dark font-semibold rounded-full transition-colors"
        >
          Entrar com Spotify
        </button>
      </div>
    );
  }
  
  return (
    <>
      {showToast && (
        <ToastPopup
          message={toastMessage}
          onClose={() => setShowToast(false)}
          success={toastSuccess}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl mx-auto space-y-4 mt-8"
      >
        <h3 className="text-lg font-semibold text-white mb-2">Avaliar Playlist</h3>

        {/* Estrelas */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = hovered !== null ? star <= hovered : star <= estrelas;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setEstrelas(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
                className="text-xl"
              >
                {filled ? (
                  <FaStar className="text-white-400" />
                ) : (
                  <FaRegStar className="text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Comentário */}
        <textarea
          value={descricao}
          onChange={(e) => {
            if (e.target.value.length <= maxCaracteres) {
              setDescricao(e.target.value);
            }
          }}
          placeholder="Comentário"
          maxLength={maxCaracteres}
          className="w-full p-4 rounded-xl bg-[#242424] text-white border border-[#2a2a2a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify"
        />
        <p className="text-right text-sm text-gray-400">
          {descricao.length} / {maxCaracteres}
        </p>

        {/* Submeter */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-xl transition"
          >
            Submeter
          </button>
        </div>
      </form>
    </>
  );
};

export default ReviewForm;
