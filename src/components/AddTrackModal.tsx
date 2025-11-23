import { useState } from "react";
import { searchTracks, addTrackToPlaylist } from "../services/spotify";
import { X } from "lucide-react";

type AddTrackModalProps = {
  playlistId: string;
  onClose: () => void;
  onTrackAdded: () => void;
  isOpen?: boolean; // Adicionada a propriedade isOpen
};

type Track = {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
};

const AddTrackModal = ({ playlistId, onClose, onTrackAdded }: AddTrackModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const results = await searchTracks(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError("Erro ao buscar músicas. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTrack = async (track: Track) => {
    setIsLoading(true);
    setError("");
    
    try {
      await addTrackToPlaylist(playlistId, track.uri);
      onTrackAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar música. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-[#121212] w-full max-w-md max-h-[80vh] relative overflow-hidden rounded-md">
        {/* Search header */}
        <div className="flex items-center p-2 bg-[#282828]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar música..."
            className="flex-grow p-2 bg-transparent text-white border-none focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Results */}
        <div className="overflow-y-auto max-h-[450px]">
          {error && (
            <div className="p-4 text-red-400 text-center">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map(track => (
              <div 
                key={track.id}
                className="flex items-center p-3 hover:bg-[#282828] border-b border-gray-800 last:border-b-0"
              >
                <img 
                  src={track.album.images[2]?.url || "/placeholder-playlist.png"} 
                  alt={track.album.name} 
                  className="w-12 h-12 mr-3"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-white font-medium truncate">{track.name}</p>
                  <p className="text-gray-400 text-sm truncate">
                    {track.artists.map(a => a.name).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(track.duration_ms / 60000)}:
                    {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, "0")}
                  </p>
                </div>
                <button 
                  className="ml-2 text-white"
                  onClick={() => handleAddTrack(track)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            ))
          ) : searchQuery && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <p>Nenhuma música encontrada.</p>
              <p className="text-sm">Tente outra busca.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AddTrackModal;
