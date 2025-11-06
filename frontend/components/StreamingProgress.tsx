'use client'

interface StreamingProgressProps {
  currentLength: number
  wordsGenerated: number
  isComplete: boolean
}

export default function StreamingProgress({
  currentLength,
  wordsGenerated,
  isComplete
}: StreamingProgressProps) {
  // Estimar progresso baseado em comprimento típico de resumo (200 palavras)
  const estimatedLength = 200
  const progress = Math.min((wordsGenerated / estimatedLength) * 100, 95)

  return (
    <div className="mb-6 space-y-2" role="status" aria-live="polite">
      {/* Barra de progresso */}
      <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600
            rounded-full transition-all duration-300 ease-out"
          style={{ width: isComplete ? '100%' : `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {!isComplete && (
            <div className="absolute inset-0 bg-gradient-to-r
              from-transparent via-white/20 to-transparent animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          )}
        </div>
      </div>

      {/* Contador de palavras e status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            {!isComplete && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
            {isComplete && (
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="font-medium">
              {isComplete ? 'Complete' : 'Generating'}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span>{wordsGenerated} word{wordsGenerated !== 1 ? 's' : ''}</span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span>{currentLength} character{currentLength !== 1 ? 's' : ''}</span>
        </div>

        {!isComplete && (
          <span className="text-gray-500 dark:text-gray-500 text-xs font-medium">
            ~{Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  )
}
