from flask import Blueprint, request, jsonify
from database.db import get_db

# Blueprint lets us split routes into separate files
transactions_bp = Blueprint('transactions', __name__)

# ── GET all transactions ───────────────────────────────────────────────
@transactions_bp.route('/transactions', methods=['GET'])
def get_transactions():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM transactions ORDER BY date DESC'
    )
    rows = cursor.fetchall()
    conn.close()

    # Convert Row objects to plain dicts
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
    return jsonify({ 'balance': round(total, 2) }), 200


# ── POST add a new transaction ─────────────────────────────────────────
@transactions_bp.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()

    # Basic validation
    if not data.get('to_name') or not data.get('amount'):
        return jsonify({ 'error': 'to_name and amount are required' }), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO transactions (to_name, amount, type, date, note)
           VALUES (?, ?, ?, ?, ?)''',
        (
            data['to_name'],
            float(data['amount']),
            data.get('type', 'Other'),
            data.get('date'),
            data.get('note', ''),
        )
    )
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

    return jsonify({ 'message': 'Transaction deleted' }), 200