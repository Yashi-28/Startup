import random
import pandas as pd
import numpy as np
from .model_loader import ml_models

# Feature mappings
INDUSTRIES = ['EdTech', 'HealthTech', 'FinTech', 'AI', 'E-commerce', 'Agriculture', 'Travel', 'Gaming', 'Other']
COUNTRIES = ['USA', 'India', 'UK', 'Germany', 'Canada', 'Other']
COMPETITION_LEVELS = ['Low', 'Medium', 'High']

def predict_startup_metrics(
    description: str,
    industry: str,
    country: str,
    expected_pricing: float,
    marketing_budget: float,
    team_size: int,
    founder_experience: int,
    competition_level: str,
    expected_investment: float
) -> dict:
    
    # 1. Map features to indices
    try:
        industry_idx = INDUSTRIES.index(industry)
    except ValueError:
        industry_idx = INDUSTRIES.index('Other')

    try:
        country_idx = COUNTRIES.index(country)
    except ValueError:
        country_idx = COUNTRIES.index('Other')

    try:
        comp_idx = COMPETITION_LEVELS.index(competition_level)
    except ValueError:
        comp_idx = COMPETITION_LEVELS.index('Medium')

    # 2. Build feature array
    X = np.array([[
        industry_idx,
        country_idx,
        float(expected_pricing),
        float(marketing_budget),
        int(team_size),
        int(founder_experience),
        comp_idx,
        float(expected_investment)
    ]])

    # 3. Category prediction
    predicted_category = industry # Fallback
    if ml_models.category_clf:
        try:
            predicted_category = ml_models.category_clf.predict([description])[0]
        except Exception:
            pass

    # 4. Success probability prediction
    success_prob = 50.0  # Fallback
    if ml_models.success_clf:
        try:
            # predict_proba returns probability for [class 0, class 1]
            probs = ml_models.success_clf.predict_proba(X)[0]
            success_prob = round(probs[1] * 100.0, 1)
        except Exception:
            pass

    # 5. Revenue prediction (Year 1, 2, 3)
    rev_y1, rev_y2, rev_y3 = 50000.0, 75000.0, 120000.0  # Fallback
    if ml_models.revenue_reg:
        try:
            revs = ml_models.revenue_reg.predict(X)[0]
            rev_y1 = round(max(0.0, float(revs[0])), 2)
            rev_y2 = round(max(0.0, float(revs[1])), 2)
            rev_y3 = round(max(0.0, float(revs[2])), 2)
        except Exception:
            pass

    # 6. Funding readiness
    funding_readiness = "Medium"  # Fallback
    if ml_models.readiness_clf:
        try:
            funding_readiness = ml_models.readiness_clf.predict(X)[0]
        except Exception:
            pass

    # 7. Compute Risk Scores (Heuristic based on logical parameters)
    # Market Risk
    risk_market = 30
    if competition_level == 'High':
        risk_market += 35
    elif competition_level == 'Medium':
        risk_market += 15
    if industry in ['AI', 'Gaming']:
        risk_market += 20
    elif industry in ['FinTech', 'Travel']:
        risk_market += 10
    if marketing_budget < 5000:
        risk_market += 15
    risk_market = min(98, max(5, risk_market + random.randint(-5, 5)))

    # Financial Risk
    risk_financial = 30
    if expected_investment > 100000 and marketing_budget < 10000:
        risk_financial += 25
    if expected_pricing > 200:
        risk_financial += 15
    if team_size > 12 and expected_investment < 50000:
        risk_financial += 30
    elif team_size < 3 and expected_pricing < 15:
        risk_financial += 10
    risk_financial = min(98, max(5, risk_financial + random.randint(-5, 5)))

    # Execution Risk
    risk_execution = 30
    if founder_experience == 0:
        risk_execution += 40
    elif founder_experience <= 2:
        risk_execution += 25
    elif founder_experience <= 5:
        risk_execution += 10
    if team_size == 1:
        risk_execution += 20 # Solo founder risk
    elif team_size > 15:
        risk_execution += 15 # Management overhead risk
    risk_execution = min(98, max(5, risk_execution + random.randint(-5, 5)))

    # Technology Risk
    risk_technology = 20
    if industry == 'AI':
        risk_technology += 45
    elif industry in ['FinTech', 'HealthTech', 'Gaming']:
        risk_technology += 25
    elif industry == 'EdTech':
        risk_technology += 10
    if team_size < 3 and industry in ['AI', 'FinTech']:
        risk_technology += 20 # Small tech team
    risk_technology = min(98, max(5, risk_technology + random.randint(-5, 5)))

    # Legal Risk
    risk_legal = 20
    if industry in ['FinTech', 'HealthTech']:
        risk_legal += 45 # highly regulated
    elif industry == 'Agriculture':
        risk_legal += 15
    if country in ['Germany', 'UK']:
        risk_legal += 15 # strict rules / GDPR
    risk_legal = min(98, max(5, risk_legal + random.randint(-5, 5)))

    return {
        "predicted_category": predicted_category,
        "success_probability": success_prob,
        "revenue_y1": rev_y1,
        "revenue_y2": rev_y2,
        "revenue_y3": rev_y3,
        "funding_readiness": funding_readiness,
        "risk_market": int(risk_market),
        "risk_financial": int(risk_financial),
        "risk_execution": int(risk_execution),
        "risk_technology": int(risk_technology),
        "risk_legal": int(risk_legal)
    }
