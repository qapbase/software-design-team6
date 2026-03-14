from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from database.db import init_db
from routes.transactions import transactions_bp
from routes.storage import storage_bp
from routes.sales import sales_bp
from routes.assistant import assistant_bp
from routes.forecast import forecast_bp        # ← NEW


# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()


# -----------------------------
# Create Flask app
# -----------------------------
app = Flask(__name__)


# -----------------------------
# Enable CORS (allow React frontend)
# -----------------------------
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)


# -----------------------------
# Register API routes
# -----------------------------
app.register_blueprint(transactions_bp, url_prefix="/api")
app.register_blueprint(storage_bp,      url_prefix="/api")
app.register_blueprint(sales_bp,        url_prefix="/api")
app.register_blueprint(assistant_bp,    url_prefix="/api")
app.register_blueprint(forecast_bp,     url_prefix="/api")   # ← NEW


# -----------------------------
# Health check route
# -----------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return {
        "status": "ok",
        "message": "Financial Tracker API is running"
    }


# -----------------------------
# Run Flask server
# -----------------------------
if __name__ == "__main__":

    init_db()

    print("===================================")
    print(" Financial Tracker API Started")
    print(" Backend running at: http://localhost:5000")
    print("===================================")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )