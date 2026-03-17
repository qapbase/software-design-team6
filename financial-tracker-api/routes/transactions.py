from flask import Blueprint, request, jsonify
from database.db import get_db

transactions_bp = Blueprint('transactions', __name__)


# ── Helper: get actual column names ──
def _get_columns():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(transactions)")
    cols = [row[1] for row in cursor.fetchall()]
    conn.close()
    return cols


# ── GET all transactions ───────────────────────────────────────────────
@transactions_bp.route('/transactions', methods=['GET'])
def get_transactions():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM transactions ORDER BY date DESC')
    rows = cursor.fetchall()
    conn.close()

    transactions = [dict(row) for row in rows]
    return jsonify(transactions), 200


# ── GET total balance ──────────────────────────────────────────────────
@transactions_bp.route('/transactions/balance', methods=['GET'])
def get_balance():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT SUM(amount) as total FROM transactions')
    result = cursor.fetchone()
    conn.close()

    total = result['total'] or 0
    return jsonify({'balance': round(total, 2)}), 200


# ── POST add a new transaction ─────────────────────────────────────────
@transactions_bp.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()

    # Accept either to_name or category from frontend
    name = data.get('to_name') or data.get('category') or data.get('name', '')
    amount = data.get('amount')

    if not name or amount is None:
        return jsonify({'error': 'name and amount are required'}), 400

    # Detect which columns the table actually has
    columns = _get_columns()

    conn = get_db()
    cursor = conn.cursor()

    if 'to_name' in columns:
        cursor.execute(
            '''INSERT INTO transactions (to_name, amount, type, date, note)
               VALUES (?, ?, ?, ?, ?)''',
            (
                name,
                float(amount),
                data.get('type', 'expense'),
                data.get('date', ''),
                data.get('note', ''),
            )
        )
    elif 'category' in columns:
        cursor.execute(
            '''INSERT INTO transactions (type, category, amount, date, note)
               VALUES (?, ?, ?, ?, ?)''',
            (
                data.get('type', 'expense'),
                name,
                float(amount),
                data.get('date', ''),
                data.get('note', ''),
            )
        )
    else:
        conn.close()
        return jsonify({'error': 'Unknown table schema'}), 500

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({
        'message': 'Transaction added successfully',
        'id': new_id
    }), 201


# ── DELETE a transaction ───────────────────────────────────────────────
@transactions_bp.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM transactions WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Transaction deleted'}), 200