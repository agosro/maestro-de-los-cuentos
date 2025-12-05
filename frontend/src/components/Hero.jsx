import bgHero from "../assets/hero-bg.jpg";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center text-center py-40 px-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAF3FA]/20 to-[#EAF3FA]/80"></div>

      <div className="relative z-10 max-w-3xl">
        <span className="px-4 py-2 rounded-full bg-white/90 text-[#1B3B5A] shadow text-sm font-semibold inline-block mb-3">
          ✨ Un mundo de historias mágicas ✨
        </span>

        <h2 className="text-5xl font-extrabold text-[#1B3B5A] leading-tight">
          Descubrí historias mágicas <br />
          y hacé preguntas al <br />
          <span className="text-[#557CBA]">Maestro de los Cuentos</span>
        </h2>

        <p className="text-[#1B3B5A] mt-4 text-lg font-light">
          Un gatito mágico te guiará por aventuras increíbles llenas de enseñanzas y alegría.
        </p>

        <a
          href="#cuentos"
          className="mt-8 inline-block bg-[#F2C75B] hover:bg-[#E8B645] transition px-8 py-3 rounded-full text-[#1B3B5A] font-semibold shadow-md"
          >
          📖 Explorar cuentos
          </a>

      </div>
    </section>
  );
}
