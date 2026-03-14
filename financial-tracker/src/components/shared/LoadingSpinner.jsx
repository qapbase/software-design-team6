function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="w-7 h-7 border-[3px] border-pink-200
      border-t-pink-600 rounded-full animate-spin" />
      <p className="text-xs text-gray-400 font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner