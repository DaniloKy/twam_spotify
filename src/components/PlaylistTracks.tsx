import { useState } from "react";
import { removeTrackFromPlaylist } from "../services/spotify";
import AddTrackModal from "./AddTrackModal";

type PlaylistTracksProps = {
  playlist: any;
  isOwner: boolean;
  onTracksChanged: () => void;
};

const PlaylistTracks = ({ playlist, isOwner, onTracksChanged }: PlaylistTracksProps) => {
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [visibleCount] = useState(25);
  const isAuthenticated = !!localStorage.getItem("spotify_access_token");

  // Handle removing a track from playlist
  const handleRemoveTrack = async (trackUri: string) => {
    try {
      if (!playlist.id) return;
      
      if (!isAuthenticated) {
        alert('Você precisa estar autenticado para remover músicas.');
        return;
      }
      
      await removeTrackFromPlaylist(playlist.id, trackUri);
      
      // Notify parent component to refresh playlist data
      onTracksChanged();
    } catch (error) {
      console.error('Error removing track:', error);
      alert('Erro ao remover música. Tente novamente.');
    }
  };

  // Garante que temos um array de tracks mesmo que esteja vazio
  const tracks = playlist.tracks?.items || [];

  return (
    <div className="mt-8">
      {/* Add Track Modal */}
      {showAddTrackModal && (
        <AddTrackModal
          playlistId={playlist.id}
          onClose={() => setShowAddTrackModal(false)}
          onTrackAdded={onTracksChanged}
        />
      )}
      
      {/* Track count heading */}
      {tracks.length > 0 ? (
        <h3 className="text-white font-medium mb-4">
          {playlist.name} tem {tracks.length} {tracks.length === 1 ? 'música' : 'músicas'}
        </h3>
      ) : (
        <div className="text-center py-8">
          <p className="text-white mb-4">Esta playlist não tem músicas.</p>
          {isOwner && isAuthenticated && (
            <button 
              onClick={() => setShowAddTrackModal(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-500 text-green-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Track list */}
      <div className="space-y-1 mb-8">
        {tracks.slice(0, visibleCount).map(({ track }: { track: any }, index: number) => {
          if (!track) return null;
          
          return (
            <div 
              key={track.id || index} 
              className="flex items-center px-2 py-3 rounded-md hover:bg-[#2A2A2A] transition-colors group"
            >
              <img 
                src={track.album?.images?.[2]?.url || "/placeholder-playlist.png"} 
                alt={`${track.name || 'Música'} album art`} 
                className="w-12 h-12 mr-4"
              />
              <div className="flex-grow min-w-0">
                <p className="font-medium text-white truncate">{track.name || "Música desconhecida"}</p>
                <p className="text-sm text-gray-400 truncate">
                  {track.artists?.map((artist: any) => artist.name).join(", ") || "Artista desconhecido"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && isAuthenticated && track.uri && (
                  <button 
                    onClick={() => handleRemoveTrack(track.uri)}
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
                {track.external_urls?.spotify && (
                  <a 
                    href={track.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Add Track Button at bottom */}
      {isOwner && isAuthenticated && tracks.length > 0 && (
        <div className="flex justify-center mb-8">
          <button 
            onClick={() => setShowAddTrackModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-[#1a1a1a] hover:bg-[#272727] border border-gray-700 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar música
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistTracks;
