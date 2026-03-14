import { useState, useEffect, useCallback } from 'react'

// Reusable hook for any API call
function useApi(apiFunc, dependencies = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetch()
  }, [fetch])

  // refetch lets components manually reload data
  return { data, loading, error, refetch: fetch }
}

export default useApi