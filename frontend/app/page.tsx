'use client'

import { useState } from 'react'
import SummaryForm from '@/components/SummaryForm'
import SummaryDisplay from '@/components/SummaryDisplay'
import { config } from '@/lib/config'

export default function Home() {
  const [summary, setSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSummarize = async (text: string) => {
    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await fetch(`${config.apiUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate summary')
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      // Handle streaming response using Server-Sent Events
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedSummary = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const chunk = decoder.decode(value)

        // SSE format: events are separated by \n\n
        // Each event contains a data: line with a single character
        const events = chunk.split('\n\n')

        for (const event of events) {
          const lines = event.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6) // Remove 'data: ' prefix

              if (data === '[DONE]') {
                setIsLoading(false)
                return
              }

              if (data.startsWith('[ERROR]')) {
                throw new Error(data.slice(8)) // Remove '[ERROR] ' prefix
              }

              // Accumulate each chunk and unescape newlines
              // Backend sends \n as \\n to avoid breaking SSE format
              const unescaped = data.replace(/\\n/g, '\n')
              accumulatedSummary += unescaped
              setSummary(accumulatedSummary)
            }
          }
        }
      }

      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      console.error('Summarization error:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Summary App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transform long text into concise summaries powered by AI
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <SummaryForm
            onSummarize={handleSummarize}
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {(summary || isLoading) && (
          <SummaryDisplay
            summary={summary}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  )
}
