import sqlite3
import os

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
    # SAMPLE INVENTORY DATA
    # -----------------------------
    cursor.execute("SELECT COUNT(*) FROM storage")
    count = cursor.fetchone()[0]

    if count == 0:

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
    # SAMPLE SALES DATA
    # -----------------------------
    cursor.execute("SELECT COUNT(*) FROM sales")
    sales_count = cursor.fetchone()[0]

    if sales_count == 0:

        cursor.executemany("""
        INSERT INTO sales (item_name, quantity, price, total, date)
        VALUES (?, ?, ?, ?, ?)
        """, [

        ("Canned Tuna", 20, 25, 500, "2026-01-01"),
        ("Soft Drink", 35, 20, 700, "2026-01-05"),
        ("Cooking Oil", 15, 80, 1200, "2026-01-10"),
        ("Instant Noodles", 40, 15, 600, "2026-01-15"),
        ("Rice", 25, 45, 1125, "2026-01-20"),

        ("Bread", 18, 30, 540, "2026-01-22"),
        ("Milk", 22, 50, 1100, "2026-01-23"),
        ("Eggs", 45, 8, 360, "2026-01-24"),
        ("Coffee", 30, 12, 360, "2026-01-25"),
        ("Chips", 28, 18, 504, "2026-01-26"),
        ("Chocolate", 24, 20, 480, "2026-01-27"),
        ("Energy Drink", 16, 35, 560, "2026-01-28"),
        ])

    conn.commit()
    conn.close()