from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import RAG_answer   # Asegurate que tu archivo se llame rag.py

app = FastAPI()

# Habilitar CORS para permitir requests desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # mucho más seguro que "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pregunta(BaseModel):
    texto: str

@app.post("/preguntar")
async def preguntar(data: Pregunta):
    respuesta = RAG_answer(data.texto)
    return {"respuesta": respuesta}

@app.get("/")
def root():
    return {"status": "API funcionando 🐱📖✨"}
