import logo from "../assets/logo-gato.png";

export default function Footer() {
  return (
    <footer className="bg-[#C7DFF5] text-[#1B3B5A] py-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <p>© 2025 El Maestro de los Cuentos</p>

        <div className="flex items-center gap-2">
          <span className="text-yellow-600">✨</span>
          <span>Un mundo de historias mágicas</span>
        </div>

        <img src={logo} className="w-14 h-14" />
      </div>
    </footer>
  );
}
