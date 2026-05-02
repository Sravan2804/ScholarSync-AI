from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.agent import ResearchAgentManager

app = FastAPI(title="ScholarSync AI API", version="1.0.0")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    assignment_statement: str
    contradiction_toggle: bool = False

class ResearchResponse(BaseModel):
    status: str
    outline: str
    links: List[Dict[str, Any]]
    source_mapping: Dict[str, List[str]]

manager = ResearchAgentManager()

@app.post("/analyze", response_model=ResearchResponse)
async def analyze_assignment(request: ResearchRequest):
    try:
        result = await manager.run_research_workflow(
            request.assignment_statement, 
            request.contradiction_toggle
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}
