import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import StartupIdea, Prediction, Report, User
from ..schemas import StartupIdeaDetailResponse
from ..auth import get_current_user
from ..ml.predict import predict_startup_metrics
from ..services.gemini import (
    generate_swot_analysis,
    generate_lean_canvas,
    generate_business_plan_summary,
    generate_marketing_growth_strategy,
    generate_pitch_deck
)
from ..services.pdf_report import generate_pdf_report

router = APIRouter(prefix="/evaluate", tags=["Evaluation & Reports"])

STATIC_REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "reports")

@router.post("/{idea_id}", response_model=StartupIdeaDetailResponse)
def evaluate_idea(idea_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Fetch idea
    idea = db.query(StartupIdea).filter(
        StartupIdea.id == idea_id,
        StartupIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Startup idea not found")
        
    # 2. Run Machine Learning predictions
    ml_results = predict_startup_metrics(
        description=idea.description,
        industry=idea.industry,
        country=idea.country,
        expected_pricing=idea.expected_pricing,
        marketing_budget=idea.marketing_budget,
        team_size=idea.team_size,
        founder_experience=idea.founder_experience,
        competition_level=idea.competition_level,
        expected_investment=idea.expected_investment
    )
    
    # Save or update Prediction
    prediction = db.query(Prediction).filter(Prediction.startup_idea_id == idea.id).first()
    if not prediction:
        prediction = Prediction(startup_idea_id=idea.id)
        db.add(prediction)
        
    prediction.predicted_category = ml_results["predicted_category"]
    prediction.success_probability = ml_results["success_probability"]
    prediction.revenue_y1 = ml_results["revenue_y1"]
    prediction.revenue_y2 = ml_results["revenue_y2"]
    prediction.revenue_y3 = ml_results["revenue_y3"]
    prediction.funding_readiness = ml_results["funding_readiness"]
    prediction.risk_market = ml_results["risk_market"]
    prediction.risk_financial = ml_results["risk_financial"]
    prediction.risk_execution = ml_results["risk_execution"]
    prediction.risk_technology = ml_results["risk_technology"]
    prediction.risk_legal = ml_results["risk_legal"]
    
    db.commit()
    db.refresh(prediction)

    # 3. Generate Gemini qualitative analysis
    idea_dict = {
        "id": idea.id,
        "name": idea.name,
        "industry": idea.industry,
        "country": idea.country,
        "description": idea.description,
        "problem": idea.problem,
        "solution": idea.solution,
        "target_audience": idea.target_audience,
        "business_model": idea.business_model,
        "revenue_model": idea.revenue_model,
        "expected_pricing": idea.expected_pricing,
        "marketing_budget": idea.marketing_budget,
        "team_size": idea.team_size,
        "founder_experience": idea.founder_experience,
        "expected_investment": idea.expected_investment,
        "expected_launch_date": idea.expected_launch_date
    }
    
    swot = generate_swot_analysis(idea_dict)
    lean_canvas = generate_lean_canvas(idea_dict)
    biz_plan = generate_business_plan_summary(idea_dict)
    mktg_growth = generate_marketing_growth_strategy(idea_dict)
    pitch_deck = generate_pitch_deck(idea_dict)
    
    # Save or update Report
    report = db.query(Report).filter(Report.startup_idea_id == idea.id).first()
    if not report:
        report = Report(startup_idea_id=idea.id)
        db.add(report)
        
    report.swot_analysis = json.dumps(swot)
    report.lean_canvas = json.dumps(lean_canvas)
    report.business_plan_summary = biz_plan
    report.marketing_suggestions = json.dumps(mktg_growth.get("marketing_suggestions", []))
    report.growth_strategy = json.dumps(mktg_growth.get("growth_strategy", []))
    report.pitch_deck_content = json.dumps(pitch_deck)
    
    db.commit()
    db.refresh(report)

    # 4. Generate PDF report
    pdf_filename = generate_pdf_report(
        idea=idea_dict,
        prediction=ml_results,
        report={
            "swot_analysis": swot,
            "lean_canvas": lean_canvas,
            "business_plan_summary": biz_plan,
            "marketing_suggestions": mktg_growth.get("marketing_suggestions", []),
            "growth_strategy": mktg_growth.get("growth_strategy", []),
            "pitch_deck_content": pitch_deck
        },
        output_dir=STATIC_REPORTS_DIR
    )
    
    report.pdf_path = f"/api/evaluate/download/{pdf_filename}"
    db.commit()
    db.refresh(report)
    
    return {
        "idea": idea,
        "prediction": prediction,
        "report": report
    }

@router.get("/download/{filename}")
def download_report(filename: str):
    file_path = os.path.join(STATIC_REPORTS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF Report file not found")
        
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )
