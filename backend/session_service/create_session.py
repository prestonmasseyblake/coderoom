from fastapi import FastAPI
from uuid import uuid4
from datetime import datetime 

app = FastAPI()

sessions = {}

@app.get("/status")
def root():
    return {"message":"hello"}

@app.post("/generate_session")
async def generate_session():
    session_id = str(uuid4())
    edit_token = str(uuid4())

    session = {
        "session_id": session_id,
        "edit_token": edit_token,
        "language": "python",
        "created_at": datetime.utcnow().isoformat(),
        "current_content": ""
    }

    sessions[session_id] = session 

    return {
        
        "session_id": session_id,
        "share_url": f"/s/{session_id}",
        "edit_token": edit_token,
        "language": "python"
    }


