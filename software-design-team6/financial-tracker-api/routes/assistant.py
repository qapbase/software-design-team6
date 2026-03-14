from flask import Blueprint, request, jsonify
from services.gemini_service import ask_gemini, generate_recommendations

assistant_bp = Blueprint("assistant", __name__)


@assistant_bp.route("/assistant/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        message = data.get("message")
        history = data.get("history", [])

        if not message:
            return jsonify({"error": "Message is required"}), 400

        # Send message + history to Gemini with full business context
        reply = ask_gemini(message, history=history)

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        print("Assistant API error:", e)
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500


@assistant_bp.route("/assistant/recommendations", methods=["GET"])
def recommendations():

    try:
        recs = generate_recommendations()

        return jsonify({
            "recommendations": recs
        })

    except Exception as e:
        print("Recommendations API error:", e)
        return jsonify({
            "error": "Failed to generate recommendations",
            "recommendations": []
        }), 500