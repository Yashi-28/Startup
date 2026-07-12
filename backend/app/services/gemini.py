import json
import google.generativeai as genai
from ..config import settings

# Configure Gemini if API Key is available
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def get_model():
    if not settings.GEMINI_API_KEY:
        return None
    try:
        return genai.GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        print(f"Error initializing Gemini Model: {e}")
        return None

def generate_swot_analysis(idea: dict) -> dict:
    model = get_model()
    if not model:
        return get_mock_swot(idea)

    prompt = f"""
    Analyze the following startup idea and return a SWOT Analysis in JSON format.
    The response must be valid JSON with keys: "strengths" (list of strings), "weaknesses" (list of strings), "opportunities" (list of strings), and "threats" (list of strings).
    Do not wrap the JSON in ```json markdown blocks. Just output raw JSON.

    Startup Details:
    Name: {idea['name']}
    Industry: {idea['industry']}
    Description: {idea['description']}
    Problem: {idea['problem']}
    Solution: {idea['solution']}
    Target Audience: {idea['target_audience']}
    Business Model: {idea['business_model']}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown code block wraps if model adds them
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                text = "\n".join(lines[1:-1])
        return json.loads(text)
    except Exception as e:
        print(f"Gemini SWOT failed: {e}. Falling back to mock SWOT.")
        return get_mock_swot(idea)

def generate_lean_canvas(idea: dict) -> dict:
    model = get_model()
    if not model:
        return get_mock_lean_canvas(idea)

    prompt = f"""
    Generate a complete Lean Canvas in JSON format for this startup.
    The JSON must contain keys:
    "problem" (list of 2-3 strings describing problems)
    "solution" (list of 2-3 strings describing solutions)
    "key_metrics" (list of 2-3 strings of metrics to track)
    "unique_value_proposition" (list of 2-3 strings describing UVP)
    "unfair_advantage" (list of 2 strings)
    "channels" (list of 2-3 marketing channels)
    "customer_segments" (list of 2-3 target segments)
    "cost_structure" (list of 2-3 cost items)
    "revenue_streams" (list of 2-3 revenue sources)
    
    Do not wrap the JSON in markdown code blocks. Just output raw JSON.

    Startup Details:
    Name: {idea['name']}
    Description: {idea['description']}
    Problem: {idea['problem']}
    Solution: {idea['solution']}
    Revenue Model: {idea['revenue_model']}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                text = "\n".join(lines[1:-1])
        return json.loads(text)
    except Exception as e:
        print(f"Gemini Lean Canvas failed: {e}. Falling back.")
        return get_mock_lean_canvas(idea)

def generate_business_plan_summary(idea: dict) -> str:
    model = get_model()
    if not model:
        return get_mock_business_plan(idea)

    prompt = f"""
    Write a professional and concise Business Plan Executive Summary for:
    Name: {idea['name']}
    Industry: {idea['industry']}
    Description: {idea['description']}
    Problem: {idea['problem']}
    Solution: {idea['solution']}
    Target Audience: {idea['target_audience']}
    Business Model: {idea['business_model']}
    Expected Pricing: Rs. {idea['expected_pricing']}
    
    Structure it with headings:
    1. Executive Summary
    2. Market Analysis & Target Audience
    3. Revenue and Monetization Model
    4. Operational Outline
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return get_mock_business_plan(idea)

def generate_marketing_growth_strategy(idea: dict) -> dict:
    model = get_model()
    if not model:
        return get_mock_marketing_strategy(idea)

    prompt = f"""
    Create marketing suggestions and a growth strategy for this startup.
    Return JSON format containing:
    "marketing_suggestions" (list of 4 marketing advice strings)
    "growth_strategy" (list of 4 growth/scaling roadmap steps)
    Do not use markdown wrappers, just return raw JSON.

    Startup Details:
    Name: {idea['name']}
    Description: {idea['description']}
    Target Audience: {idea['target_audience']}
    Marketing Budget: Rs. {idea['marketing_budget']}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                text = "\n".join(lines[1:-1])
        return json.loads(text)
    except Exception:
        return get_mock_marketing_strategy(idea)

