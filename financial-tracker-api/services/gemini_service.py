import os
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")

model = None

def _get_model():
    """Lazy-load the Gemini model to avoid circular imports."""
    global model
    if model is None and API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
    return model


# ─────────────────────────────────────────────
# HELPER: Get column names for a table
# ─────────────────────────────────────────────
def get_table_columns(cursor, table_name):
    """Get actual column names from a table to avoid column mismatch errors."""
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return columns


# ─────────────────────────────────────────────
# HELPER: Load all business data from database
# ─────────────────────────────────────────────
def load_business_context():
    """Fetch real-time business data for AI context."""

    from database.db import get_db

    conn = get_db()
    cursor = conn.cursor()

    # ── Get actual column names to avoid errors ──
    txn_columns = get_table_columns(cursor, "transactions")

    # ── Inventory ──
    cursor.execute("SELECT item_name, current_stock, min_level, unit, status FROM storage")
    storage_rows = cursor.fetchall()
    storage = [dict(row) for row in storage_rows]

    # ── Sales ──
    cursor.execute(
        "SELECT item_name, SUM(quantity) as total_sold FROM sales GROUP BY item_name ORDER BY total_sold DESC"
    )
    sales_rows = cursor.fetchall()
    sales = [dict(row) for row in sales_rows]

    # ── Transactions grouped by type ──
    cursor.execute("SELECT type, SUM(amount) as total FROM transactions GROUP BY type")
    txn_summary_rows = cursor.fetchall()
    transaction_summary = [dict(row) for row in txn_summary_rows]

    # ── Recent transactions (use actual columns dynamically) ──
    select_cols = []
    for col in ["type", "amount", "date", "note", "category", "to_name"]:
        if col in txn_columns:
            select_cols.append(col)

    if select_cols:
        cols_str = ", ".join(select_cols)
        cursor.execute(f"SELECT {cols_str} FROM transactions ORDER BY date DESC LIMIT 20")
        recent_rows = cursor.fetchall()
        recent_transactions = [dict(row) for row in recent_rows]
    else:
        recent_transactions = []

    # ── Balance calculation ──
    total_income = 0
    total_expense = 0
    for t in transaction_summary:
        if t["type"] == "income":
            total_income = t["total"]
        elif t["type"] == "expense":
            total_expense = t["total"]

    balance = total_income - total_expense

    # ── Low stock detection ──
    low_stock = [
        {"name": item["item_name"], "stock": item["current_stock"], "min": item["min_level"]}
        for item in storage
        if item["current_stock"] <= item["min_level"]
    ]

    conn.close()

    return {
        "storage": storage,
        "sales": sales,
        "transaction_summary": transaction_summary,
        "recent_transactions": recent_transactions,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "low_stock": low_stock,
    }


# ─────────────────────────────────────────────
# HELPER: Build context string for Gemini
# ─────────────────────────────────────────────
def build_context_prompt(data):
    """Convert business data into a readable prompt section."""

    # Inventory section
    if data["storage"]:
        inventory_lines = []
        for item in data["storage"]:
            status_flag = " LOW" if item["current_stock"] <= item["min_level"] else ""
            inventory_lines.append(
                f"  - {item['item_name']}: {item['current_stock']} {item.get('unit', 'pcs')} "
                f"(min: {item['min_level']}){status_flag}"
            )
        inventory_text = "\n".join(inventory_lines)
    else:
        inventory_text = "  No inventory data available."

    # Sales section
    if data["sales"]:
        sales_lines = [
            f"  - {s['item_name']}: {s['total_sold']} units sold"
            for s in data["sales"][:10]
        ]
        sales_text = "\n".join(sales_lines)
    else:
        sales_text = "  No sales data available."

    # Recent transactions section
    if data["recent_transactions"]:
        txn_lines = []
        for t in data["recent_transactions"][:15]:
            parts = []
            if "date" in t and t["date"]:
                parts.append(t["date"])
            if "type" in t and t["type"]:
                parts.append(t["type"].upper())
            if "amount" in t and t["amount"] is not None:
                parts.append(f"P{abs(t['amount']):,.2f}")
            if "category" in t and t.get("category"):
                parts.append(t["category"])
            if "to_name" in t and t.get("to_name"):
                parts.append(t["to_name"])
            if "note" in t and t.get("note"):
                parts.append(t["note"])
            txn_lines.append("  - " + " | ".join(parts))
        txn_text = "\n".join(txn_lines)
    else:
        txn_text = "  No recent transactions."

    # Low stock section
    if data["low_stock"]:
        low_lines = [
            f"  - {item['name']}: only {item['stock']} left (minimum: {item['min']})"
            for item in data["low_stock"]
        ]
        low_text = "\n".join(low_lines)
    else:
        low_text = "  All items are sufficiently stocked."

    return f"""
=== CURRENT BUSINESS DATA ===

FINANCIAL OVERVIEW:
  - Total Income: P{data['total_income']:,.2f}
  - Total Expenses: P{data['total_expense']:,.2f}
  - Current Balance: P{data['balance']:,.2f}

INVENTORY ({len(data['storage'])} items):
{inventory_text}

TOP SALES:
{sales_text}

RECENT TRANSACTIONS:
{txn_text}

LOW STOCK ALERTS:
{low_text}
"""


