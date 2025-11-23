import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RequireSpotifyLogin from "./components/RequireSpotifyLogin";
import RequireNewUser from "./components/RequireNewUser";

import HomePage from "./pages/HomePage";
import PlaylistDetails from "./pages/PlaylistDetails";
import Callback from "./pages/Callback";
import UserTypeSelection from "./pages/UserTypeSelection";
import UserProfile from "./pages/UserProfile";
import UserPlaylists from "./pages/UserPlaylists";
import CreatePlaylist from "./pages/CreatePlaylist";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3333,
          style: { display: "none" },
        }}
      />
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/playlist/:id" element={<PlaylistDetails />} />
        <Route path="/escolher-tipo" element={<RequireNewUser><UserTypeSelection /></RequireNewUser>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/my-playlists" element={<ProtectedRoute><UserPlaylists /></ProtectedRoute>} />
        <Route path="/create-playlist" element={<ProtectedRoute><CreatePlaylist /></ProtectedRoute>} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
