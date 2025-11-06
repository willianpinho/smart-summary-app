'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface FormattedSummaryProps {
  content: string
  isStreaming?: boolean
}

/**
 * SOLUÇÃO B: CSS Puro (sem @tailwindcss/typography)
 *
 * Esta é uma alternativa caso você não queira usar o plugin typography.
 * Usa Tailwind utilities puras para estilizar elementos Markdown.
 *
 * Para usar:
 * 1. Renomeie FormattedSummary.tsx → FormattedSummaryWithPlugin.tsx
 * 2. Renomeie este arquivo → FormattedSummary.tsx
 * 3. Remova @tailwindcss/typography do tailwind.config.js
 */
export default function FormattedSummary({ content, isStreaming = false }: FormattedSummaryProps) {
  // Debug: Log content to see what's being rendered
  if (typeof window !== 'undefined' && content.length > 50) {
    console.log('=== FORMATTED SUMMARY DEBUG (Custom CSS) ===')
    console.log('Content length:', content.length)
    console.log('First 300 chars:', content.substring(0, 300))
    console.log('Has ## headers:', content.includes('##'))
    console.log('Has bullets:', content.includes('- **'))
    console.log('Newline count:', (content.match(/\n/g) || []).length)
  }

  return (
    <div className="relative">
      {/*
        CSS Puro com Tailwind utilities diretas
        Não depende de @tailwindcss/typography
      */}
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headers
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold mb-4 mt-8 text-blue-700 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-bold mb-4 mt-8 text-blue-700 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-lg font-bold mb-3 mt-5 text-gray-800 dark:text-gray-200"
                {...props}
              />
            ),

            // Paragraphs
            p: ({ node, ...props }) => (
              <p
                className="leading-7 mb-5 text-gray-700 dark:text-gray-300"
                {...props}
              />
            ),

            // Lists
            ul: ({ node, ...props }) => (
              <ul
                className="my-5 space-y-3"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="my-5 list-decimal pl-6 space-y-3"
                {...props}
              />
            ),
            li: ({ node, children, ...props }) => (
              <li
                className="text-gray-700 dark:text-gray-300 pl-6 relative"
                {...props}
              >
                <span className="absolute left-0 text-blue-500 font-bold">▸</span>
                {children}
              </li>
            ),

            // Text formatting
            strong: ({ node, ...props }) => (
              <strong
                className="font-semibold text-gray-900 dark:text-white"
                {...props}
              />
            ),
            em: ({ node, ...props }) => (
              <em className="italic" {...props} />
            ),

            // Code - Fixed TypeScript error
            code: ({ node, ...props }) => {
              const isInline = !props.className
              return isInline ? (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
                  {...props}
                />
              ) : (
                <code
                  className="block bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto"
                  {...props}
                />
              )
            },

            // Blockquotes
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4"
                {...props}
              />
            ),

            // Links
            a: ({ node, ...props }) => (
              <a
                className="text-blue-600 dark:text-blue-400 hover:underline"
                {...props}
              />
            ),
          } as Components}
        >
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
