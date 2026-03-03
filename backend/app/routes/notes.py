from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Note
from pydantic import BaseModel

router = APIRouter()

class NoteCreate(BaseModel):
    course_id: int
    content: str

@router.post("/save")
async def save_note(data: NoteCreate, db: Session = Depends(get_db)):
    new_note = Note(user_id=1, course_id=data.course_id, content=data.content)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return {"message": "Note saved successfully", "id": new_note.id}

@router.get("/{course_id}")
async def get_notes(course_id: int, db: Session = Depends(get_db)):
    notes = db.query(Note).filter(Note.course_id == course_id).all()
    return notes
