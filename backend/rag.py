import os
from collections import Counter
import random

# Librerías para manejo de entorno y API
from dotenv import load_dotenv
import cohere
import chromadb

# Librería para Chunking
from langchain_text_splitters import RecursiveCharacterTextSplitter

# --------------------------------------------------------------------------------
# 1. ENVIRONMENT SETUP
# --------------------------------------------------------------------------------

# Cargar variables de entorno (asegúrate de tener un archivo .env con COHERE_API_KEY)
load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")

# Inicializar Cliente Cohere v2
if not COHERE_API_KEY:
    raise ValueError("No se encontró la COHERE_API_KEY en las variables de entorno.")

co = cohere.ClientV2(api_key=COHERE_API_KEY)

# Configuración de Modelos
EMBEDDING_MODEL = "embed-multilingual-v3.0"     
CHAT_MODEL = "command-r-plus-08-2024"           

# Cliente ChromaDB en memoria
chroma_client = chromadb.Client()
COLLECTION_NAME = "historias_ninos_rag"

# Variable global para la colección
historias_collection = None

print("Entorno listo: Cohere + Chroma + helpers cargados")

# --------------------------------------------------------------------------------
# 2. FUNCIONES HELPER
# --------------------------------------------------------------------------------

def get_embeddings(textos):
    """
    Dada una lista de strings, devuelve la lista de embeddings (listas de floats)
    usando Cohere embeddings.
    Se eligió 'embed-multilingual-v3.0' por su buen desempeño en español.
    """
    response = co.embed(
        texts=textos,
        model=EMBEDDING_MODEL,
        input_type="search_document",
        embedding_types=["float"],
    )
    return response.embeddings.float_

def contar_tokens(texto):
    """
    Cuenta tokens para validar que los chunks no excedan el límite del modelo de embedding.
    """
    resp = co.tokenize(
        text=texto,
        model=EMBEDDING_MODEL
    )
    return len(resp.tokens)

def build_prompt(contexto: str, pregunta: str) -> list:
    """
    Construye el prompt del sistema con la personalidad de narrador infantil.
    Define reglas estrictas de seguridad y grounding (RAG).
    """
    system_msg = (
        "**Rol:**\n"
        "Sos un narrador infantil cálido y entusiasta. Tu función es ayudar a niños y niñas a entender historias.\n\n"
        
        "**Identidad:**\n"
        "Representás a un asistente pedagógico simple y amigable. No improvisás datos: solo respondés con información presente en el contexto proporcionado.\n\n"
        
        "**Idioma:**\n"
        "Respondés únicamente en español castellano rioplatense.\n\n"
        
        "**Estilo:**\n"
        "- Máximo 3 oraciones.\n"
        "- Tono amable y cercano.\n"
        "- Incluí emojis.\n"
        "- No inventes información.\n\n"
        
        "**Reglas de Seguridad:**\n"
        "1. No proporciones información sensible o inventada.\n"
        "2. Si falta información, explicalo de forma amable.\n"
        "3. No agregues contenido inapropiado.\n\n"
        
        "**Reglas de Grounding (RAG):**\n"
        "1. Usá exclusivamente el contenido dentro de <CONTEXT>.\n"
        "2. Si el contexto no contiene la respuesta, decí: 'El contexto no provee esa información 🙂'.\n"
        "3. Mantené consistencia en respuestas repetidas.\n"
        "4. Si el contexto recuperado contiene fragmentos de más de una historia, debés responder SOLO sobre la historia que tenga información más directamente relacionada con la pregunta del usuario. No combines historias distintas en la misma respuesta.\n"
        "4. Si no podés determinar cuál historia corresponde, respondé: “El contexto no permite identificar una única historia para responder 🙂”.\n\n"
    )
    
    user_msg = (
        f"Contexto de historias para niños:\n\n{contexto}\n\n"
        f"Pregunta del niño o la niña: {pregunta}\n\n"
        "Responde siguiendo todas las instrucciones anteriores."
    )
    
    return [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_msg},
    ]

