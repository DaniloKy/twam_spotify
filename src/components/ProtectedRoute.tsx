import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token");
    const userId = localStorage.getItem("spotify_user_id");

    // Se não estiver logado → não faz nada (pode ver o conteúdo normalmente)
    if (!accessToken || !userId) {
      setLoading(false);
      return;
    }

    // Se estiver logado, verificar se já escolheu o tipo
    const checkUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users?id=${userId}`);
        const user = res.data[0];
        if (!user || !user.userType) {
          setRedirect(true); // logado mas sem tipo definido → forçar escolha
        }
      } catch (err) {
        console.error("Erro ao verificar utilizador:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        A verificar sessão...
      </div>
    );
  }

  if (redirect) {
    return <Navigate to="/escolher-tipo" replace />;
  }

  return children;
};

export default ProtectedRoute;