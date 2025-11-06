'use client'

import { useState, FormEvent } from 'react'
import { toast } from 'sonner'

interface SummaryFormProps {
  onSummarize: (text: string) => void
  isLoading: boolean
}

export default function SummaryForm({ onSummarize, isLoading }: SummaryFormProps) {
  const [text, setText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const maxChars = 50000
  const minChars = 10

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (text.trim().length < minChars) {
      toast.error(`Please enter at least ${minChars} characters`)
      return
    }

    if (text.trim().length > maxChars) {
      toast.error(`Text is too long. Maximum ${maxChars.toLocaleString()} characters allowed.`)
      return
    }

    toast.success('Generating summary...')
    onSummarize(text.trim())
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    setCharCount(newText.length)
  }

  const handleClear = () => {
    setText('')
    setCharCount(0)
  }

  const handleExampleText = () => {
    const exampleText = `Artificial Intelligence has revolutionized numerous industries in recent years, transforming the way we work, communicate, and solve complex problems. Machine learning algorithms have become increasingly sophisticated, enabling computers to learn from data and make predictions with remarkable accuracy. Deep learning, a subset of machine learning, has led to breakthroughs in image recognition, natural language processing, and autonomous systems.

The impact of AI extends across healthcare, finance, transportation, and entertainment. In healthcare, AI-powered diagnostic tools assist doctors in identifying diseases earlier and more accurately. In finance, algorithmic trading and fraud detection systems leverage AI to process vast amounts of data in real-time. Self-driving cars represent a significant application of AI in transportation, promising to reduce accidents and improve traffic efficiency.

However, the rapid advancement of AI also raises important ethical considerations. Questions about job displacement, privacy, algorithmic bias, and the concentration of AI capabilities among a few large corporations require careful attention. As AI systems become more powerful and ubiquitous, society must grapple with how to ensure these technologies benefit everyone while mitigating potential risks.

Looking ahead, the future of AI appears both promising and challenging. Continued research in areas like explainable AI, federated learning, and quantum machine learning may unlock new possibilities. The key will be developing AI systems that are not only powerful but also trustworthy, transparent, and aligned with human values.`

    setText(exampleText)
    setCharCount(exampleText.length)
  }

  const isTextValid = text.trim().length >= minChars && text.trim().length <= maxChars
  const charCountColor =
    charCount > maxChars ? 'text-red-600' :
    charCount > maxChars * 0.9 ? 'text-yellow-600' :
    'text-gray-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="text-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Enter your text to summarize
          </label>
          <button
            type="button"
            onClick={handleExampleText}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Load example text
          </button>
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Paste your article, email, meeting notes, or any text you want to summarize..."
          aria-label="Text to summarize"
          aria-describedby="char-count-help"
          aria-invalid={charCount > maxChars}
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-2">
          <span
            id="char-count-help"
            className={`text-sm ${charCountColor}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
            {charCount < minChars && charCount > 0 && (
              <span className="ml-2 text-red-600">
                (minimum {minChars} characters required)
              </span>
            )}
          </span>
          {text && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear text"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!isTextValid || isLoading}
          aria-label={isLoading ? "Generating summary" : "Generate summary"}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Summary...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generate Summary
            </>
          )}
        </button>
      </div>
    </form>
  )
}
