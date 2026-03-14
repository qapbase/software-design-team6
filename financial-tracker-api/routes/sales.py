import os
from flask import Blueprint, request, jsonify
from database.db import get_db
from datetime import datetime

sales_bp = Blueprint('sales', __name__)

# ── GET all sales ──────────────────────────────────────────────────────
@sales_bp.route('/sales', methods=['GET'])
def get_sales():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM sales ORDER BY date DESC')
        rows = cursor.fetchall()
        conn.close()

        return jsonify([dict(row) for row in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET sales summary by month (for chart) ────────────────────────────
@sales_bp.route('/sales/summary', methods=['GET'])
def get_sales_summary():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                strftime('%Y-%m', date) as month,
                SUM(total) as total_sales,
                COUNT(*) as transaction_count
            FROM sales
            GROUP BY month
            ORDER BY month ASC
        ''')
        rows = cursor.fetchall()
        conn.close()

        return jsonify([dict(row) for row in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── POST add a sale ────────────────────────────────────────────────────
@sales_bp.route('/sales', methods=['POST'])
def add_sale():
    data = request.get_json()

    # 1. Validation
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    price = data.get('price')

    if not all([item_name, quantity, price]):
        return jsonify({'error': 'item_name, quantity, and price are required'}), 400

    try:
        # 2. Calculation & Formatting
        qty_int = int(quantity)
        price_float = float(price)
        total = round(qty_int * price_float, 2)
        
        # Ensure date is YYYY-MM-DD for the LSTM model's "GROUP BY date"
        # If no date is provided, use today's date
        sale_date = data.get('date')
        if not sale_date:
            sale_date = datetime.now().strftime('%Y-%m-%d')

        # 3. Database Insertion
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            '''INSERT INTO sales (item_name, quantity, price, total, date)
               VALUES (?, ?, ?, ?, ?)''',
            (item_name, qty_int, price_float, total, sale_date)
        )
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()

        return jsonify({
            'message': 'Sale recorded successfully',
            'id': new_id,
            'total': total,
            'date': sale_date
        }), 201

    except ValueError:
        return jsonify({'error': 'Quantity must be an integer and price a number'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500