import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetails } from "../services/spotify"; // função tua

export default function UserTypeSelection() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserDetails().then(setUserInfo);
  }, []);

  const handleSelect = async (type: "ouvinte" | "criador de playlists") => {
    if (!userInfo) return;

    const newUser = {
      id: userInfo.id,
      name: userInfo.display_name,
      userType: type,
    };

    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-spotify-dark text-white flex flex-col justify-center items-center gap-6 text-center px-6">
      <h2 className="text-3xl font-semibold">Antes de continuarmos,</h2>
      <p className="text-2xl">escolha o tipo de conta que pretende criar</p>

      <button
        onClick={() => handleSelect("ouvinte")}
        className="bg-yellow-400 text-black font-medium py-5 px-20 rounded-full hover:brightness-110 flex items-center gap-2"
      >
        🎧 Ouvinte – Desfruta da música
      </button>

      <span className="text-gray-400">Ou</span>

      <button
        onClick={() => handleSelect("criador de playlists")}
        className="bg-blue-300 text-black font-medium py-5 px-20 rounded-full hover:brightness-110 flex items-center gap-2"
      >
        🎙️ Criador – Publica as tuas playlists
      </button>
    </div>
  );
}
