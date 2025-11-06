'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useRef } from 'react'

/**
 * DIAGNOSTIC COMPONENT - Remove após teste
 *
 * Objetivo: Verificar se ReactMarkdown está gerando HTML correto
 */
export default function DiagnosticMarkdown() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      console.log('=== DIAGNOSTIC MARKDOWN HTML ===')
      console.log('Inner HTML:', containerRef.current.innerHTML)
      console.log('First H2:', containerRef.current.querySelector('h2'))
      console.log('All LIs:', containerRef.current.querySelectorAll('li'))
      console.log('Computed styles H2:', containerRef.current.querySelector('h2')
        ? window.getComputedStyle(containerRef.current.querySelector('h2')!)
        : 'No H2 found')
    }
  }, [])

  const testMarkdown = `## Overview

This is a test paragraph with some **bold text**.

## Key Points

- **Healthcare**: AI-powered diagnostic tools
- **Finance**: Algorithmic trading
- **Transportation**: Self-driving cars

## Conclusion

Final thoughts here.`

  return (
    <div className="border-4 border-red-500 p-4 m-4">
      <h3 className="text-xl font-bold text-red-600 mb-4">DIAGNOSTIC TEST</h3>

      {/* Test 1: ReactMarkdown sem prose */}
      <div className="border-2 border-blue-500 p-4 mb-4">
        <h4 className="font-bold text-blue-600 mb-2">Test 1: ReactMarkdown (NO prose classes)</h4>
        <div ref={containerRef}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {testMarkdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* Test 2: ReactMarkdown com prose */}
      <div className="border-2 border-green-500 p-4 mb-4">
        <h4 className="font-bold text-green-600 mb-2">Test 2: ReactMarkdown (WITH prose classes)</h4>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {testMarkdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* Test 3: HTML direto */}
      <div className="border-2 border-purple-500 p-4">
        <h4 className="font-bold text-purple-600 mb-2">Test 3: Raw HTML (para comparação)</h4>
        <div>
          <h2>Overview</h2>
          <p>This is a test paragraph with some <strong>bold text</strong>.</p>
          <h2>Key Points</h2>
          <ul>
            <li><strong>Healthcare</strong>: AI-powered diagnostic tools</li>
            <li><strong>Finance</strong>: Algorithmic trading</li>
            <li><strong>Transportation</strong>: Self-driving cars</li>
          </ul>
          <h2>Conclusion</h2>
          <p>Final thoughts here.</p>
        </div>
      </div>
    </div>
  )
}
