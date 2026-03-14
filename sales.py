from flask import Blueprint, request, jsonify
from database.db import get_db

sales_bp = Blueprint('sales', __name__)

# ── GET all sales ──────────────────────────────────────────────────────
@sales_bp.route('/sales', methods=['GET'])
def get_sales():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM sales ORDER BY date DESC')
    rows = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows]), 200


# ── GET sales summary by month (for chart) ────────────────────────────
@sales_bp.route('/sales/summary', methods=['GET'])
def get_sales_summary():
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


# ── POST add a sale ────────────────────────────────────────────────────
@sales_bp.route('/sales', methods=['POST'])
def add_sale():
    data = request.get_json()

    if not data.get('item_name') or not data.get('quantity'):
        return jsonify({ 'error': 'item_name and quantity are required' }), 400

    quantity = int(data['quantity'])
    price = float(data['price'])
    total = quantity * price

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO sales (item_name, quantity, price, total, date)
           VALUES (?, ?, ?, ?, ?)''',
        (
            data['item_name'],
            quantity,
            price,
            total,
            data.get('date'),
        )
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({
        'message': 'Sale recorded',
        'id': new_id,
        'total': total
    }), 201