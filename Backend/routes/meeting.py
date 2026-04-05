from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from utils.dependency import get_current_user
from utils.file_handler import save_upload
from services.video import extract_audio
from services.speech_to_text import transcribe
from services.nlp import generate_summary, extract_action_items
from database.db import meetings_collection
from datetime import datetime
from bson import ObjectId  # ADD THIS IMPORT
import requests

router = APIRouter(prefix="/meeting", tags=["Meeting"])

class QnARequest(BaseModel):
    question: str
    meeting_id: str | None = None  # Optional field




    
@router.get("/list")
async def list_meetings(
    user: str = Depends(get_current_user)
):
    meetings = list(meetings_collection.find({"user": user}).sort("created_at", -1))
    for meeting in meetings:
        meeting["_id"] = str(meeting["_id"])  # Convert ObjectId to string
    return meetings

@router.post("/process")
async def process_meeting(
    file: UploadFile = File(...),
    user: str = Depends(get_current_user)
):
    video_path = save_upload(file)
    audio_path = extract_audio(video_path)
    transcript = transcribe(audio_path)

    summary = generate_summary(transcript)
    actions = extract_action_items(transcript)

    meeting_data = {
        "user": user,
        "filename": file.filename,
        "transcript": transcript,
        "summary": summary,
        "action_items": actions,
        "created_at": datetime.utcnow()
    }
    
    result = meetings_collection.insert_one(meeting_data)
    
    return {
        "meeting_id": str(result.inserted_id),
        "filename": file.filename,
        "transcript": transcript,
        "summary": summary,
        "action_items": actions
    }



 

@router.post("/ask")
async def ask_question(
    request: QnARequest,
    user: str = Depends(get_current_user)
):
    # Check if user has meetings
    meetings = list(meetings_collection.find({"user": user}))
    if not meetings:
        raise HTTPException(status_code=404, detail="No meetings found for this user")
    
    # Specific meeting by _id
    if request.meeting_id:
        try:
            meeting_oid = ObjectId(request.meeting_id)  # Convert string to ObjectId
            meeting = meetings_collection.find_one({
                "user": user,
                "_id": meeting_oid  # Query by actual _id field
            })
            if not meeting:
                raise HTTPException(status_code=404, detail="Meeting not found")
            context = f"Meeting: {meeting['filename']}\n\nTranscript: {meeting['transcript']}\n\nSummary: {meeting['summary']}"
        except:
            raise HTTPException(status_code=400, detail="Invalid meeting_id format")
    else:
        # All user's meetings
        context = "\n\n".join([
            f"Meeting: {m['filename']}\nTranscript: {m['transcript'][:500]}...\nSummary: {m['summary']}"
            for m in meetings[:3]  # Limit to 3 meetings
        ])
    
    # Ollama Gemma Q&A
    prompt = f"""You are a helpful meeting assistant. Answer ONLY based on the meeting content provided.

MEETING CONTENT:
{context}

QUESTION: {request.question}

Answer concisely:"""
    
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "gemma:2b",
        "prompt": prompt,
        "stream": False
    })
    
    if response.status_code == 200:
        ai_answer = response.json()["response"].strip()
        return {
            "question": request.question,
            "answer": ai_answer,
            "meetings_used": len(meetings)
        }
    else:
        raise HTTPException(status_code=500, detail="AI model unavailable")

# ✅ FRONTEND COMPATIBILITY ROUTES

# Upload (frontend calls this)
@router.post("/upload")
async def upload_alias(
    file: UploadFile = File(...),
    user: str = Depends(get_current_user)
):
    return await process_meeting(file, user)


# Ask (frontend calls this)
@router.post("/qa/ask")
async def ask_alias(
    request: QnARequest,
    user: str = Depends(get_current_user)
):
    return await ask_question(request, user)  
