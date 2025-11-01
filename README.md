# JuraGPT Legal RAG Chat

Public-facing chat interface for JuraGPT, a legal AI assistant with:
- 325,456 German & EU law vectors
- Real-time hallucination detection
- Sentence-level verification

## Backend
Powered by GCP VM running Docker microservices:
- Retrieval (Qdrant Cloud)
- Verification (sentence-level auditing)
- Orchestrator (API gateway)

## API
Backend API: `http://34.78.185.56/api/orchestrator/`
