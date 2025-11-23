import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { isLoggedIn, logoutFromSpotify } from "../services/spotifyAuth";
import { ExternalLink } from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import ToastPopup from "../components/ToastPopup";
import { getUserPlaylists } from "../services/spotify";
import UserReviews from "../components/UserReviews";

const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nextUserType, setNextUserType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }

    const storedName = localStorage.getItem("spotify_user_name");
    if (storedName) {
      setUserName(storedName);
    }

    const storedUserId = localStorage.getItem("spotify_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      
      // Fetch user type from db.json
      fetch(`http://localhost:3001/users?id=${storedUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const type = data[0].userType;
            setUserType(type);
            
            // If user is a creator, fetch their playlists
            if (type === "criador de playlists") {
              fetchUserPlaylists();
            }
          }
        })
        .catch(error => console.error("Error fetching user type:", error));

      // Fetch review count from db.json (for listeners)
      if (userType === "ouvinte") {
        fetch(`http://localhost:3001/reviews?userId=${storedUserId}`)
          .then(res => res.json())
          .then(data => {
            setReviewCount(data.length);
          })
          .catch(error => console.error("Error fetching reviews:", error));
      }
    }
  }, [navigate, userType]);  

  const fetchUserPlaylists = async () => {
    try {
      const playlists = await getUserPlaylists();
      if (playlists && 'total' in playlists) {
        setPlaylistCount(playlists.total);
      }
    } catch (error) {
      console.error("Error fetching user playlists:", error);
    }
  };
  
  const handleLogout = () => {
    logoutFromSpotify();
  };

  const handleChangeUserType = () => {
    // Determine the next user type
    const newType = userType === "ouvinte" ? "criador de playlists" : "ouvinte";
    setNextUserType(newType);
    setShowModal(true);
  };

  const confirmUserTypeChange = async () => {
    try {
      // Update user type in the database
      if (userId) {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userType: nextUserType
          }),
        });

        if (response.ok) {
          // Update local state
          setUserType(nextUserType);
          
          // Show success toast
          if (nextUserType === "criador de playlists") {
            setToastMessage("Tipo de utilizador alterado com sucesso.\nAgora você pode criar as suas playlists!");
            setShowToast(true);
            
            // Fetch playlists if user became a creator
            fetchUserPlaylists();
          } else {
            setToastMessage("Tipo de utilizador aterado com sucesso. Agora vôce pode explorar e avaliar playlists!");
            setShowToast(true);
          }
        }
      }
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  const openSpotifyProfile = () => {
    if (userId) {
      window.open(`https://open.spotify.com/user/${userId}`, '_blank');
    }
  };

  const viewUserPlaylists = () => {
    navigate('/my-playlists');
  };

  const handleShowReviews = () => {
    setShowReviews(true);
  };

  const handleBackFromReviews = () => {
    setShowReviews(false);
  };
  
  return (
    <>
      <Header />
      {showToast && (
        <ToastPopup
          message={toastMessage}
          onClose={() => setShowToast(false)}
          success={true}
          duration={5000}
        />
      )}
      <ConfirmationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmUserTypeChange}
        title="Confirmação"
        message={
          <p className="text-left">
            Irá deixar de ser {userType || "ouvinte"}
            <br />
            e passará a ser {nextUserType}
            <br />
            Confirma?
          </p>
        }
      />

      <div className="min-h-screen flex flex-col items-center pt-12 bg-spotify-dark text-white px-4">
        <div className="max-w-md w-full mx-auto">
          
            <div className="text-center">
              <div 
                onClick={openSpotifyProfile}
                className="cursor-pointer group relative"
              >
                <div className="w-40 h-40 bg-white rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-spotify transition-colors duration-300">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-28 h-28 text-black" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
                    />
                  </svg>
                </div>
              </div>
              <div 
                className="cursor-pointer group inline-flex items-center gap-2 mb-1"
                onClick={openSpotifyProfile}
              >
                <h1 className="text-3xl font-bold group-hover:text-spotify transition-colors duration-300">{userName}</h1>
                <ExternalLink size={18} className="text-gray-400 group-hover:text-spotify transition-colors duration-300" />
              </div>
              
              <p className="text-gray-400 mb-4 capitalize">{userType || "Ouvinte"}</p>

              <div className="mt-8 mb-4">
                {userType === "criador de playlists" ? (
                  <>
                  {playlistCount > 0 && (
                      <button 
                        onClick={viewUserPlaylists}
                        className="px-4 py-1.5 text-sm mt-2 text-white group rounded-full  duration-300 transition-opacity"
                      >
                    <p className="transition-colors group-hover:text-spotify text-xl font-bold">{playlistCount}</p>
                    <p className="transition-colors group-hover:text-spotify text-gray-400 text-sm mb-2">Playlist{playlistCount !== 1 ? "s" : ""} criada{playlistCount !== 1 ? "s" : ""}</p>
                    
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div 
                      onClick={reviewCount > 0 ? handleShowReviews : undefined}
                      className={`cursor-${reviewCount > 0 ? 'pointer' : 'default'} group transition-opacity`}
                    >
                      <p className="transition-colors group-hover:text-spotify text-xl font-bold ">{reviewCount}</p>
                      <p className="transition-colors group-hover:text-spotify text-gray-400 text-sm">Avaliaç{reviewCount !== 1 ? "ões" : "ão"}</p>
                    </div>
                  </>
                )}
              </div>
              {showReviews && userId ? (
            <UserReviews userId={userId} onBack={handleBackFromReviews} />
          ) : (
            <div className="mt-12 flex flex-col gap-4">
                <button 
                  onClick={handleChangeUserType}
                  className="w-full bg-black hover:bg-[#1a1a1a] text-white py-3 px-4 rounded-md border border-gray-800 transition-colors duration-300"
                >
                  Alterar tipo de utilizador
                </button>
                
                <div className="mt-8">
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-black hover:bg-red-700 hover:border-red-700 text-white hover:text-white py-3 px-4 rounded-md border border-gray-800 transition-colors duration-300"
                  >
                    Terminar Sessão
                  </button>
                </div>
              </div>
            )}
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
