import os
import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from tavily import TavilyClient
from supabase import create_client, Client

# Load environment variables
load_dotenv()

async def test_deepseek():
    print("Testing DeepSeek API (OpenRouter)...")
    try:
        llm = ChatOpenAI(
            model="deepseek/deepseek-r1-0528", 
            api_key=os.getenv("OPENROUTER_DEEPSEEK_KEY"), 
            base_url="https://openrouter.ai/api/v1",
            max_tokens=2048
        )
        response = llm.invoke("Hi, please reply with 'DeepSeek OK'")
        print(f"[OK] DeepSeek: {response.content}")
        return True
    except Exception as e:
        print(f"[ERROR] DeepSeek Error: {e}")
        return False

async def test_groq():
    print("\nTesting LLaMA API (OpenRouter)...")
    try:
        llm = ChatOpenAI(
            model="meta-llama/llama-4-scout", 
            api_key=os.getenv("OPENROUTER_LLAMA_KEY"),
            base_url="https://openrouter.ai/api/v1"
        )
        response = llm.invoke("Hi, please reply with 'LLaMA OK'")
        print(f"[OK] LLaMA: {response.content}")
        return True
    except Exception as e:
        print(f"[ERROR] LLaMA Error: {e}")
        return False

async def test_google():
    print("\nTesting Gemma 4 API (OpenRouter)...")
    try:
        llm = ChatOpenAI(
            model="google/gemma-4-26b-a4b-it:free", 
            api_key=os.getenv("OPENROUTER_GEMMA_KEY"),
            base_url="https://openrouter.ai/api/v1"
        )
        response = llm.invoke("Hi, please reply with 'Gemma OK'")
        print(f"[OK] Gemma: {response.content}")
        return True
    except Exception as e:
        print(f"[ERROR] Gemma Error: {e}")
        return False

def test_tavily():
    print("\nTesting Tavily API...")
    try:
        tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
        search = tavily.search(query="ScholarSync AI", max_results=1)
        print(f"[OK] Tavily: Found {len(search['results'])} results")
        return True
    except Exception as e:
        print(f"[ERROR] Tavily Error: {e}")
        return False

def test_supabase():
    print("\nTesting Supabase Connection...")
    try:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            print("[ERROR] Supabase: URL or Key missing in .env")
            return False
        supabase: Client = create_client(url, key)
        supabase.storage.list_buckets()
        print("[OK] Supabase: Connection successful")
        return True
    except Exception as e:
        print(f"[ERROR] Supabase Error: {e}")
        return False

async def main():
    print("--- ScholarSync AI API Key Validation ---\n")
    results = {
        "DeepSeek": await test_deepseek(),
        "Groq": await test_groq(),
        "Google Gemini": await test_google(),
        "Tavily": test_tavily(),
        "Supabase": test_supabase()
    }
    
    print("\n--- Summary ---")
    for service, status in results.items():
        print(f"{service}: {'WORKING' if status else 'FAILED'}")

if __name__ == "__main__":
    asyncio.run(main())
