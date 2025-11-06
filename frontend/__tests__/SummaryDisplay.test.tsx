import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SummaryDisplay from '@/components/SummaryDisplay'

describe('SummaryDisplay', () => {
  it('renders summary text when provided', () => {
    const summary = 'This is a test summary'
    render(<SummaryDisplay summary={summary} isLoading={false} />)

    expect(screen.getByText(summary)).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(<SummaryDisplay summary="" isLoading={true} />)

    expect(screen.getByText(/generating/i)).toBeInTheDocument()
    // Check for loading skeleton
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays copy button when summary is available', () => {
    render(<SummaryDisplay summary="Test summary" isLoading={false} />)

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('does not display copy button when loading', () => {
    render(<SummaryDisplay summary="" isLoading={true} />)

    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument()
  })

  it('copies summary to clipboard when copy button is clicked', async () => {
    const summary = 'Test summary to copy'

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    })

    render(<SummaryDisplay summary={summary} isLoading={false} />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(summary)
    })
  })

  it('shows "Copied!" feedback after successful copy', async () => {
    const summary = 'Test summary'

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    })

    render(<SummaryDisplay summary={summary} isLoading={false} />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument()
    })
  })

  it('displays disclaimer message when summary is shown', () => {
    render(<SummaryDisplay summary="Test summary" isLoading={false} />)

    expect(
      screen.getByText(/this summary was generated using ai/i)
    ).toBeInTheDocument()
  })

  it('does not display disclaimer when loading', () => {
    render(<SummaryDisplay summary="" isLoading={true} />)

    expect(
      screen.queryByText(/this summary was generated using ai/i)
    ).not.toBeInTheDocument()
  })
})
