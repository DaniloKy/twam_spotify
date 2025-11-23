import { Link, useNavigate } from "react-router-dom";
import { Home, User, ListMusic } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Header() {
  const { isAuthenticated, login } = useAuth();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const storedName = localStorage.getItem("spotify_user_name");
      if (storedName) {
        setUserName(storedName);
      }

      // Check user type from db.json
      const storedUserId = localStorage.getItem("spotify_user_id");
      if (storedUserId) {
        fetch(`http://localhost:3001/users?id=${storedUserId}`)
          .then(res => res.json())
          .then(data => {
            if (data.length > 0) {
              const type = data[0].userType;
              setUserType(type);
            }
          })
          .catch(error => console.error("Error fetching user type:", error));
      }
    } else {
      setUserName("");
      setUserType("");
    }
  }, [isAuthenticated]);

  function navigateToProfile() {
    navigate("/profile");
  }

  function navigateToMyPlaylists() {
    navigate("/my-playlists");
  }

  return (
    <header className="bg-spotify-dark flex flex-row items-center p-4">
      <div className="flex items-center w-full gap-4 justify-between my-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <div className="gap-2 text-white hover:text-spotify transition-colors duration-300">
              <Home className="w-8 h-8" />
            </div>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {userType === "criador de playlists" && (
              <button
                onClick={navigateToMyPlaylists}
                className="bg-[#333333] hover:bg-[#444444] text-white text-sm font-normal px-4 py-2 rounded transition-colors duration-300 flex items-center gap-2"
              >
                <ListMusic size={16} />
                As minhas playlists
              </button>
            )}
            
            <div 
              onClick={navigateToProfile}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <span className="text-white group-hover:text-spotify transition-colors duration-300">{userName}</span>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-spotify">
                <User size={22} className="text-black" />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-green-500 hover:bg-green-600 text-spotify-dark font-normal px-4 py-2 rounded ml-4"
          >
            Entrar com Spotify
          </button>
        )}
      </div>
    </header>
  );
}
