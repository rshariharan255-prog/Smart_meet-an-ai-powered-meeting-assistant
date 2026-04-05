import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_summary(text):
    prompt = f"""
    Create a comprehensive meeting summary from this transcript. Include:
    - Main topics discussed
    - Key decisions made
    - Important points raised
    - Next steps

    Transcript:
    {text}
    
    Summary:"""
    
    response = requests.post(OLLAMA_URL, json={
        "model": "gemma:2b",
        "prompt": prompt,
        "stream": False
    })
    
    return response.json()["response"]

def extract_action_items(text):
    prompt = f"""
    Extract all action items, tasks, and decisions from this meeting transcript.
    Format each action item clearly with:
    - What needs to be done
    - Who is responsible (if mentioned)
    - Deadline (if mentioned)
    - Priority (if mentioned)

    Transcript:
    {text}
    
    Action Items:"""
    
    response = requests.post(OLLAMA_URL, json={
        "model": "gemma:2b",
        "prompt": prompt,
        "stream": False
    })
    
    return response.json()["response"]