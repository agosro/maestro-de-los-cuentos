// src/components/MagicInfoSection.jsx
import gatito from "../assets/gato-lectura.png";

export default function MagicInfoSection() {
  return (
    <section className="bg-[#E7F1F7] py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14">

        {/* Texto */}
        <div className="flex-1">
          <span className="inline-block bg-white shadow-sm px-4 py-2 rounded-full text-sm text-[#1B3B5A] mb-6">
            ✨ Sobre la magia
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#1B3B5A] mb-6">
            Un mundo de historias para soñar
          </h2>

          <p className="text-[#4A6275] text-lg mb-10 max-w-lg">
            El Maestro de los Cuentos es un gatito mágico que ama contar historias.
            Cada cuento despierta la imaginación y transmite valores importantes
            de una forma divertida y encantadora.
          </p>

          {/* Tarjetas */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-md p-6 flex items-start gap-4">
              <span className="text-2xl">📘</span>
              <div>
                <h3 className="font-semibold text-[#1B3B5A] text-lg">Cuentos Únicos</h3>
                <p className="text-[#4A6275] text-sm">
                  Historias originales llenas de enseñanzas valiosas.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6 flex items-start gap-4">
              <span className="text-2xl">💙</span>
              <div>
                <h3 className="font-semibold text-[#1B3B5A] text-lg">Valores Importantes</h3>
                <p className="text-[#4A6275] text-sm">
                  Cada cuento transmite amistad, respeto y bondad.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6 flex items-start gap-4">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="font-semibold text-[#1B3B5A] text-lg">Magia Interactiva</h3>
                <p className="text-[#4A6275] text-sm">
                  Hacé preguntas al Maestro de los Cuentos y descubrí más.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex-1 flex justify-center">
          <img
            src={gatito}
            alt="Gatito mágico leyendo"
            className="w-[380px] rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
