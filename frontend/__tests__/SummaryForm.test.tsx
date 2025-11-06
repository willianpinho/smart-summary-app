import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SummaryForm from '@/components/SummaryForm'

describe('SummaryForm', () => {
  const mockOnSummarize = jest.fn()

  beforeEach(() => {
    mockOnSummarize.mockClear()
  })

  it('renders the form with textarea and submit button', () => {
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    expect(screen.getByLabelText(/enter your text to summarize/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate summary/i })).toBeInTheDocument()
  })

  it('displays character count as user types', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Hello World')

    expect(screen.getByText(/11/)).toBeInTheDocument()
  })

  it('enables submit button when text meets minimum length', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /generate summary/i })

    expect(submitButton).toBeDisabled()

    await user.type(textarea, 'This is a valid text input for testing purposes.')
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('calls onSummarize with trimmed text when form is submitted', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, '  This is a valid text input for testing.  ')

    const submitButton = screen.getByRole('button', { name: /generate summary/i })
    await user.click(submitButton)

    expect(mockOnSummarize).toHaveBeenCalledWith('This is a valid text input for testing.')
  })

  it('loads example text when "Load example text" is clicked', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const exampleButton = screen.getByText(/load example text/i)
    await user.click(exampleButton)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value.length).toBeGreaterThan(100)
    expect(textarea.value).toContain('Artificial Intelligence')
  })

  it('clears text when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Some text to clear')

    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)

    expect(textarea).toHaveValue('')
  })

  it('disables inputs when isLoading is true', () => {
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={true} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('shows loading state on submit button when isLoading is true', () => {
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={true} />)

    expect(screen.getByText(/generating summary/i)).toBeInTheDocument()
  })

  it('shows warning when character count is low', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Short')

    expect(screen.getByText(/minimum 10 characters required/i)).toBeInTheDocument()
  })

  it('prevents submission with text below minimum length', async () => {
    const user = userEvent.setup()
    render(<SummaryForm onSummarize={mockOnSummarize} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Short')

    const submitButton = screen.getByRole('button', { name: /generate summary/i })
    expect(submitButton).toBeDisabled()
  })
})
