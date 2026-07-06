from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import ChatMessage, StartupIdea, User
from ..schemas import ChatMessageCreate, ChatMessageResponse
from ..auth import get_current_user
from ..services.gemini import ask_mentor_question

router = APIRouter(prefix="/chat", tags=["Business Mentor Chat"])

@router.get("", response_model=List[ChatMessageResponse])
def get_chat_history(
    startup_idea_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id)
    if startup_idea_id:
        query = query.filter(ChatMessage.startup_idea_id == startup_idea_id)
    return query.order_by(ChatMessage.created_at.asc()).all()

@router.post("", response_model=ChatMessageResponse)
def send_chat_message(
    chat_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Fetch idea context if provided
    idea_dict = {}
    if chat_in.startup_idea_id:
        idea = db.query(StartupIdea).filter(
            StartupIdea.id == chat_in.startup_idea_id,
            StartupIdea.user_id == current_user.id
        ).first()
        if idea:
            idea_dict = {
                "name": idea.name,
                "industry": idea.industry,
                "description": idea.description,
                "problem": idea.problem,
                "solution": idea.solution,
                "target_audience": idea.target_audience,
                "business_model": idea.business_model,
                "revenue_model": idea.revenue_model,
                "expected_pricing": idea.expected_pricing,
                "expected_investment": idea.expected_investment,
                "expected_launch_date": idea.expected_launch_date
            }

    # 2. Save User Message
    user_msg = ChatMessage(
        user_id=current_user.id,
        startup_idea_id=chat_in.startup_idea_id,
        sender="user",
        message=chat_in.message
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # 3. Retrieve past message history to feed Gemini (limit to last 10 messages)
    history_msgs = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.startup_idea_id == chat_in.startup_idea_id
    ).order_by(ChatMessage.created_at.desc()).limit(10).all()
    
    # Reverse so it is in chronological order
    history_msgs.reverse()
    
    history_list = []
    for msg in history_msgs:
        # Exclude the current message we just added to keep it as new_question
        if msg.id == user_msg.id:
            continue
        history_list.append({
            "sender": msg.sender,
            "message": msg.message
        })

    # 4. Generate Mentor Response
    mentor_text = ask_mentor_question(
        idea=idea_dict,
        chat_history=history_list,
        new_question=chat_in.message
    )

    # 5. Save Mentor Message
    mentor_msg = ChatMessage(
        user_id=current_user.id,
        startup_idea_id=chat_in.startup_idea_id,
        sender="mentor",
        message=mentor_text
    )
    db.add(mentor_msg)
    db.commit()
    db.refresh(mentor_msg)

    # Return the mentor response so frontend can append it
    return mentor_msg