# ─────────────────────────────────────────────
# SYSTEM PROMPT
# ─────────────────────────────────────────────
SYSTEM_PROMPT = """You are a smart, professional Financial Assistant for a small retail store called "Campo Retail Store".

YOUR ROLE:
- Analyze the store's real financial data provided below
- Give specific, actionable advice based on actual numbers
- Help with budget planning, expense tracking, restock decisions, and sales analysis
- Provide predictions and recommendations grounded in the data

RESPONSE STYLE:
- Be concise but thorough (2-4 short paragraphs max unless asked for detail)
- Use peso sign (P) for currency
- Reference specific numbers from the data when relevant
- Use bullet points for lists
- Be friendly and professional
- If data is insufficient for a question, say so honestly and suggest what data to add
- Do NOT make up numbers — only use what is provided in the business data below

CAPABILITIES:
- Expense analysis and categorization
- Budget recommendations and predictions
- Inventory restock suggestions with urgency levels
- Sales trend analysis
- Savings and cash flow advice
- Financial goal setting
"""


# ─────────────────────────────────────────────
# MAIN: Ask Gemini with full business context
# ─────────────────────────────────────────────
def ask_gemini(message, history=None):
    """Send a message to Gemini with full business context."""

    try:
        ai_model = _get_model()
        if not ai_model:
            return "AI service is not configured. Please set the GOOGLE_API_KEY in your .env file."

        # Load real-time business data
        data = load_business_context()
        context = build_context_prompt(data)

        # Build conversation history for multi-turn context
        history_text = ""
        if history and len(history) > 0:
            history_lines = []
            for msg in history[-6:]:
                role = "User" if msg.get("role") == "user" else "Assistant"
                history_lines.append(f"{role}: {msg.get('content', '')}")
            history_text = "\n\nRECENT CONVERSATION:\n" + "\n".join(history_lines)

        # Build the full prompt
        full_prompt = f"""{SYSTEM_PROMPT}

{context}
{history_text}

USER QUESTION:
{message}

Respond helpfully based on the real business data above."""

        response = ai_model.generate_content(full_prompt)

        return response.text

    except Exception as e:
        print("AI Error:", e)
        return "I encountered an error processing your request. Please try again."


# ─────────────────────────────────────────────
# Generate dynamic recommendations
# ─────────────────────────────────────────────
def generate_recommendations():
    """Generate AI-powered recommendations based on current business data."""

    try:
        ai_model = _get_model()
        if not ai_model:
            return []

        data = load_business_context()
        context = build_context_prompt(data)

        prompt = f"""{SYSTEM_PROMPT}

{context}

Based on the business data above, generate exactly 5 short financial recommendations.

Respond ONLY with valid JSON — no markdown, no backticks, no extra text.
Format:
[
  {{"title": "Short Title", "text": "1-2 sentence recommendation with specific numbers from the data.", "type": "budget|sales|inventory|savings|alert"}}
]
"""

        response = ai_model.generate_content(prompt)
        raw = response.text.strip()

        # Clean potential markdown fences
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0]
        raw = raw.strip()

        recommendations = json.loads(raw)

        return recommendations

    except Exception as e:
        print("Recommendation Error:", e)
        return []