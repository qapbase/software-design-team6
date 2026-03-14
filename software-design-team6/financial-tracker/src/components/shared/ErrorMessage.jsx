import { AlertCircle, RefreshCw } from 'lucide-react'

function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-xs text-pink-600 
          hover:text-pink-700 font-medium"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage