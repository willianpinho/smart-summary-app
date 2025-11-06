'use client'

import { useState, useEffect } from 'react'
import FormattedSummary from './FormattedSummary'
import StreamingProgress from './StreamingProgress'

interface SummaryDisplayProps {
  summary: string
  isLoading: boolean
}

export default function SummaryDisplay({ summary, isLoading }: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [wordsGenerated, setWordsGenerated] = useState(0)

  // Calcular palavras geradas em tempo real
  useEffect(() => {
    if (summary) {
      const words = summary.trim().split(/\s+/).filter(w => w.length > 0).length
      setWordsGenerated(words)
    }
  }, [summary])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Summary
        </h2>
        {summary && !isLoading && (
          <button
            onClick={handleCopy}
            aria-label={copied ? "Summary copied to clipboard" : "Copy summary to clipboard"}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Indicador de progresso durante streaming */}
      {(isLoading || summary) && (
        <StreamingProgress
          currentLength={summary.length}
          wordsGenerated={wordsGenerated}
          isComplete={!isLoading}
        />
      )}

      {/* Conteúdo do resumo */}
      <div role="region" aria-label="Generated summary" aria-live="polite" aria-busy={isLoading}>
        {isLoading && !summary ? (
          <div className="space-y-4 animate-pulse" aria-label="Loading summary">
            {/* Título */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>

            {/* Primeiro parágrafo */}
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>

            {/* Lista de bullet points */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 mt-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 mt-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <FormattedSummary content={summary} isStreaming={isLoading} />
        )}
      </div>

      {!isLoading && summary && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>
              This summary was generated using AI. While we strive for accuracy, please verify
              important information from the original source.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
