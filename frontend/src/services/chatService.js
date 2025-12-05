const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function preguntarAlBackend(texto) {
  const res = await fetch(`${API_URL}/preguntar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto }), 
  });

  if (!res.ok) {
    throw new Error("Error en la API");
  }

  const data = await res.json();
  return data.respuesta;
}
