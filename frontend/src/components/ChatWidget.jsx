/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import chatIcon from "../assets/logo-gato.png";
import { preguntarAlBackend } from "../services/chatService";

export default function ChatWidget() {
  const { isChatOpen, closeChat } = useContext(ChatContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "¡Hola! Soy el Maestro de los Cuentos 📚🌟 ¿Qué te gustaría saber sobre las historias mágicas?",
    },
  ]);
  const [typing, setTyping] = useState(false); // ← nuevo estado
  const messagesEndRef = useRef(null); // ← para autoscroll

  // Sincronizar con el context
  useEffect(() => {
    setOpen(isChatOpen);
  }, [isChatOpen]);

  // ⬇⬇ Autoscroll cuando llegan mensajes o typing cambia
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);


  // ⬇⬇ Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim()) return;

    const pregunta = input;
    setInput("");

    // agregar mensaje del usuario
    setMessages((prev) => [...prev, { from: "user", text: pregunta }]);

    // activar indicador "escribiendo…"
    setTyping(true);

    try {
      const respuesta = await preguntarAlBackend(pregunta);

      // ocultar typing y responder
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: respuesta }
      ]);

    } catch (err) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Ups… hubo un error al responder 😿" },
      ]);
    }
  };


  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* BOTÓN FLOTANTE */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full shadow-xl bg-white border-2 border-blue-200 flex items-center justify-center hover:scale-105 transition"
        >
          <img src={chatIcon} alt="chat" className="w-12 h-12" />
        </button>
      )}

      {/* PANEL DEL CHAT */}
      {open && (
        <div className="w-[400px] h-[470px] bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col animate-fadeIn">

          {/* Header */}
          <div className="bg-blue-200 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={chatIcon} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-[#1B3B5A]">Maestro de los Cuentos</p>
                <p className="text-xs text-green-700 font-medium">● En línea</p>
              </div>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                closeChat();
              }}
              className="text-gray-600 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] shadow
                  ${msg.from === "user"
                    ? "bg-blue-200 ml-auto text-left"  
                    : "bg-white text-left"
                  }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Indicador de "escribiendo…" */}
            {typing && (
              <div className="p-2 px-4 bg-white text-gray-500 rounded-xl shadow max-w-[60%]">
                El Maestro está escribiendo…
              </div>
            )}

            <div ref={messagesEndRef} /> {/* autoscroll anchor */}

          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-3">
            <input
              type="text"
              placeholder="Escribí tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2 bg-blue-50 rounded-xl outline-none border border-blue-100"
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-blue-200 hover:bg-blue-300 rounded-full"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
