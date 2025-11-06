'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FormattedSummaryProps {
  content: string
  isStreaming?: boolean
}

export default function FormattedSummary({ content, isStreaming = false }: FormattedSummaryProps) {
  // Debug: Log content to see what's being rendered
  if (typeof window !== 'undefined' && content.length > 50) {
    console.log('=== FORMATTED SUMMARY DEBUG ===')
    console.log('Content length:', content.length)
    console.log('First 300 chars:', content.substring(0, 300))
    console.log('Has ## headers:', content.includes('##'))
    console.log('Has bullets:', content.includes('- **'))
    console.log('Newline count:', (content.match(/\n/g) || []).length)
  }

  return (
    <div className="relative">
      {/*
        CRITICAL FIX: @tailwindcss/typography plugin now installed

        prose classes now work correctly:
        - prose: base typography styles
        - prose-slate: slate color scheme
        - dark:prose-invert: dark mode support
        - prose-headings:*, prose-h2:*, prose-li:*, etc: element-specific customizations
      */}
      <div className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-blue-700 dark:prose-h2:text-blue-400
        prose-h2:border-b prose-h2:border-blue-200 dark:prose-h2:border-blue-800 prose-h2:pb-2
        prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
        prose-p:leading-7 prose-p:mb-5 prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-ul:my-5 prose-ul:list-none prose-ul:pl-0
        prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6
        prose-li:mb-3 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:pl-6 prose-li:relative
        prose-li:before:content-['▸'] prose-li:before:absolute prose-li:before:left-0
        prose-li:before:text-blue-500 prose-li:before:font-bold
        prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-em:italic
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-code:text-sm prose-code:font-mono prose-code:text-gray-800 dark:prose-code:text-gray-200
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500
        prose-blockquote:pl-4 prose-blockquote:italic
        prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

      {/* Cursor piscante durante streaming */}
      {isStreaming && (
        <span
          className="inline-block w-0.5 h-5 bg-blue-600 ml-1 animate-pulse align-middle"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
