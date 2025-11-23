type TrackCardProps = {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    duration_ms: number;
    external_urls: {spotify: string}
  };
};

const TrackCard = ({ track }: TrackCardProps) => {
  const minutes = Math.floor(track.duration_ms / 60000);
  const seconds = Math.floor((track.duration_ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const albumImage = track.album?.images?.[1]?.url || ""; // medium image preferred
  console.log("AAAAAAAAAAAA");
  console.log(track);
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
    <div className="flex items-center gap-4 p-3 rounded-xl shadow-md hover:bg-gray-800 transition">
      <img
        src={albumImage}
        alt={`${track.name} album art`}
        className="w-16 h-16 rounded"
      />
      <div>
        <p className="font-semibold">{track.name}</p>
        <p className="text-sm text-gray-600">
          {artistNames} • {track.album.name}
        </p>
        <p className="text-xs text-gray-500">
          {minutes}:{seconds}
        </p>
      </div>
    </div>
    </a>
  );
};

export default TrackCard;
