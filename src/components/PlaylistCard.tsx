import { Link } from "react-router-dom";

export default function PlaylistCard({
  id,
  title,
  author,
  rating,
  cover,
  reviewCount = 0,
}: {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover: string;
  reviewCount?: number;
}) {
  return (
    <Link to={`/playlist/${id}`} className="block">
      <div className="bg-[#181818] p-4 rounded-2xl shadow-md hover:shadow-lg transition">
        <img
          src={cover}
          alt={`Capa da playlist ${title}`}
          className="w-full h-56 object-cover rounded-xl mb-4"
        />        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-sm text-spotify-light">Criador: {author}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-white font-semibold">{rating.toFixed(1)} ★</p>
          <p className="text-xs text-gray-400">{reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'}</p>
        </div>
      </div>
    </Link>
  );
}
