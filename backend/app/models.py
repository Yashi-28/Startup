import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ideas = relationship("StartupIdea", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")

class StartupIdea(Base):
    __tablename__ = "startup_ideas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    country = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    problem = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    target_audience = Column(Text, nullable=False)
    business_model = Column(String, nullable=False)
    revenue_model = Column(String, nullable=False)
    expected_pricing = Column(Float, nullable=False)
    marketing_budget = Column(Float, nullable=False)
    team_size = Column(Integer, nullable=False)
    founder_experience = Column(Integer, nullable=False)  # in years
    competition_level = Column(String, nullable=False)   # Low, Medium, High
    expected_investment = Column(Float, nullable=False)
    expected_launch_date = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ideas")
    prediction = relationship("Prediction", back_populates="idea", uselist=False, cascade="all, delete-orphan")
    report = relationship("Report", back_populates="idea", uselist=False, cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="idea", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    startup_idea_id = Column(Integer, ForeignKey("startup_ideas.id"), unique=True, nullable=False)
    predicted_category = Column(String, nullable=False)
    success_probability = Column(Float, nullable=False)  # 0.0 to 100.0
    revenue_y1 = Column(Float, nullable=False)
    revenue_y2 = Column(Float, nullable=False)
    revenue_y3 = Column(Float, nullable=False)
    funding_readiness = Column(String, nullable=False)   # Low, Medium, High
    risk_market = Column(Integer, nullable=False)         # 0 to 100
    risk_financial = Column(Integer, nullable=False)      # 0 to 100
    risk_execution = Column(Integer, nullable=False)      # 0 to 100
    risk_technology = Column(Integer, nullable=False)     # 0 to 100
    risk_legal = Column(Integer, nullable=False) 
    financial_forecast_optimistic = Column(Text, nullable=True)   # Stored as serialized JSON arrays
    financial_forecast_realistic = Column(Text, nullable=True)
    financial_forecast_pessimistic = Column(Text, nullable=True)         # 0 to 100
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    idea = relationship("StartupIdea", back_populates="prediction")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    startup_idea_id = Column(Integer, ForeignKey("startup_ideas.id"), unique=True, nullable=False)
    swot_analysis = Column(Text, nullable=False)          # JSON string
    business_plan_summary = Column(Text, nullable=False)  # Text
    lean_canvas = Column(Text, nullable=False)            # JSON string
    marketing_suggestions = Column(Text, nullable=False) # Text
    growth_strategy = Column(Text, nullable=False)        # Text
    pitch_deck_content = Column(Text, nullable=False)     # JSON string
    pdf_path = Column(String, nullable=True)
    competitor_analysis = Column(Text, nullable=True)  # Will store our Gemini JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    idea = relationship("StartupIdea", back_populates="report")
    
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    startup_idea_id = Column(Integer, ForeignKey("startup_ideas.id"), nullable=True)
    sender = Column(String, nullable=False)               # 'user' or 'mentor'
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
    idea = relationship("StartupIdea", back_populates="chat_messages")
