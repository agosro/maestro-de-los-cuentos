import { useContext } from "react";
import logo from "../assets/logo-gato.png";
import { Link } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";

export default function Header() {
  const { openChat } = useContext(ChatContext);

  return (
    <header className="bg-[#EAF3FA]/60 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-12 h-12" />
          <h1 className="text-xl font-bold text-[#1B3B5A]">
            El Maestro de los Cuentos
          </h1>
        </div>

        <nav className="flex gap-8 text-[#1B3B5A] font-medium">
            <Link to="/#inicio" onClick={() => setTimeout(() => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" }), 0)}>Inicio</Link>
            <Link to="/#cuentos" onClick={() => setTimeout(() => document.getElementById("cuentos")?.scrollIntoView({ behavior: "smooth" }), 0)}>Cuentos</Link>
            <button onClick={openChat} className="hover:text-blue-600 transition bg-none border-none cursor-pointer text-[#1B3B5A] font-medium">Chat</button>
            <Link to="/#magia" onClick={() => setTimeout(() => document.getElementById("magia")?.scrollIntoView({ behavior: "smooth" }), 0)}>Sobre la magia</Link>
        </nav>
      </div>
    </header>
  );
}