def generate_pitch_deck(idea: dict) -> list:
    model = get_model()
    if not model:
        return get_mock_pitch_deck(idea)

    prompt = f"""
    Create a Pitch Deck structure in JSON format for the startup: {idea['name']}.
    It must be a JSON array of slide objects. Each object should have keys:
    "slide_number" (int), "title" (string), and "bullets" (list of 3-4 strings).
    Include slides: 1. Title, 2. Problem, 3. Solution, 4. Market Size, 5. Product/Service, 6. Business Model, 7. Competition, 8. Financials, 9. The Ask.
    Do not use markdown code blocks, just raw JSON.

    Startup details:
    Name: {idea['name']}
    Industry: {idea['industry']}
    Description: {idea['description']}
    Expected Investment: Rs. {idea['expected_investment']}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                text = "\n".join(lines[1:-1])
        return json.loads(text)
    except Exception:
        return get_mock_pitch_deck(idea)

def ask_mentor_question(idea: dict, chat_history: list, new_question: str) -> str:
    model = get_model()
    if not model:
        return get_mock_mentor_response(idea, new_question)

    history_prompt = ""
    for msg in chat_history[-6:]:  # include last 6 messages
        history_prompt += f"{msg['sender'].capitalize()}: {msg['message']}\n"

    if not idea or 'name' not in idea:
        system_instruction = """
        You are an elite Startup Mentor, Venture Capital (VC) General Partner, and expert Management Consultant.
        The user is an entrepreneur seeking general business planning advice.
        Provide highly precise, comprehensive, deep, and professional answers.
        Analyze their queries using strategic management frameworks (e.g., Porter's Five Forces, Blue Ocean Strategy, Unit Economics analysis, and CAC/LTV dynamics).
        Structure your answer cleanly using clear markdown headings, bullet points, and detailed paragraphs. 
        Deliver massive strategic value with thorough, rich explanations. Do not provide brief, basic, or generic summaries.
        """
    else:
        system_instruction = f"""
        You are an elite Startup Mentor, Venture Capital (VC) General Partner, and expert Management Consultant.
        The user is an entrepreneur who created:
        Name: {idea.get('name')}
        Description: {idea.get('description')}
        Problem: {idea.get('problem')}
        Solution: {idea.get('solution')}
        Target Audience: {idea.get('target_audience')}
        Business Model: {idea.get('business_model')}
        Expected Pricing: Rs. {idea.get('expected_pricing')}
        Expected Investment: Rs. {idea.get('expected_investment')}
        Industry: {idea.get('industry')}

        Provide highly precise, comprehensive, deep, and professional answers tailored specifically to their startup's context.
        Perform in-depth market analysis, competitive positioning evaluation, growth strategy consulting, and unit economics validation.
        Structure your response with clear markdown headings, bullet points, and detailed operational guidelines.
        Avoid short, basic, or generic summaries. Give proper, deep business intelligence.
        """

    prompt = f"""
    {system_instruction}

    Here is the chat history:
    {history_prompt}

    User Question: {new_question}
    Mentor response:
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Mentor (Fallback):\n{get_mock_mentor_response(idea, new_question)}"


# --- MOCK FALLBACK GENERATORS ---

def get_mock_swot(idea: dict) -> dict:
    ind = idea['industry']
    return {
        "strengths": [
            f"Strong focus on the key problem in {ind}.",
            "Agile setup allowing rapid testing of the core value proposition.",
            "Tailored solution designed specifically for the identified target audience."
        ],
        "weaknesses": [
            f"Limited marketing budget relative to industry giants in {ind}.",
            "High dependency on the early founder experience for business execution.",
            "Potential friction in early-stage user acquisition."
        ],
        "opportunities": [
            f"Rapid digital transformation occurring within the {ind} industry.",
            "Expansion into adjacent geographic or vertical target markets.",
            "Partnerships with established enterprise players looking for innovation."
        ],
        "threats": [
            "Low barrier to entry might attract fast-following competitors.",
            "Shifting regulatory or privacy frameworks within this domain.",
            "Macroeconomic headwinds affecting customer willingness to pay."
        ]
    }

def get_mock_lean_canvas(idea: dict) -> dict:
    return {
        "problem": [
            idea['problem'][:80] + "...",
            "Lack of a centralized, automated system for target users.",
            "Inefficiencies and high friction costs in the current process."
        ],
        "solution": [
            idea['solution'][:80] + "...",
            "Streamlined workflow with integrated cloud resources.",
            "Intuitive interface designed to minimize user drop-offs."
        ],
        "key_metrics": [
            "Customer Acquisition Cost (CAC) & Lifetime Value (LTV).",
            "Monthly Active Users (MAU) and churn rate.",
            "Net Promoter Score (NPS) / customer satisfaction metric."
        ],
        "unique_value_proposition": [
            f"The easiest way to solve the primary problem for {idea['target_audience']}.",
            "Saves time and operational overhead compared to manual methods.",
            "Delivers transparent, data-driven utility to the end customer."
        ],
        "unfair_advantage": [
            "Proprietary algorithms and direct customer relationships.",
            "First-mover advantage in a specific sub-niche of this industry."
        ],
        "channels": [
            "Content marketing, SEO, and organic industry forums.",
            "Targeted social ads (LinkedIn/Meta) aimed at the main persona.",
            "Direct B2B outreach and selective industry partnership networks."
        ],
        "customer_segments": [
            idea['target_audience'],
            "Early adopters looking for modern digital tooling.",
            "Agile SMBs and independent practitioners in this sector."
        ],
        "cost_structure": [
            "Software hosting, infrastructure, and API licensing costs.",
            "Initial software engineering, UX design, and development costs.",
            "Digital marketing, sales outreach, and user acquisition budget."
        ],
        "revenue_streams": [
            f"Subscribers paying on a {idea['revenue_model']} basis.",
            f"Transaction or setup fees based on expected pricing of Rs. {idea['expected_pricing']}.",
            "Tiered enterprise access and premium feature upgrades."
        ]
    }

def get_mock_business_plan(idea: dict) -> str:
    return f"""# Business Plan Executive Summary for {idea['name']}

## 1. Executive Summary
{idea['name']} is a forward-thinking venture in the {idea['industry']} space. Our mission is to directly address the critical issue: *"{idea['problem']}"*. By deploying our solution—*"{idea['solution']}"*—we aim to capture significant market share and create a sustainable, scalable business model.

## 2. Market Analysis & Target Audience
Our target demographic is defined as **{idea['target_audience']}**. This segment is currently underserved, relying on outdated or manual workflows. In {idea['country']}, this represents a substantial market opportunity, driven by increasing digitization and demands for convenience.

## 3. Revenue and Monetization Model
We are adopting a model focused on **{idea['revenue_model']}** with an initial price point of **Rs. {idea['expected_pricing']}**. With a marketing budget of **Rs. {idea['marketing_budget']}**, we will prioritize digital acquisition channels to keep CAC low while scaling average customer LTV.

## 4. Operational Outline
The launch is targeted for **{idea['expected_launch_date']}**. The team consists of **{idea['team_size']}** members, led by founders with **{idea['founder_experience']} years** of domain experience. Operational expenses will focus on product iteration, design, and hosting infrastructure.
"""

def get_mock_marketing_strategy(idea: dict) -> dict:
    return {
        "marketing_suggestions": [
            f"Launch a targeted content campaign focusing on: '{idea['problem']}' to attract organic traffic.",
            "Set up email marketing automation to nurture early beta leads.",
            "Leverage niche social media channels (e.g. LinkedIn for B2B, Instagram for B2C) using high-quality short-form video content.",
            "Collaborate with micro-influencers or industry bloggers to gain early social proof and reviews."
        ],
        "growth_strategy": [
            "Validate product-market fit (PMF) using a cohort of 50 active beta users.",
            "Introduce a viral referral program where users get discounts for inviting colleagues.",
            "Develop API integrations with complementary tools in the sector to expand reach.",
            "Expand geographic targeting to nearby regions once the domestic playbook is solidified."
        ]
    }

def get_mock_pitch_deck(idea: dict) -> list:
    return [
        {
            "slide_number": 1,
            "title": f"Introducing {idea['name']}",
            "bullets": [
                f"Innovating the {idea['industry']} landscape.",
                "Delivering modern tools to solve a persistent daily pain point.",
                "Pitch Deck presented by our experienced foundation team."
            ]
        },
        {
            "slide_number": 2,
            "title": "The Problem We Solve",
            "bullets": [
                idea['problem'],
                "Current alternatives are slow, manual, and expensive.",
                "Target users lose significant productivity and revenue trying to manage this."
            ]
        },
        {
            "slide_number": 3,
            "title": "Our Solution",
            "bullets": [
                idea['solution'],
                "Automated, elegant, and highly accessible user dashboard.",
                "Reduces average process time by over 60%."
            ]
        },
        {
            "slide_number": 4,
            "title": "Market Opportunity",
            "bullets": [
                f"Targeting: {idea['target_audience']}.",
                "Substantial Addressable Market (TAM) growing at double-digit CAGR.",
                "Strong tailwinds favoring digitization in the region."
            ]
        },
        {
            "slide_number": 5,
            "title": "Business Model",
            "bullets": [
                f"Based on a {idea['revenue_model']} model.",
                f"Initial average price point set at Rs. {idea['expected_pricing']}.",
                "Clear expansion path through premium feature add-ons."
            ]
        },
        {
            "slide_number": 6,
            "title": "Competitive Edge",
            "bullets": [
                "Proprietary onboarding flow guarantees ease-of-use.",
                "Superior price-to-value ratio compared to legacy players.",
                "Robust data protection and responsive customer support."
            ]
        },
        {
            "slide_number": 7,
            "title": "Team & Launch Plan",
            "bullets": [
                f"Strong engineering and design team of {idea['team_size']} members.",
                f"Led by founders with {idea['founder_experience']} years of specialized experience.",
                f"Target launch date scheduled for {idea['expected_launch_date']}."
            ]
        },
        {
            "slide_number": 8,
            "title": "Financial Forecast",
            "bullets": [
                "Low initial overhead due to cloud-native serverless architecture.",
                "Marketing spend optimized for hyper-local performance campaigns.",
                "Projecting profitability within the first 18-24 months of operation."
            ]
        },
        {
            "slide_number": 9,
            "title": "The Ask",
            "bullets": [
                f"Seeking Rs. {idea['expected_investment']} in seed/pre-seed funding.",
                "Funds will allocate 60% to product development, 30% to marketing, and 10% to operations.",
                "Join us in reshaping this industry. Thank you!"
            ]
        }
    ]

def get_mock_mentor_response(idea: dict, question: str) -> str:
    question_lower = question.lower()
    
    # Safe key retrievals with default fallbacks
    name = idea.get('name', 'your startup')
    industry = idea.get('industry', 'general business')
    pricing = idea.get('expected_pricing', '0')
    revenue_model = idea.get('revenue_model', 'monetization')
    investment = idea.get('expected_investment', '0')
    experience = idea.get('founder_experience', '0')
    team_size = idea.get('team_size', '1')
    problem = idea.get('problem', 'your core customer problem')
    launch_date = idea.get('expected_launch_date', 'your launch target')
    marketing_budget = idea.get('marketing_budget', '0')
    target_audience = idea.get('target_audience', 'your customer persona')

    if "price" in question_lower or "pricing" in question_lower or "charge" in question_lower:
        return f"""### 📊 Strategic Pricing & Unit Economics Analysis

For **{name}**, operating in the **{industry}** sector, your pricing point of **Rs. {pricing}** under the **{revenue_model}** model needs to align with customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC).

#### 1. Recommended Tiering Strategy
* **Basic Tier (₹0 / Freemium)**: Allow users to experience the core utility of your solution to minimize onboarding friction.
* **Professional Tier (₹{pricing}/mo)**: The target standard tier containing the full value proposition described in your solution.
* **Enterprise Tier (Custom)**: Add custom SLAs, priority support, and multi-user administration tools.

#### 2. Pricing Validation Steps
1. Conduct user surveys measuring **Price Sensitivity** using the Van Westendorp Price Sensitivity Meter.
2. Monitor churn rate closely; a monthly churn rate above 5% indicates that the perceived value does not match the price point.
3. Validate if your CAC (Customer Acquisition Cost) is at least 3x lower than your LTV (Lifetime Value) to maintain a healthy business model.
"""
    elif "funding" in question_lower or "raise" in question_lower or "invest" in question_lower:
        return f"""### 💰 Venture Funding & Investment Strategy

You are seeking an initial investment of **Rs. {investment}** with a team size of **{team_size} members** and **{experience} years** of founder experience.

#### 1. Milestone Alignment
Before pitching to institutional Seed VCs or angel groups, you must validate your core problem: *"{problem}"*. Investors will evaluate:
* **Product-Market Fit (PMF)**: Proof that your target audience (*{target_audience}*) is actively using or willing to pre-pay for your solution.
* **Capital Efficiency**: How you plan to deploy the Rs. {investment}. Typically, 60% should go toward product development, 30% to user acquisition, and 10% to operations.

#### 2. Investor Pitch Outline
1. **The Hook**: Clear explanation of the current market inefficiency.
2. **Traction**: Highlight early signups, beta feedback, or letters of intent (LOIs).
3. **The Moat**: What makes your technology or business model defensible (e.g. proprietary algorithms or custom database integrations).
"""
    elif "customer" in question_lower or "acquire" in question_lower or "marketing" in question_lower:
        return f"""### 📈 Customer Acquisition & Growth Playbook

With an expected marketing budget of **Rs. {marketing_budget}**, mass-market advertising is inefficient. You must run a laser-focused growth hacking strategy.

#### 1. Core Channels to Validate
* **Niche Communities**: Engage with the **{target_audience}** directly on specialized forums, subreddits, and LinkedIn groups. Provide value first before pitching {name}.
* **Organic Search (SEO)**: Write high-quality articles addressing the core issue: *"{problem}"*.
* **Direct B2B Outreach**: If targeting business entities, initiate personalized, value-first cold email campaigns.

#### 2. CAC Optimization Rules
1. Establish a feedback loop: capture detailed feedback from your first 10 paying customers.
2. Focus on organic referrals: introduce loop mechanisms (e.g. product sharing or collaborative features) to turn active users into customer advocates.
"""
    else:
        return f"""### 🚀 Strategic Market Assessment & Roadmap

For **{name}** to succeed in the **{industry}** sector, your primary operational goal leading up to your launch target of **{launch_date}** is to build a high-fidelity Minimum Viable Product (MVP).

#### 1. Market Penetration Strategy
* **Problem Focus**: Constantly align all product features with the core problem: *"{problem}"*.
* **User Feedback loops**: Do not build in isolation. Release a private beta to a cohort of 20-50 target users and analyze usage patterns.

#### 2. Pre-Launch Checklist
1. **Landing Page Validation**: Create a high-converting page explaining your solution and collect pre-registrations.
2. **Legal & Compliance**: Ensure proper terms of service, privacy protocols, and corporate registrations.
3. **Analytics Integration**: Set up user behavior tracking to measure feature engagement from day one.
"""

