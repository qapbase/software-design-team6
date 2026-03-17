"""
Run this once to add more inventory items to your database.
Usage: cd financial-tracker-api && python add_sample_data.py
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database", "financial_tracker.db")

NEW_ITEMS = [
    ("Canned Sardines", "🐟", 8, "cans", 15, "LOW"),
    ("Soy Sauce", "🫙", 12, "bottles", 15, "LOW"),
    ("Vinegar", "🫙", 14, "bottles", 15, "LOW"),
    ("Laundry Soap", "🧴", 5, "packs", 12, "CRITICAL"),
    ("Dishwashing Liquid", "🧴", 7, "bottles", 10, "LOW"),
    ("Tissue Paper", "🧻", 20, "rolls", 15, "OK"),
    ("Shampoo Sachets", "🧴", 45, "pcs", 30, "OK"),
    ("Toothpaste", "🪥", 10, "pcs", 12, "LOW"),
    ("Matches", "🔥", 30, "boxes", 20, "OK"),
    ("Candles", "🕯️", 15, "pcs", 20, "LOW"),
    ("Garlic", "🧅", 3, "kg", 5, "CRITICAL"),
    ("Onion", "🧅", 4, "kg", 5, "LOW"),
    ("Tomato Sauce", "🥫", 18, "cans", 15, "OK"),
    ("Corned Beef", "🥫", 6, "cans", 12, "CRITICAL"),
    ("Powdered Milk", "🥛", 9, "packs", 10, "LOW"),
    ("Pancit Canton", "🍜", 35, "packs", 20, "OK"),
    ("Banana Ketchup", "🍌", 11, "bottles", 10, "OK"),
    ("Coconut Oil", "🥥", 4, "bottles", 8, "CRITICAL"),
    ("Peanut Butter", "🥜", 7, "jars", 10, "LOW"),
    ("Condensed Milk", "🥛", 13, "cans", 12, "OK"),
]

def add_items():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check which items already exist
    cursor.execute("SELECT item_name FROM storage")
    existing = {row[0] for row in cursor.fetchall()}

    added = 0
    for item in NEW_ITEMS:
        if item[0] not in existing:
            cursor.execute(
                """INSERT INTO storage (item_name, emoji, current_stock, unit, min_level, status)
                VALUES (?, ?, ?, ?, ?, ?)""",
                item,
            )
            added += 1
            print(f"  Added: {item[1]} {item[0]}")

    conn.commit()
    conn.close()

    print(f"\nDone! Added {added} new items. ({len(existing)} already existed)")

if __name__ == "__main__":
    add_items()