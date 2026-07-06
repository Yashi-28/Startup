from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import datetime

# --- AUTH SCHEMAS ---

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# --- STARTUP IDEA SCHEMAS ---

class StartupIdeaCreate(BaseModel):
    name: str = Field(..., min_length=1)
    industry: str
    country: str
    description: str = Field(..., min_length=10)
    problem: str = Field(..., min_length=10)
    solution: str = Field(..., min_length=10)
    target_audience: str
    business_model: str
    revenue_model: str
    expected_pricing: float = Field(..., ge=0)
    marketing_budget: float = Field(..., ge=0)
    team_size: int = Field(..., ge=1)
    founder_experience: int = Field(..., ge=0)
    competition_level: str  # Low, Medium, High
    expected_investment: float = Field(..., ge=0)
    expected_launch_date: str

class StartupIdeaResponse(StartupIdeaCreate):
    id: int
    user_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- PREDICTION SCHEMAS ---

class PredictionResponse(BaseModel):
    id: int
    startup_idea_id: int
    predicted_category: str
    success_probability: float
    revenue_y1: float
    revenue_y2: float
    revenue_y3: float
    funding_readiness: str
    risk_market: int
    risk_financial: int
    risk_execution: int
    risk_technology: int
    risk_legal: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- REPORT SCHEMAS ---

class ReportResponse(BaseModel):
    id: int
    startup_idea_id: int
    swot_analysis: str
    business_plan_summary: str
    lean_canvas: str
    marketing_suggestions: str
    growth_strategy: str
    pitch_deck_content: str
    pdf_path: Optional[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- COMPOSITE RESPONSE SCHEMAS ---

class StartupIdeaDetailResponse(BaseModel):
    idea: StartupIdeaResponse
    prediction: Optional[PredictionResponse] = None
    report: Optional[ReportResponse] = None

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_ideas: int
    average_success_probability: float
    high_readiness_count: int
    total_predicted_revenue_y1: float
    average_market_risk: float

# --- CHAT SCHEMAS ---

class ChatMessageCreate(BaseModel):
    message: str
    startup_idea_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    startup_idea_id: Optional[int]
    sender: str
    message: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
