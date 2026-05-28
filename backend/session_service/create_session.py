from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, HTTPException

from .db import CodingSession, SessionLocal, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure the sessions table exists before serving requests.
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/status")
def root():
    return {"message": "hello"}


@app.post("/generate_session")
def generate_session():
    session_id = str(uuid4())
    edit_token = str(uuid4())

    with SessionLocal() as db:
        db.add(
            CodingSession(
                session_id=session_id,
                edit_token=edit_token,
                language="python",
                current_content="",
            )
        )
        db.commit()

    return {
        "session_id": session_id,
        "share_url": f"/s/{session_id}",
        "edit_token": edit_token,
        "language": "python",
    }


@app.get("/session/{session_id}")
def get_session(session_id: str):
    with SessionLocal() as db:
        row = db.get(CodingSession, session_id)
        if row is None:
            raise HTTPException(status_code=404, detail="session not found")
        return {
            "session_id": row.session_id,
            "language": row.language,
            "current_content": row.current_content,
            "created_at": row.created_at.isoformat(),
        }
