import os
from typing import Dict, Any, List, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from tavily import TavilyClient
from dotenv import load_dotenv

# Explicitly load from backend/.env regardless of where uvicorn is run
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(dotenv_path=env_path)

# Define the State for LangGraph
class AgentState(TypedDict):
    assignment: str
    contradiction_toggle: bool
    pillars: List[str]
    search_results: List[Dict[str, Any]]
    validated_links: List[Dict[str, Any]]
    blueprint: str
    source_mapping: Dict[str, List[str]]

class ResearchAgentManager:
    def __init__(self):
        # Initialize LLMs
        self.planner_llm = ChatOpenAI(
            model="deepseek-chat", 
            api_key=os.getenv("DEEPSEEK_API_KEY"), 
            base_url="https://api.deepseek.com/v1"
        )
        self.research_llm = ChatGroq(
            model_name="llama3-70b-8192", 
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        self.synthesis_llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro", 
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        self.tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

    def build_graph(self):
        workflow = StateGraph(AgentState)
        
        workflow.add_node("planner", self._planner_node)
        workflow.add_node("scout", self._scout_node)
        workflow.add_node("validator", self._validator_node)
        workflow.add_node("synthesizer", self._synthesizer_node)

        workflow.set_entry_point("planner")
        workflow.add_edge("planner", "scout")
        workflow.add_edge("scout", "validator")
        workflow.add_edge("validator", "synthesizer")
        workflow.add_edge("synthesizer", END)

        return workflow.compile()

    def _planner_node(self, state: AgentState):
        """Decomposition: Break prompt into 4 research pillars."""
        prompt = f"Break this assignment into 4 distinct academic research pillars: {state['assignment']}. Return only the titles separated by commas."
        response = self.planner_llm.invoke(prompt)
        pillars = [p.strip() for p in response.content.split(",")]
        return {"pillars": pillars[:4]}

    def _scout_node(self, state: AgentState):
        """Parallel Retrieval: Search for each pillar."""
        results = []
        for pillar in state["pillars"]:
            search = self.tavily.search(query=pillar, search_depth="advanced", max_results=3)
            for res in search['results']:
                results.append({
                    "pillar": pillar,
                    "title": res['title'],
                    "url": res['url'],
                    "content": res['content'],
                    "score": int(res.get('score', 0) * 100)
                })
        return {"search_results": results}

    def _validator_node(self, state: AgentState):
        """Validation: Filter for high-authority domains."""
        trusted_suffixes = (".edu", ".gov", "arxiv.org", "nature.com", "ieee.org")
        validated = [
            res for res in state["search_results"] 
            if any(res["url"].endswith(s) or s in res["url"] for s in trusted_suffixes)
        ]
        # If too few, just take top scores to avoid empty results
        if len(validated) < 2:
            validated = sorted(state["search_results"], key=lambda x: x['score'], reverse=True)[:5]
        return {"validated_links": validated}

    def _synthesizer_node(self, state: AgentState):
        """Synthesis: Generate Blueprint and Source Mapping."""
        context = "\n\n".join([f"Source: {r['url']}\nContent: {r['content']}" for r in state["validated_links"]])
        mode_instruction = "Focus on finding dissenting academic opinions for a rigorous debate." if state["contradiction_toggle"] else "Focus on a comprehensive academic synthesis."
        
        prompt = f"""
        Based on these sources, generate a Research Blueprint for: {state['assignment']}
        {mode_instruction}
        
        Include:
        1. A suggested Thesis.
        2. A 5-part detailed Outline.
        3. A "Gap Analysis" (what is missing from these sources).
        
        Format as clear Markdown.
        
        Sources context:
        {context}
        """
        response = self.synthesis_llm.invoke(prompt)
        
        # Build source mapping
        mapping = {}
        for link in state["validated_links"]:
            pillar = link.get("pillar", "General")
            if pillar not in mapping: mapping[pillar] = []
            mapping[pillar].append(link["url"])
            
        return {"blueprint": response.content, "source_mapping": mapping}

    async def run_research_workflow(self, assignment: str, contradiction_toggle: bool):
        graph = self.build_graph()
        result = graph.invoke({
            "assignment": assignment,
            "contradiction_toggle": contradiction_toggle,
            "pillars": [],
            "search_results": [],
            "validated_links": [],
            "blueprint": "",
            "source_mapping": {}
        })
        
        return {
            "status": "success",
            "outline": result["blueprint"],
            "links": [
                {
                    "id": i,
                    "title": r["title"],
                    "url": r["url"],
                    "domain": r["url"].split("/")[2],
                    "score": r["score"],
                    "snippet": r["content"][:200] + "..."
                } for i, r in enumerate(result["validated_links"])
            ],
            "source_mapping": result["source_mapping"]
        }
