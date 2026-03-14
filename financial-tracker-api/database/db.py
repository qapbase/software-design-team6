import sqlite3
import os
import datetime
import random

DB_NAME = "financial_tracker.db"
DB_PATH = os.path.join(os.path.dirname(__file__), DB_NAME)

# -----------------------------
# DATABASE CONNECTION
# -----------------------------
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# alias so routes using get_db() will work
def get_db():
    return get_connection()

# -----------------------------
# INITIALIZE DATABASE
# -----------------------------
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # -----------------------------
    # TRANSACTIONS TABLE
    # -----------------------------
    # Add this line to delete the old mismatched table
    cursor.execute("DROP TABLE IF EXISTS transactions") 

    # Now recreate it with the 'category' column
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        note TEXT
    )
    """)

    # -----------------------------
    # STORAGE (INVENTORY) TABLE
    # -----------------------------
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS storage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        emoji TEXT,
        current_stock INTEGER,
        unit TEXT,
        min_level INTEGER,
        status TEXT
    )
    """)

    # -----------------------------
    # SALES TABLE
    # -----------------------------
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        quantity INTEGER,
        price REAL,
        total REAL,
        date TEXT
    )
    """)

    # -----------------------------
    # REFRESH INVENTORY DATA (Only if empty)
    # -----------------------------
    cursor.execute("SELECT COUNT(*) FROM storage")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO storage (item_name, emoji, current_stock, unit, min_level, status)
        VALUES (?, ?, ?, ?, ?, ?)
        """, [
            ("Canned Tuna", "🥫", 10, "pcs", 30, "LOW"),
            ("Soft Drink", "🥤", 6, "bottles", 20, "CRITICAL"),
            ("Cooking Oil", "🫙", 5, "bottles", 20, "CRITICAL"),
            ("Instant Noodles", "🍜", 50, "packs", 20, "OK"),
            ("Rice", "🍚", 40, "kg", 15, "OK"),
            ("Bread", "🍞", 12, "packs", 15, "LOW"),
            ("Milk", "🥛", 8, "cartons", 20, "CRITICAL"),
            ("Eggs", "🥚", 60, "pcs", 30, "OK"),
            ("Coffee", "☕", 25, "packs", 20, "OK"),
            ("Sugar", "🍬", 18, "kg", 15, "OK"),
            ("Salt", "🧂", 10, "packs", 12, "LOW"),
            ("Biscuits", "🍪", 30, "packs", 20, "OK"),
            ("Chips", "🥔", 14, "packs", 15, "LOW"),
            ("Chocolate", "🍫", 22, "bars", 15, "OK"),
            ("Ice Cream", "🍨", 9, "tubs", 12, "LOW"),
            ("Mineral Water", "💧", 35, "bottles", 20, "OK"),
            ("Energy Drink", "⚡", 16, "cans", 20, "LOW"),
            ("Cereal", "🥣", 13, "boxes", 15, "LOW"),
            ("Butter", "🧈", 7, "packs", 12, "CRITICAL"),
            ("Cheese", "🧀", 11, "packs", 15, "LOW"),
        ])

    # -----------------------------
    # FORCE REFRESH SALES DATA (For LSTM Forecast)
    # -----------------------------
    # We delete existing sales to ensure the new "True" mock data is applied
    cursor.execute("DELETE FROM sales")
    
    end_date = datetime.date.today()
    sales_entries = []
    
    for i in range(60):
        current_date = end_date - datetime.timedelta(days=(59 - i))
        
        # Pattern: Upward Trend + Weekend Seasonality
        is_weekend = current_date.weekday() >= 4  # Fri, Sat, Sun
        base_sales = 800 + (i * 15)               # Increasing trend
        weekend_boost = random.randint(300, 600) if is_weekend else 0
        noise = random.randint(-50, 50)
        
        total_daily_revenue = base_sales + weekend_boost + noise
        
        sales_entries.append((
            "Daily Revenue", 
            1, 
            total_daily_revenue, 
            total_daily_revenue, 
            current_date.strftime("%Y-%m-%d")
        ))

    cursor.executemany("""
    INSERT INTO sales (item_name, quantity, price, total, date)
    VALUES (?, ?, ?, ?, ?)
    """, sales_entries)

    # -----------------------------
    # REFRESH TRANSACTIONS (Optional: Clears old 2025 data)
    # -----------------------------
    cursor.execute("DELETE FROM transactions")
    cursor.executemany("""
    INSERT INTO transactions (type, category, amount, date, note)
    VALUES (?, ?, ?, ?, ?)
    """, [
        ("income", "Sales", 4500.00, end_date.strftime("%Y-%m-%d"), "Daily store revenue"),
        ("expense", "Inventory", 1200.00, (end_date - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "Restock Rice"),
        ("expense", "Utilities", 500.00, (end_date - datetime.timedelta(days=2)).strftime("%Y-%m-%d"), "Electricity bill"),
    ])

    conn.commit()
    conn.close()
    print("Database initialized with fresh mock data.")

if __name__ == "__main__":
    init_db()