import { Link } from "react-router-dom";

export default function StoryCard({ title, img, id }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-[350px] md:w-[380px]">
        <img
          src={img}
          alt={title}
          className="w-full h-[360px] object-cover"
        />

        <div className="p-6 text-center">
          <h3 className="text-2xl font-semibold text-[#1B3B5A] mb-4">
            {title}
          </h3>

          <Link
            to={`/cuento/${id}`}
            className="inline-block bg-[#8CCBE6] hover:bg-[#74b9d6] text-white font-medium px-6 py-3 rounded-full transition"
          >
            📖 Leer cuento
          </Link>
        </div>
      </div>
    </div>
  );
}