def RAG_answer(pregunta: str, k: int = 3) -> str:
    """
    Dada una pregunta del usuario:
    1) Recupera los k chunks más relevantes desde la base vectorial.
    2) Construye el prompt con ese contexto.
    3) Llama al LLM de Cohere para generar la respuesta.
    """
    # 1. Obtener embedding de la pregunta
    pregunta_embedding = get_embeddings([pregunta])
    
    # 2. Recuperar los k chunks más relevantes mediante similitud
    if historias_collection is None:
        return "Error: La base de datos vectorial no está inicializada."

    results = historias_collection.query(
        query_embeddings=pregunta_embedding,
        n_results=k
    )
    
    # results["documents"] es una lista de listas -> tomamos los top-k
    retrieved_docs = results["documents"][0]
    retrieved_metadatas = results["metadatas"][0]
    
    # 3. Crear contexto concatenando títulos + texto del chunk
    contexto = ""
    for texto, meta in zip(retrieved_docs, retrieved_metadatas):
        contexto += f"Título: {meta['titulo']}\nTexto: {texto}\n\n"
    
    # 4. Construir mensajes para el LLM
    messages = build_prompt(contexto, pregunta)
    
    # 5. Llamar al modelo de chat de Cohere (baja temperatura para respuestas consistentes)
    response = co.chat(
        model=CHAT_MODEL,
        messages=messages,
        temperature=0.2
    )
    
    respuesta = response.message.content[0].text
    return respuesta

# --------------------------------------------------------------------------------
# 3. CARGA Y PROCESAMIENTO DE DATOS
# --------------------------------------------------------------------------------

