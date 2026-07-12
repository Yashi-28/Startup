import os
import json
import google.generativeai as genai
from typing import Dict, Any

# Configure the Gemini API key (Make sure GEMINI_API_KEY is in your environment setup later)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def generate_competitor_analysis(industry: str, description: str, target_audience: str) -> Dict[str, Any]:
    """
    Analyzes a startup's pitch data using Gemini to discover direct/indirect competitors 
    and provide strategies to beat them.
    """
    try:
        # Using gemini-2.5-flash for fast text generation/analysis tasks
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are an elite venture capitalist and market research analyst.
        Analyze the following startup idea and generate a competitive analysis.

        Startup Details:
        - Industry/Sector: {industry}
        - Business Description: {description}
        - Target Audience: {target_audience}

        Provide the output strictly as a valid JSON object matching this structure:
        {{
            "market_overview": "A brief overview of the current market state and competitive density.",
            "competitors": [
                {{
                    "name": "Name of competitor 1",
                    "type": "Direct or Indirect",
                    "strengths": "What they do exceptionally well",
                    "weaknesses": "Where they fall short",
                    "our_advantage": "How our startup can outperform them"
                }},
                {{
                    "name": "Name of competitor 2",
                    "type": "Direct or Indirect",
                    "strengths": "What they do exceptionally well",
                    "weaknesses": "Where they fall short",
                    "our_advantage": "How our startup can outperform them"
                }}
            ],
            "recommended_strategy": "Actionable go-to-market strategy to differentiate and capture market share."
        }}
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Parse the clean JSON response from Gemini
        analysis_data = json.loads(response.text)
        return {"status": "success", "data": analysis_data}

    except Exception as e:
        return {"status": "error", "message": str(e)}