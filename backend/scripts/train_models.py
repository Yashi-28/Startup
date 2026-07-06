import os
import random
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline

def create_synthetic_data(num_samples=1500):
    # Setup directories
    os.makedirs(os.path.join("app", "ml", "models"), exist_ok=True)

    # 1. Categories and Text Templates
    categories = ['EdTech', 'HealthTech', 'FinTech', 'AI', 'E-commerce', 'Agriculture', 'Travel', 'Gaming', 'Other']
    
    templates = {
        'EdTech': [
            "Online education platform for children learning to code and build websites.",
            "Interactive school platform for students to practice mathematics and physics online.",
            "Mobile app containing courses and lectures on language learning with active AI tutoring.",
            "Digital classroom software for teachers to manage student homework and online tests.",
            "Virtual reality simulations for science lab experiments in universities."
        ],
        'HealthTech': [
            "Telemedicine app connecting remote patients with general physicians and specialists.",
            "AI-powered medical imaging diagnostics tool for early cancer detection.",
            "Fitness tracker and personalized nutrition planner using biological metrics.",
            "Digital health records management system for hospitals and local clinics.",
            "Mental health counseling chatbot providing CBT exercises and mood tracking."
        ],
        'FinTech': [
            "Decentralized micro-lending platform for small business owners in developing nations.",
            "Automated personal budgeting app that tracks expenses and recommends investment portfolios.",
            "Blockchain-based secure payment gateway for high-volume cross-border transactions.",
            "Peer-to-peer crypto invoice discounting and credit scoring application.",
            "Fractional real estate investing application using smart contracts."
        ],
        'AI': [
            "Generative AI tool for automated copywriting and content creation for social media.",
            "Deep learning neural network for predicting supply chain disruptions in shipping.",
            "Natural language processing API for summarizing legal documents and contracts.",
            "Autonomous drone navigation software for warehouse inventory management.",
            "Computer vision safety monitoring for industrial construction sites."
        ],
        'E-commerce': [
            "Direct-to-consumer sustainable clothing marketplace matching local designers.",
            "Subscription box service for organic spices and ingredients from around the world.",
            "Custom print-on-demand platform for independent artists and creators.",
            "Mobile marketplace for buying and selling verified pre-owned luxury goods.",
            "Automated dropshipping software tool for Shopify store operators."
        ],
        'Agriculture': [
            "Smart IoT soil sensors and weather monitoring system for precision irrigation.",
            "Vertical farming startup growing pesticide-free leafy greens in urban centers.",
            "Drone spectral analysis for early crop disease and weed identification.",
            "Marketplace connecting smallholder farmers directly to wholesale crop buyers.",
            "AI-driven automated feed system for livestock and poultry farms."
        ],
        'Travel': [
            "SaaS booking management platform for local boutique hotels and tour guides.",
            "AI itinerary planner generating custom travel guides based on user interests.",
            "Luggage shipping and storage network for frequent business travelers.",
            "Peer-to-peer campervan and RV rental marketplace for road trips.",
            "Gamified flight ticket search engine tracking lowest airline prices."
        ],
        'Gaming': [
            "Multiplayer cloud gaming network streaming games directly to smart TVs.",
            "Indie retro adventure game featuring physics-based puzzles and open worlds.",
            "SaaS platform for hosting and managing esports tournaments online.",
            "VR multiplayer physics sandbox game set in outer space.",
            "Mobile strategy game combining base building and real-time defense."
        ],
        'Other': [
            "Clean energy home battery systems storing excess solar power grid energy.",
            "Community coworking space with integrated child daycare and support.",
            "Biodegradable alternative packaging material made from seaweed fibers.",
            "Local services app matching certified electricians and handymen.",
            "Smart water purification system for residential properties."
        ]
    }

    industries = ['EdTech', 'HealthTech', 'FinTech', 'AI', 'E-commerce', 'Agriculture', 'Travel', 'Gaming', 'Other']
    countries = ['USA', 'India', 'UK', 'Germany', 'Canada', 'Other']
    competition_levels = ['Low', 'Medium', 'High']

    data = []
    
    for _ in range(num_samples):
        # Choose a category
        cat = random.choice(categories)
        # Select description template and add some synthetic keywords/random variation
        desc_base = random.choice(templates[cat])
        adjectives = ["scalable", "next-generation", "cloud-based", "user-friendly", "innovative", "fully-automated"]
        desc = f"A {random.choice(adjectives)} {desc_base.lower()} utilizing modern tech."

        industry_val = industries.index(cat)  # Aligning industry feature with category
        country = random.choice(countries)
        country_val = countries.index(country)
        
        comp = random.choice(competition_levels)
        comp_val = competition_levels.index(comp)
        
        experience = random.randint(0, 15)
        team_size = random.randint(1, 20)
        
        marketing_budget = random.randint(1000, 150000)
        expected_investment = random.randint(5000, 500000)
        expected_pricing = random.randint(5, 500)
        
        # 2. Logic for Success Probability
        # Base success score out of 100
        success_score = 30 # Base
        success_score += min(experience * 3, 30) # up to +30 for experience
        success_score += min((marketing_budget / (expected_investment + 1)) * 20, 20) # budget ratio
        success_score += min(team_size * 2, 20) # team size
        success_score -= comp_val * 10 # competition penalty (up to -20)
        success_score += (1 if country in ['USA', 'UK', 'Germany'] else 0) * 5
        
        # Add noise
        success_score += random.normalvariate(0, 8)
        success_score = max(0, min(100, success_score))
        
        success_label = 1 if success_score >= 50 else 0

        # 3. Logic for Revenue (Year 1, 2, 3)
        # Revenue depends on investment, pricing, team size, experience, and industry
        base_revenue = 10000
        base_revenue += expected_investment * 0.3
        base_revenue += team_size * 12000
        base_revenue += marketing_budget * 1.2
        
        # Industry multiplier
        industry_multipliers = {
            'AI': 1.5, 'FinTech': 1.4, 'HealthTech': 1.3, 'E-commerce': 1.2, 
            'EdTech': 1.1, 'Gaming': 1.1, 'Travel': 1.0, 'Agriculture': 0.9, 'Other': 0.8
        }
        base_revenue *= industry_multipliers[cat]
        
        revenue_y1 = base_revenue + random.normalvariate(0, base_revenue * 0.1)
        revenue_y1 = max(5000, revenue_y1)
        
        growth_rate_y2 = 1.15 + (experience * 0.03) - (comp_val * 0.05) + random.normalvariate(0, 0.05)
        revenue_y2 = revenue_y1 * max(1.05, growth_rate_y2)
        
        growth_rate_y3 = 1.20 + (experience * 0.04) - (comp_val * 0.04) + random.normalvariate(0, 0.05)
        revenue_y3 = revenue_y2 * max(1.10, growth_rate_y3)

        # 4. Funding Readiness Score: High, Medium, Low
        readiness_score = (experience * 4) + (expected_investment / 10000) + (success_score * 0.4) - (comp_val * 8)
        if readiness_score > 70:
            funding_readiness = 'High'
        elif readiness_score > 40:
            funding_readiness = 'Medium'
        else:
            funding_readiness = 'Low'

        data.append({
            'description': desc,
            'predicted_category': cat,
            'industry': industry_val,
            'country': country_val,
            'expected_pricing': float(expected_pricing),
            'marketing_budget': float(marketing_budget),
            'team_size': int(team_size),
            'founder_experience': int(experience),
            'competition_level': comp_val,
            'expected_investment': float(expected_investment),
            'success_score': success_score,
            'success_label': success_label,
            'revenue_y1': revenue_y1,
            'revenue_y2': revenue_y2,
            'revenue_y3': revenue_y3,
            'funding_readiness': funding_readiness
        })

    return pd.DataFrame(data)

def train_and_save():
    print("Generating synthetic startup dataset...")
    df = create_synthetic_data()
    csv_path = "startup_training_data.csv"
    df.to_csv(csv_path, index=False)
    print(f"Synthetic training data exported to {csv_path}")

    print("Training Category Classifier (Text NLP)...")
    # Pipeline: TF-IDF Vectorizer + Random Forest
    text_clf = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=1000, stop_words='english')),
        ('rf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    text_clf.fit(df['description'], df['predicted_category'])
    joblib.dump(text_clf, os.path.join("app", "ml", "models", "category_classifier.joblib"))
    print("Category classifier saved.")

    # Numeric features for Success, Revenue, Readiness
    X = df[['industry', 'country', 'expected_pricing', 'marketing_budget', 
            'team_size', 'founder_experience', 'competition_level', 'expected_investment']]

    print("Training Success Probability Classifier...")
    success_clf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
    success_clf.fit(X, df['success_label'])
    joblib.dump(success_clf, os.path.join("app", "ml", "models", "success_classifier.joblib"))
    print("Success classifier saved.")

    print("Training Revenue Regressor...")
    # Multi-output regression (Y1, Y2, Y3)
    Y_rev = df[['revenue_y1', 'revenue_y2', 'revenue_y3']]
    revenue_reg = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42)
    revenue_reg.fit(X, Y_rev)
    joblib.dump(revenue_reg, os.path.join("app", "ml", "models", "revenue_regressor.joblib"))
    print("Revenue regressor saved.")

    print("Training Funding Readiness Classifier...")
    readiness_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    readiness_clf.fit(X, df['funding_readiness'])
    joblib.dump(readiness_clf, os.path.join("app", "ml", "models", "readiness_classifier.joblib"))
    print("Funding readiness classifier saved.")

    print("All ML models trained and saved to backend/app/ml/models/ successfully!")

if __name__ == '__main__':
    train_and_save()
