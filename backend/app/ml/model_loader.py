import os
import joblib

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

class MLModels:
    def __init__(self):
        self.category_clf = None
        self.success_clf = None
        self.revenue_reg = None
        self.readiness_clf = None
        self.load_models()

    def load_models(self):
        try:
            self.category_clf = joblib.load(os.path.join(MODELS_DIR, "category_classifier.joblib"))
            self.success_clf = joblib.load(os.path.join(MODELS_DIR, "success_classifier.joblib"))
            self.revenue_reg = joblib.load(os.path.join(MODELS_DIR, "revenue_regressor.joblib"))
            self.readiness_clf = joblib.load(os.path.join(MODELS_DIR, "readiness_classifier.joblib"))
            print("Successfully loaded all ML models.")
        except Exception as e:
            print(f"Error loading ML models: {e}. Running in fallback mode.")

ml_models = MLModels()
