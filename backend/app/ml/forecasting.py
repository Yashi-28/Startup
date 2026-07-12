import json
from typing import Dict, Any, List

def calculate_financial_forecast(expected_pricing: float, revenue_model: str, marketing_budget: float) -> Dict[str, List[float]]:
    """
    Generates month-over-month financial trajectory vectors over a 36-month horizon
    based on baseline inputs, applying optimistic, realistic, and pessimistic growth coefficients.
    """
    months = 36
    
    # Establish a baseline initial monthly user acquisition scale estimate
    # higher marketing budgets scale the initial baseline customer count
    base_customers = max(10, int(marketing_budget / 200)) 
    base_monthly_revenue = base_customers * expected_pricing
    
    # Compounding monthly growth coefficients
    growth_rates = {
        "optimistic": 0.08,  # 8% MoM growth
        "realistic": 0.05,   # 5% MoM growth
        "pessimistic": 0.02  # 2% MoM growth
    }
    
    forecasts = {"optimistic": [], "realistic": [], "pessimistic": []}
    
    for scenario, rate in growth_rates.items():
        current_rev = base_monthly_revenue
        for month in range(1, months + 1):
            forecasts[scenario].append(round(current_rev, 2))
            # Compound the growth for the next month
            current_rev *= (1 + rate)
            
    return forecasts