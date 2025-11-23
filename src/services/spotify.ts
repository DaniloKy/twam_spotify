import axios from "axios";

function getAccessToken(): string | null {
  return localStorage.getItem("spotify_access_token");
}

export async function searchPlaylists(query: string) {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.warn("Token não encontrado.");
    return [];
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: "playlist",
        limit: 5,
      },
    });

    return response.data.playlists.items;
  } catch (error: any) {
    console.error("Erro ao buscar playlists:", error.response?.data || error.message);
    return [];
  }
}

export async function getPlaylistDetails(playlistId: string) {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.warn("Token not found");
    return null;
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching playlist details:", error.response?.data || error.message);
    return null;
  }
}


export async function getUserDetails() {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.warn("Token not found");
    return null;
  }
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching playlist details:", error.response?.data || error.message);
    return null;
  }
}

export async function getUserPlaylists() {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.warn("Token não encontrado.");
    return [];
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 50, // Maximum number of playlists to retrieve
      },
    });

    return {
      items: response.data.items,
      total: response.data.total
    };
  } catch (error: any) {
    console.error("Erro ao buscar playlists do usuário:", error.response?.data || error.message);
    return { items: [], total: 0 };
  }
}

export async function createPlaylist(
  title: string,
  description?: string
) {
  const token = localStorage.getItem("spotify_access_token");
  const userId = localStorage.getItem("spotify_user_id");
  
  if (!token || !userId) {
    throw new Error("Usuário não autenticado");
  }
  
  try {
    // Using the specific user ID in the endpoint
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: title,
        description: description || undefined,
        public: false
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    // Provide more detailed error information
    console.error("Error creating playlist:", error.response?.status, error.response?.data || error.message);
    throw new Error("Erro ao criar playlist: " + (error.response?.data?.error?.message || error.message));
  }
}

export async function searchTracks(query: string) {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.warn("Token não encontrado.");
    return [];
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: "track",
        limit: 10,
      },
    });

    return response.data.tracks.items;
  } catch (error: any) {
    console.error("Erro ao buscar músicas:", error.response?.data || error.message);
    return [];
  }
}

export async function addTrackToPlaylist(playlistId: string, trackUri: string) {
  const token = localStorage.getItem("spotify_access_token");
  
  if (!token) {
    throw new Error("Usuário não autenticado");
  }
  
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: [trackUri]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Erro ao adicionar música:", error.response?.status, error.response?.data || error.message);
    throw new Error("Erro ao adicionar música: " + (error.response?.data?.error?.message || error.message));
  }
}

export async function removeTrackFromPlaylist(playlistId: string, trackUri: string) {
  const token = localStorage.getItem("spotify_access_token");
  
  if (!token) {
    throw new Error("Usuário não autenticado");
  }
  
  try {
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          tracks: [{ uri: trackUri }]
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Erro ao remover música:", error.response?.status, error.response?.data || error.message);
    throw new Error("Erro ao remover música: " + (error.response?.data?.error?.message || error.message));
  }
}

export async function getUserReviews(userId: string) {
  try {
    // Primeiro, buscamos todas as avaliações do usuário
    const reviewsResponse = await axios.get(`http://localhost:3001/reviews?userId=${userId}`);
    const reviews = reviewsResponse.data;
    
    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Para cada avaliação, buscamos os detalhes da playlist
    const reviewsWithPlaylistDetails = await Promise.all(
      reviews.map(async (review: any) => {
        try {
          const playlistDetails = await getPlaylistDetails(review.playlistId);
          return {
            ...review,
            rating: review.estrelas, // Mantendo consistência com o nome da propriedade
            comment: review.descricao,
            createdAt: review.data,
            playlistName: playlistDetails?.name || 'Playlist',
            playlistImage: playlistDetails?.images?.[0]?.url || '/placeholder-playlist.png'
          };
        } catch (error) {
          console.error(`Erro ao buscar detalhes da playlist ${review.playlistId}:`, error);
          return {
            ...review,
            rating: review.estrelas,
            comment: review.descricao,
            createdAt: review.data,
            playlistName: 'Playlist',
            playlistImage: '/placeholder-playlist.png'
          };
        }
      })
    );
    
    return reviewsWithPlaylistDetails;
  } catch (error) {
    console.error("Erro ao buscar avaliações do usuário:", error);
    return [];
  }
}
