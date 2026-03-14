// Base URL of your Flask backend
const BASE_URL = 'http://localhost:5000/api'

// ── Generic fetch helper ───────────────────────────────────────────────
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Something went wrong')
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message)
    throw error
  }
}

// ── Transactions ───────────────────────────────────────────────────────
export const transactionsAPI = {
  getAll: () =>
    request('/transactions'),

  getBalance: () =>
    request('/transactions/balance'),

  add: (data) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/transactions/${id}`, {
      method: 'DELETE',
    }),
}

// ── Storage / Inventory ────────────────────────────────────────────────
export const storageAPI = {
  getAll: () =>
    request('/storage'),

  add: (data) =>
    request('/storage', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStock: (id, current_stock) =>
    request(`/storage/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ current_stock }),
    }),
}

// ── Sales ──────────────────────────────────────────────────────────────
export const salesAPI = {
  getAll: () =>
    request('/sales'),

  getSummary: () =>
    request('/sales/summary'),

  add: (data) =>
    request('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ── Forecast API ──────────────────────────────────────────
export const forecastAPI = {
 
  // Full forecast + recent sales history (for chart)
  getForecast: async () => {
    const res = await fetch(`${BASE_URL}/forecast`)
    if (!res.ok) throw new Error('Forecast fetch failed')
    return res.json()
  },
 
  // Budget number only (for RecommendationCard)
  getBudget: async () => {
    const res = await fetch(`${BASE_URL}/forecast/budget`)
    if (!res.ok) throw new Error('Budget fetch failed')
    return res.json()
  },
 
}
 