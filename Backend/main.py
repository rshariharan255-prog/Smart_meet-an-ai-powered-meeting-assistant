from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from routes.auth import router as auth_router
from routes.meeting import router as meeting_router  # FIXED: router, not meeting

app = FastAPI(title="AI Meeting Assistant")

# CORS - Allows frontend to call APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve old frontend (disabled)
# app.mount("/frontend", StaticFiles(directory="static", html=True), name="static")

# API Routes - NOT intercepted by static files
app.include_router(auth_router)
app.include_router(meeting_router)

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Meeting Assistant API</title>
    </head>
    <body style="font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center;">
        <h1>🤖 SmartMeet API</h1>
        <p>Backend is running successfully!</p>
        <p>Frontend is at: <a href="http://localhost:5173">http://localhost:5173</a></p>
        <p>API Docs: <a href="/docs">/docs</a></p>
    </body>
    </html>
    """