def main():
    global historias_collection

    # A. Datos de las historias
    historia_sol_luna = """
    Sol y Luna eran dos pequeños gatitos que habían nacido en la misma camada, pero sus
    personalidades no podían ser más diferentes. Sol, de un brillante color anaranjado, era
    aventurero y curioso; siempre buscando nuevas experiencias y explorando cada rincón de
    su hogar. Luna, en cambio, era de un suave pelaje gris y tenía un temperamento más
    sereno y observador. Pasaba horas contemplando el mundo desde la ventana, como si en
    cada sombra descubriera un misterio oculto.
    Una tarde, mientras Sol correteaba por el jardín persiguiendo mariposas, Luna permanecía
    en el alféizar, vigilando desde lejos. De repente, una fuerte tormenta comenzó a formarse
    en el horizonte. El viento sacudía las ramas de los árboles, y las gotas de lluvia empezaron
    a caer pesadamente. Sol, atrapado por su espíritu inquieto, no se dio cuenta de lo rápido
    que se acercaba la tormenta. Luna, desde su posición, sintió una inquietud que la hizo
    saltar del alféizar y correr hacia la puerta.
    Cuando Sol se dio cuenta de que estaba solo bajo la lluvia, el jardín que antes le parecía
    un paraíso se volvió un laberinto de sombras y ruidos extraños. La tormenta lo había
    desorientado, y por primera vez, el gatito sintió miedo. Justo cuando pensaba que no
    encontraría el camino de regreso, un suave maullido lo guió. Luna había salido a buscarlo,
    siguiendo su instinto y los rastros de su hermano. Juntos, bajo la lluvia, encontraron el
    camino de regreso a casa, compartiendo el calor de su compañía.
    De regreso al hogar, la tormenta se convirtió en un recuerdo lejano mientras los dos gatitos
    se acurrucaban cerca del fuego. Sol, agotado por la aventura, dormitaba tranquilo,
    mientras Luna lo vigilaba con ojos atentos. En ese momento, comprendieron que aunque
    eran diferentes como el día y la noche, siempre estarían ahí el uno para el otro. Su vínculo
    era más fuerte que cualquier tormenta.
    Desde aquel día, Sol aprendió a valorar la calma y la paciencia que Luna representaba,
    mientras que ella se permitió, de vez en cuando, dejarse llevar por la curiosidad de su
    hermano. Juntos, equilibraban sus mundos, iluminando cada rincón de su hogar con la
    calidez del Sol y el misterio de la Luna.
    """

    historia_tica = """
    Una tortuga llamada Tica vivía en un tranquilo estanque rodeado de árboles frondosos. A
    diferencia de sus compañeras, Tica soñaba con explorar más allá del agua tranquila y la
    suave hierba. Un día, decidió emprender una aventura, dejando atrás la comodidad de su
    hogar. Se adentró en el bosque, donde todo era nuevo: el susurro de las hojas, los aromas
    desconocidos y el crujir de las ramas bajo sus patas lentas pero firmes.
    Durante su viaje, Tica encontró un riachuelo de corriente rápida. Al principio, la idea de
    cruzarlo la asustó, pero recordó que cada desafío era una oportunidad. Con paciencia y
    determinación, encontró piedras que sobresalían del agua, usándolas como un puente
    improvisado. Paso a paso, logró cruzar, y al llegar al otro lado, sintió una nueva confianza
    crecer en su interior. El mundo era vasto, pero cada pequeño triunfo la hacía sentir más
    fuerte.
    En su camino, Tica conoció a un pájaro herido que no podía volar. Sin dudarlo, decidió
    ayudarlo, ofreciéndole un lugar seguro en su caparazón mientras buscaba un sitio
    adecuado para él. Después de horas de marcha, encontró un árbol lleno de otros pájaros
    que cuidaron de su nuevo amigo. Al despedirse, Tica comprendió que su viaje no solo era
    sobre descubrir nuevos lugares, sino también sobre ayudar a otros en el camino.
    Finalmente, tras días de aventuras, Tica regresó al estanque. Aunque nada había cambiado
    en su hogar, ella ya no era la misma. Había descubierto que, aunque avanzaba despacio,
    cada paso contaba. Su viaje le enseñó que la verdadera aventura está en el valor para
    enfrentar lo desconocido y la voluntad de ayudar a otros, incluso cuando el camino es
    largo y desafiante.
    """

    historia_duende = """
    Había un pequeño duende llamado Puck, conocido por su espíritu travieso y su amor por
    las bromas. Vivía en lo profundo del bosque, donde las criaturas del lugar sabían que, si
    algo extraño sucedía, era obra de él. Puck disfrutaba de hacer desaparecer objetos,
    cambiar las señales de los senderos y provocar pequeñas confusiones entre los animales.
    Sin embargo, su diversión nunca era malintencionada; simplemente, amaba ver las
    reacciones sorprendidas de los demás.
    Un día, decidió que quería jugarle una broma a la anciana hada que vivía cerca del arroyo.
    Ella, conocida por su sabiduría, siempre estaba en silencio, tejiendo sueños y
    pensamientos en su telar. Puck, con una sonrisa pícara, hechizó un par de hojas doradas
    para que se posaran sobre el telar de la hada. Cada vez que intentaba mover una hoja, esta
    volvía a su lugar, causando que la hada frunciera el ceño y murmurara palabras mágicas,
    buscando entender qué ocurría.
    Al ver que su broma causaba más confusión de lo esperado, Puck comenzó a sentirse un
    poco culpable. No quería que la hada se sintiera mal ni que su pequeña travesura
    interfiriera en su trabajo. Decidió entonces poner fin a la broma, pero no sin antes hacer
    algo más para solucionar las cosas. Usó su magia para hacer que las hojas se
    transformaran en pequeñas flores brillantes, que adornaron el telar y alegraron el entorno.
    La hada, al ver el cambio, sonrió, comprendiendo que Puck había hecho su travesura con
    buenas intenciones.
    Desde ese día, Puck aprendió que, aunque las bromas eran divertidas, también era
    importante ser considerado con los demás. Aunque seguía disfrutando de su naturaleza
    traviesa, nunca olvidó la lección que le enseñó la sabia hada: las risas compartidas son
    mucho más valiosas cuando se hacen con cariño y respeto.
    """

    documentos = [
        {"id": "sol_luna", "titulo": "Sol y Luna", "texto": historia_sol_luna},
        {"id": "tica", "titulo": "La tortuga Tica", "texto": historia_tica},
        {"id": "duende", "titulo": "El Duende", "texto": historia_duende},
    ]

    # B. Chunking
    # Se usa RecursiveCharacterTextSplitter.
    # chunk_size=500: Suficiente para contexto narrativo, pero pequeño para embeddings precisos.
    # chunk_overlap=50: Mantiene coherencia entre cortes.
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " "]
    )

    chunks = []
    for doc in documentos:
        trozos = text_splitter.split_text(doc["texto"])
        for i, trozo in enumerate(trozos):
            chunks.append({
                "id": f"{doc['id']}_chunk_{i}",
                "doc_id": doc["id"],
                "titulo": doc["titulo"],
                "texto": trozo
            })

    # Verificaciones opcionales
    conteo = Counter([c["doc_id"] for c in chunks])
    print(f"Chunks generados: {conteo}")

    tokens_por_chunk = [contar_tokens(c["texto"]) for c in chunks]
    print(f"Promedio de tokens por chunk: {sum(tokens_por_chunk) / len(tokens_por_chunk):.2f}")

    # C. Vector Store (ChromaDB)
    # Resetear si existe (para scripts repetitivos)
    try:
        chroma_client.delete_collection(name=COLLECTION_NAME)
    except:
        pass

    historias_collection = chroma_client.create_collection(name=COLLECTION_NAME)
    print("Colección creada:", historias_collection.name)

    # Preparar datos para inserción
    texts_chunks = [c["texto"] for c in chunks]
    ids_chunks = [c["id"] for c in chunks]
    metadatas_chunks = [
        {"doc_id": c["doc_id"], "titulo": c["titulo"]} for c in chunks
    ]

    # Generar embeddings
    print("Generando embeddings...")
    embeddings_chunks = get_embeddings(texts_chunks)

    # Insertar en Chroma
    historias_collection.add(
        documents=texts_chunks,
        ids=ids_chunks,
        metadatas=metadatas_chunks,
        embeddings=embeddings_chunks
    )
    print(f"Se cargaron {len(texts_chunks)} chunks en la base vectorial.")


main()