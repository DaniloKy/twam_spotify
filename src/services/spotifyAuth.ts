
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = "http://127.0.0.1:5173/callback";
const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-private",
  "user-read-email",
  "user-follow-read",
  "user-follow-modify",
  "user-library-modify",
  "user-library-read",
  "streaming",
  "app-remote-control",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played"
];


function generateRandomString(length: number) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join("");
}

function base64urlencode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
}

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlencode(hashed);

  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const args = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge
  });

  window.location.href = `https://accounts.spotify.com/authorize?${args.toString()}`;
}

export function logoutFromSpotify() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_token_expiry");
  localStorage.removeItem("spotify_user_id");
  localStorage.removeItem("spotify_user_name");
  window.location.href = "/";
}

export function isLoggedIn(): boolean {
  const token = localStorage.getItem("spotify_access_token");
  const expiry = localStorage.getItem("spotify_token_expiry");
  if (!token || !expiry) return false;
  return Date.now() < parseInt(expiry);
}