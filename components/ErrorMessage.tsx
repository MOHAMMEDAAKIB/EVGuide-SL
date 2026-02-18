interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'inline' | 'card' | 'fullScreen';
}

export default function ErrorMessage({ 
  title = 'Oops! Something went wrong',
  message,
  onRetry,
  variant = 'card'
}: ErrorMessageProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error Text */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">{message}</p>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Try Again</span>
        </button>
      )}
    </div>
  );

  if (variant === 'fullScreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 p-6">
        {content}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-xl p-8">
        {content}
      </div>
    );
  }

  // Inline variant
  return (
    <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <svg
        className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">{title}</h4>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 dark:text-red-500 font-medium hover:underline mt-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
