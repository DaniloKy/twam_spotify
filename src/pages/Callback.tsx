import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const clientId = "91f0dd022dec4e53bc50524fdb9dae9a";
const redirectUri = "http://127.0.0.1:5173/callback";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const codeVerifier = localStorage.getItem("spotify_code_verifier");

    if (!code || !codeVerifier) {
      console.error("Código ou verifier não encontrado.");
      return;
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    });

    axios
      .post("https://accounts.spotify.com/api/token", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(async (res) => {
        const { access_token, expires_in } = res.data;
        localStorage.setItem("spotify_access_token", access_token);
        localStorage.setItem("spotify_token_expiry", (Date.now() + expires_in * 1000).toString());

        // Obter dados do utilizador Spotify
        const userRes = await axios.get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id, display_name } = userRes.data;
        localStorage.setItem("spotify_user_id", id);
        localStorage.setItem("spotify_user_name", display_name);

        // Verificar no JSON Server se já está registado
        const jsonRes = await axios.get(`http://localhost:3001/users?id=${id}`);

        if (jsonRes.data.length === 0) {
          navigate("/escolher-tipo");
        } else {
          // Já existe → vai direto para home
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Erro ao autenticar:", err);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <p>A autenticar com Spotify...</p>
    </div>
  );
}
