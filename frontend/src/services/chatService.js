const API_URL = "http://localhost:8000"; // tu backend local

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
