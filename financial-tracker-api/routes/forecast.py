import os
import pickle
import numpy as np
import traceback
import sqlite3
import pandas as pd
from flask import Blueprint, jsonify
from database.db import get_db

# ML Imports
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.utils import custom_object_scope

forecast_bp = Blueprint('forecast', __name__)

# ══════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════
WINNING_MODEL = 'arima'
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BASE = os.path.join(ROOT_DIR, 'ml', 'models')

_state = {
    'loaded': False,
    'model':  None,
    'scaler': None,
    'window': 7,
    'error':  None,
}

# ══════════════════════════════════════════════════════════
# RETRAINING ENGINE (The "Brain" Update)
# ══════════════════════════════════════════════════════════

def _retrain_model(sales_data):
    """Takes raw sales list, trains the model, and updates _state"""
    try:
        print("[forecast] 🔄 Retraining LSTM with latest database records...")
        
        # 1. Prepare Data
        data = np.array(sales_data).reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)

        window = _state['window']
        X, y = [], []
        for i in range(window, len(scaled_data)):
            X.append(scaled_data[i-window:i, 0])
            y.append(scaled_data[i, 0])
        
        X, y = np.array(X), np.array(y)
        X = X.reshape((X.shape[0], X.shape[1], 1))

        # 2. Build/Update Model Architecture
        model = Sequential([
            LSTM(50, activation='relu', input_shape=(window, 1)),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')

        # 3. Train (Epochs set to 50 for speed vs accuracy balance)
        model.fit(X, y, epochs=50, verbose=0)

        # 4. Update Global State
        _state['model'] = model
        _state['scaler'] = scaler
        _state['loaded'] = True
        print("[forecast] ✅ Retraining Complete.")
        return True
    except Exception as e:
        print(f"[forecast] Retrain Error: {e}")
        return False

# ══════════════════════════════════════════════════════════
# DATA HELPERS
# ══════════════════════════════════════════════════════════

def _get_daily_sales():
    conn = get_db()
    cur  = conn.cursor()
    cur.execute('''
        SELECT date, SUM(total) as total_sales
        FROM sales
        WHERE total > 0
        GROUP BY date
        ORDER BY date ASC
    ''')
    rows = cur.fetchall()
    conn.close()
    return [r['total_sales'] for r in rows]

def _run_forecast(sales, steps=7):
    model  = _state['model']
    window = _state['window']
    scaler = _state['scaler']

    scaled = scaler.transform(np.array(sales).reshape(-1, 1)).flatten()
    inp = scaled[-window:].copy()
    preds = []
    
    for _ in range(steps):
        p = model.predict(inp.reshape(1, window, 1), verbose=0)[0, 0]
        preds.append(p)
        inp = np.append(inp[1:], p)
        
    # Inverse scaling to get real dollar amounts
    unscaled_preds = scaler.inverse_transform(np.array(preds).reshape(-1, 1)).flatten()
    return [round(float(v), 2) for v in unscaled_preds]

def _label(amount):
    if amount <= 0:      return 'No data'
    elif amount < 5000:  return 'Low activity week'
    elif amount < 15000: return 'Moderate sales week'
    else:                return 'Active sales week'

# ══════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════

@forecast_bp.route('/forecast', methods=['GET'])
def get_forecast():
    sales = _get_daily_sales()
    
    # Validation: Need enough data to fill the "Window"
    if len(sales) < _state['window']:
        return jsonify({'error': f'Need at least {_state["window"]} days of data.'}), 400

    # 🔥 THE CORE CHANGE: Retrain every time the endpoint is called
    success = _retrain_model(sales)
    if not success:
        return jsonify({'error': 'Model training failed'}), 500

    forecast = _run_forecast(sales)
    recommended_budget = round(sum(forecast), 2)

    return jsonify({
        'model': WINNING_MODEL + ' prediction',
        'forecast': forecast,
        'recommended_budget': recommended_budget,
        'budget_label': _label(recommended_budget),
        'recent_sales': [round(float(v), 2) for v in sales[-30:]],
        'total_history_days': len(sales),
    }), 200

@forecast_bp.route('/forecast/budget', methods=['GET'])
def get_budget():
    sales = _get_daily_sales()
    if len(sales) < _state['window']:
        return jsonify({'recommended_budget': 0, 'label': 'Insufficient data'}), 400

    # Ensure model is ready
    if not _state['loaded']:
        _retrain_model(sales)

    forecast = _run_forecast(sales)
    total = round(sum(forecast), 2)

    return jsonify({
        'recommended_budget': total,
        'label': _label(total),
        'model': 'LSTM (Dynamic)'
    }), 200