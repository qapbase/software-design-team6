import os
import pickle
import numpy as np
import traceback
from flask import Blueprint, jsonify
from database.db import get_db

forecast_bp = Blueprint('forecast', __name__)

# ══════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════
WINNING_MODEL = 'lstm'  # Options: 'lstm' | 'gru' | 'arima'

# Robust Path Discovery
# This finds the 'financial-tracker-api' root folder regardless of where Flask starts
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BASE = os.path.join(ROOT_DIR, 'ml', 'models')

MODEL_FILES = {
    'lstm':  'lstm_model.h5',
    'gru':   'gru_model.h5',
    'arima': 'arima_model.pkl',
}

_state = {
    'loaded': False,
    'model':  None,
    'scaler': None,
    'window': 7,
    'error':  None,
}

# ══════════════════════════════════════════════════════════
# VERSION SURGERY (Keras 2 -> Keras 3 Bridge)
# ══════════════════════════════════════════════════════════

def _get_fixed_layers():
    from tensorflow.keras.layers import LSTM, GRU
    
    class FixedLSTM(LSTM):
        def __init__(self, *args, **kwargs):
            kwargs.pop('time_major', None)
            super().__init__(*args, **kwargs)

    class FixedGRU(GRU):
        def __init__(self, *args, **kwargs):
            kwargs.pop('time_major', None)
            super().__init__(*args, **kwargs)
            
    return {'LSTM': FixedLSTM, 'GRU': FixedGRU}


# ══════════════════════════════════════════════════════════
# LAZY LOADER
# ══════════════════════════════════════════════════════════

def _ensure_loaded():
    if _state['loaded']:
        return True
    
    # We try to reload if there was a previous error to allow recovery
    try:
        print(f"[forecast] Attempting to load models from: {BASE}")

        # ── 1. Scaler ──
        scaler_path = os.path.join(BASE, 'scaler.pkl')
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f'MISSING: {scaler_path}')
        with open(scaler_path, 'rb') as f:
            _state['scaler'] = pickle.load(f)

        # ── 2. Config ──
        config_path = os.path.join(BASE, 'config.pkl')
        if not os.path.exists(config_path):
            raise FileNotFoundError(f'MISSING: {config_path}')
        with open(config_path, 'rb') as f:
            cfg = pickle.load(f)
        _state['window'] = int(cfg.get('window', 7))

        # ── 3. Model ──
        if WINNING_MODEL in ('lstm', 'gru'):
            # Set environment flags BEFORE importing TF
            os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
            os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
            
            from tensorflow.keras.models import load_model
            from tensorflow.keras.utils import custom_object_scope
            
            model_path = os.path.join(BASE, MODEL_FILES[WINNING_MODEL])
            if not os.path.exists(model_path):
                raise FileNotFoundError(f'MISSING MODEL: {model_path}')
            
            with custom_object_scope(_get_fixed_layers()):
                _state['model'] = load_model(model_path, compile=False)

        elif WINNING_MODEL == 'arima':
            model_path = os.path.join(BASE, 'arima_model.pkl')
            with open(model_path, 'rb') as f:
                _state['model'] = pickle.load(f)

        _state['loaded'] = True
        _state['error'] = None 
        print(f'[forecast] ✓ {WINNING_MODEL.upper()} Ready.')
        return True

    except Exception as e:
        _state['error'] = str(e)
        print("\n" + "="*50)
        print(f"[forecast] CRITICAL LOAD ERROR: {e}")
        traceback.print_exc() # This will show the exact line that failed in your terminal
        print("="*50 + "\n")
        return False


# ══════════════════════════════════════════════════════════
# HELPERS
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

def _inverse(arr):
    return _state['scaler'].inverse_transform(
        np.array(arr).flatten().reshape(-1, 1)
    ).flatten()

def _run_forecast(sales, steps=7):
    model  = _state['model']
    window = _state['window']
    scaler = _state['scaler']

    if WINNING_MODEL in ('lstm', 'gru'):
        scaled = scaler.transform(np.array(sales).reshape(-1, 1)).flatten()
        inp, preds = scaled[-window:].copy(), []
        
        for _ in range(steps):
            # Reshape for LSTM: (samples, time_steps, features)
            p = model.predict(inp.reshape(1, window, 1), verbose=0)[0, 0]
            preds.append(p)
            inp = np.append(inp[1:], p)
            
        return [round(float(v), 2) for v in _inverse(preds)]

    elif WINNING_MODEL == 'arima':
        pred = model.forecast(steps=steps)
        return [round(float(v), 2) for v in pred]

def _label(amount):
    if amount <= 0:      return 'No data'
    elif amount < 5000:  return 'Low activity week'
    elif amount < 15000: return 'Moderate sales week'
    elif amount < 30000: return 'Active sales week'
    else:                return 'High sales week'


# ══════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════

@forecast_bp.route('/forecast', methods=['GET'])
def get_forecast():
    if not _ensure_loaded():
        return jsonify({'error': f"Model not loaded: {_state['error']}"}), 503

    sales = _get_daily_sales()
    window = _state['window']

    if len(sales) < window:
        return jsonify({'error': f'Need at least {window} days of sales data.'}), 400

    forecast = _run_forecast(sales)
    recommended_budget = round(sum(forecast), 2)

    return jsonify({
        'model': WINNING_MODEL.upper(),
        'forecast': forecast,
        'recommended_budget': recommended_budget,
        'budget_label': _label(recommended_budget),
        'recent_sales': [round(float(v), 2) for v in sales[-30:]],
        'total_history_days': len(sales),
    }), 200

@forecast_bp.route('/forecast/budget', methods=['GET'])
def get_budget():
    if not _ensure_loaded():
        return jsonify({'recommended_budget': 0, 'label': 'Model load error'}), 503

    sales = _get_daily_sales()
    if len(sales) < _state['window']:
        return jsonify({'recommended_budget': 0, 'label': 'Insufficient data'}), 400

    forecast = _run_forecast(sales)
    total = round(sum(forecast), 2)

    return jsonify({
        'recommended_budget': total,
        'label': _label(total),
        'model': WINNING_MODEL.upper()
    }), 200