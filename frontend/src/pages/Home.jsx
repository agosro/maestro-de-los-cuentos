import Hero from "../components/Hero";
import StoryCard from "../components/StoryCard";
import MagicInfoSection from "../components/MagicInfoSection";

import sol from "../assets/solyluna.jpg";
import tica from "../assets/tica.jpg";
import puck from "../assets/duende.jpg";

export default function Home() {
  return (
    <div>

      {/* HERO - ARRIBA DEL TODO */}
      <section id="inicio">
        <Hero />
      </section>

      {/* LISTADO DE CUENTOS */}
      <section
        id="cuentos"
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-10">
          <span className="bg-white shadow px-4 py-2 rounded-full text-[#1B3B5A] text-sm">
            ✨ Historias mágicas
          </span>

          <h2 className="text-5xl font-bold text-[#1B3B5A] mt-6">
            Nuestros Cuentos
          </h2>

          <p className="text-[#1B3B5A]/70 mt-2">
            Elegí una historia y dejá que la magia te lleve a mundos increíbles
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
            <StoryCard title="Sol y Luna" img={sol} id="sol-y-luna" />
            <StoryCard title="La Tortuga Tica" img={tica} id="la-tortuga-tica" />
            <StoryCard title="El Duende Puck" img={puck} id="el-duende-puck" />
        </div>
      </section>

      {/* SECCIÓN DE MAGIA */}
      <section id="magia">
        <MagicInfoSection />
      </section>

    </div>
  );
}
