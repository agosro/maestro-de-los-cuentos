import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { cuentos } from "../data/cuentosData";

export default function StoryDetail() {
  const { id } = useParams();

  // Scroll al top cuando se carga el cuento
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Buscar el cuento por ID
  const cuento = cuentos.find((c) => c.id === id);

  if (!cuento) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-centertext-3xl font-bold text-gray-700 mb-4">
          Cuento no encontrado 😿
        </h2>
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-blue-200 text-blue-800 font-medium hover:bg-blue-300 transition "
          onClick={() => {
            setTimeout(() => {
              document.getElementById("cuentos")?.scrollIntoView({ behavior: "smooth" });
            }, 0);
          }}
        >
          Volver a los cuentos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* Botón volver */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-blue-100 text-blue-800 rounded-full shadow hover:bg-blue-200 transition"
        onClick={() => {
          setTimeout(() => {
            document.getElementById("cuentos")?.scrollIntoView({ behavior: "smooth" });
          }, 0);
        }}
      >
        <span>←</span> Volver a los cuentos
      </Link>

      {/* Card principal */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">

        {/* Header del cuento */}
        <div className="bg-blue-100 py-6 px-6 flex justify-center items-center relative">
          <h1 className="text-4xl font-bold text-gray-800">{cuento.titulo}</h1>
          <span className="text-yellow-500 text-xl absolute right-6">✨🧚</span>
        </div>

        {/* Imagen */}
        <div className="w-full flex justify-center mt-8">
          <img
            src={cuento.imagen}
            alt={cuento.titulo}
            className="
              w-full
              max-w-3xl
              rounded-3xl
              object-cover
              shadow-[0_0_40px_rgba(135,180,255,0.5)]
            "
          />
        </div>

        {/* Contenido */}
        <div className="px-8 py-10 text-lg leading-relaxed text-gray-700 whitespace-pre-line">
          {cuento.contenido}
        </div>
      </div>
    </div>
  );
}
