import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { isLoggedIn } from "../services/spotifyAuth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const RequireNewUser = ({ children }: Props) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      setAllowed(false);
      return;
    }

    const userId = localStorage.getItem("spotify_user_id");
    if (!userId) {
      setAllowed(false);
      return;
    }

    const checkUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users?id=${userId}`);
        const user = res.data[0];

        // Se já existir e tiver userType, não deve aceder a esta página
        if (user && user.userType) {
          setAllowed(false);
        } else {
          setAllowed(true); // Pode aceder (ou ainda não existe)
        }
      } catch (err) {
        console.error("Erro ao verificar utilizador:", err);
        setAllowed(false);
      }
    };

    checkUser();
  }, []);

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

export default RequireNewUser;
