from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from ..models import StartupIdea, Prediction, User
from ..schemas import StartupIdeaCreate, StartupIdeaResponse, StartupIdeaDetailResponse, DashboardSummary
from ..auth import get_current_user

router = APIRouter(prefix="/ideas", tags=["Startup Ideas"])

@router.post("", response_model=StartupIdeaResponse, status_code=status.HTTP_201_CREATED)
def create_idea(idea_in: StartupIdeaCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_idea = StartupIdea(
        user_id=current_user.id,
        name=idea_in.name,
        industry=idea_in.industry,
        country=idea_in.country,
        description=idea_in.description,
        problem=idea_in.problem,
        solution=idea_in.solution,
        target_audience=idea_in.target_audience,
        business_model=idea_in.business_model,
        revenue_model=idea_in.revenue_model,
        expected_pricing=idea_in.expected_pricing,
        marketing_budget=idea_in.marketing_budget,
        team_size=idea_in.team_size,
        founder_experience=idea_in.founder_experience,
        competition_level=idea_in.competition_level,
        expected_investment=idea_in.expected_investment,
        expected_launch_date=idea_in.expected_launch_date
    )
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

@router.get("", response_model=List[StartupIdeaResponse])
def get_ideas(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(StartupIdea).filter(StartupIdea.user_id == current_user.id).all()

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ideas = db.query(StartupIdea).filter(StartupIdea.user_id == current_user.id).all()
    total_ideas = len(ideas)
    if total_ideas == 0:
        return {
            "total_ideas": 0,
            "average_success_probability": 0.0,
            "high_readiness_count": 0,
            "total_predicted_revenue_y1": 0.0,
            "average_market_risk": 0.0
        }
        
    idea_ids = [idea.id for idea in ideas]
    predictions = db.query(Prediction).filter(Prediction.startup_idea_id.in_(idea_ids)).all()
    
    total_predictions = len(predictions)
    avg_success = sum([p.success_probability for p in predictions]) / total_predictions if total_predictions > 0 else 0.0
    high_readiness = sum([1 for p in predictions if p.funding_readiness == "High"])
    total_rev_y1 = sum([p.revenue_y1 for p in predictions])
    avg_market_risk = sum([p.risk_market for p in predictions]) / total_predictions if total_predictions > 0 else 0.0
    
    return {
        "total_ideas": total_ideas,
        "average_success_probability": round(avg_success, 1),
        "high_readiness_count": high_readiness,
        "total_predicted_revenue_y1": round(total_rev_y1, 2),
        "average_market_risk": round(avg_market_risk, 1)
    }

@router.get("/{idea_id}", response_model=StartupIdeaDetailResponse)
def get_idea_detail(idea_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    idea = db.query(StartupIdea).filter(
        StartupIdea.id == idea_id, 
        StartupIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Startup idea not found")
        
    return {
        "idea": idea,
        "prediction": idea.prediction,
        "report": idea.report
    }

@router.delete("/{idea_id}", status_code=204)
def delete_idea(idea_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    idea = db.query(StartupIdea).filter(
        StartupIdea.id == idea_id,
        StartupIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Startup idea not found")
        
    db.delete(idea)
    db.commit()
    return None
