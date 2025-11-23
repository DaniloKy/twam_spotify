import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { isLoggedIn } from "../services/spotifyAuth";

type Props = {
  children: ReactNode;
};

const RequireSpotifyLogin = ({ children }: Props) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    setAllowed(isLoggedIn());
  }, []);

  console.log("CHECK LOG IN ")

  if (allowed === null) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        A verificar sessão...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireSpotifyLogin;
