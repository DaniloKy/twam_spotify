import { useEffect, useState } from "react";
import { isLoggedIn, logoutFromSpotify, redirectToSpotifyAuth } from "../services/spotifyAuth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAuthenticated(isLoggedIn());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    isAuthenticated,
    login: redirectToSpotifyAuth,
    logout: logoutFromSpotify,
  };
}
