import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { isLoggedIn } from "../services/spotifyAuth";
import { useEffect } from "react";
import ToastPopup from "../components/ToastPopup";
import { createPlaylist } from "../services/spotify";

const CreatePlaylist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }

    // Check if user is a playlist creator
    const storedUserId = localStorage.getItem("spotify_user_id");
    if (storedUserId) {
      fetch(`http://localhost:3001/users?id=${storedUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const type = data[0].userType;
            if (type !== "criador de playlists") {
              navigate("/profile");
            }
          }
        })
        .catch(error => {
          console.error("Error fetching user type:", error);
        });
    }
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setToastMessage("Por favor, insira um título para a playlist.");
      setShowToast(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create playlist using the spotify service
      await createPlaylist(title, description);
      
      setToastMessage("Playlist criada com sucesso!");
      setShowToast(true);
      
      // Reset form
      setTitle("");
      setDescription("");
      
      // Navigate to the user playlists page after a short delay
      setTimeout(() => {
        navigate("/my-playlists");
      }, 2000);    } catch (error: any) {
      console.error("Error creating playlist:", error);
      // Display a more specific error message if available
      const errorMessage = error.message && error.message.includes("Erro ao criar playlist: ") 
        ? error.message 
        : "Erro ao criar playlist. Tente novamente mais tarde.";
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      {showToast && (
        <ToastPopup
          message={toastMessage}
          onClose={() => setShowToast(false)}
          success={toastMessage.includes("sucesso")}
          duration={3000}
        />
      )}
      <div className="min-h-screen flex flex-col bg-spotify-dark text-white px-4 pt-12 pb-24">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Criar Playlist</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="My Playlist #1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#333] rounded-md p-4 text-white placeholder-gray-400 focus:outline-none focus:border-spotify"
                
              />
            </div>
            
            <div>
              <textarea
                placeholder="Descrição opcional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#333] rounded-md p-4 text-white placeholder-gray-400 focus:outline-none focus:border-spotify resize-none h-32"
              />
            </div>
            
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="bg-white text-black py-3 px-12 rounded-md hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreatePlaylist;
