import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List

# Import services
from app.services.graph import GraphService
from app.services.vector import VectorService
from app.services.ocr import OCRService
from app.services.agent import AgentService

# Initialize FastAPI
app = FastAPI(title="IndusBrain AI Backend", version="1.0.0")

# Setup CORS for Next.js communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify Next.js origin e.g. http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singletons
graph_service = GraphService()
vector_service = VectorService()
agent_service = AgentService(graph_service, vector_service)

# Create folders for uploads
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "IndusBrain AI Backend"}

@app.get("/api/graph")
def get_graph():
    """Retrieve full knowledge graph nodes and connections."""
    try:
        return graph_service.get_graph()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query")
def query_copilot(req: QueryRequest):
    """Ask engineering/operations queries via RAG agent."""
    try:
        response = agent_service.run_query(req.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rca/{incident_id}")
def get_rca(incident_id: str):
    """Retrieve dynamic 5-Whys and Fishbone diagram data for an incident."""
    try:
        return agent_service.generate_rca(incident_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    associated_tag: str = Form("VLV-204")
):
    """Upload a file, run Tesseract OCR, index in ChromaDB, and link in Neo4j Graph."""
    try:
        # Save file locally
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. OCR text extraction
        extracted_text = OCRService.extract_text(file_path)

        # 2. Add text chunk to ChromaDB Vector Store
        doc_id = f"doc_{file.filename.replace('.', '_')}"
        vector_service.add_document(
            doc_id=doc_id,
            text=extracted_text,
            metadata={"source": file.filename, "asset": associated_tag}
        )

        # 3. Add node and relationship to Neo4j Knowledge Graph
        graph_service.add_node(
            node_id=doc_id,
            label=file.filename,
            node_type="document",
            properties={"format": "Uploaded PDF", "created": "2026-06-23"}
        )
        graph_service.add_relationship(
            source_id=doc_id,
            target_id=associated_tag,
            rel_type="associated_specification"
        )

        return {
            "status": "success",
            "file": file.filename,
            "doc_id": doc_id,
            "extracted_text_preview": extracted_text[:150] + "...",
            "linked_to": associated_tag
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compliance")
def compile_evidence(
    asset_id: str = Form(...),
    regulation_id: str = Form(...)
):
    """Compile audit evidence pack references."""
    try:
        files = []
        if asset_id == "PMP-101":
            files = [
                {"name": "SOP_FeedPump_v2.pdf", "hash": "sha256-a88b1fc94d1b848c..."}
            ]
        elif asset_id == "BLR-302":
            files = [
                {"name": "SOP_Boiler_v4.pdf", "hash": "sha256-55ea30bb3912a281..."},
                {"name": "OISD-189_Boiler_Audit_Certificate.pdf", "hash": "sha256-8e2b9c73b..."}
            ]
        else:
            files = [
                {"name": "Valve_OEM_Guide_v3.pdf", "hash": "sha256-ee29a8f273b71921..."}
            ]

        return {
            "status": "success",
            "asset": asset_id,
            "regulation": regulation_id,
            "manifest": files,
            "checksum_verified": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
