import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

// Mock fetch globally
global.fetch = jest.fn();

describe("Home Page", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders the main heading", () => {
    render(<Home />);

    expect(screen.getByText(/smart summary app/i)).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);

    expect(
      screen.getByText(/transform long text into concise summaries/i),
    ).toBeInTheDocument();
  });

  it("renders the summary form", () => {
    render(<Home />);

    expect(
      screen.getByLabelText(/enter your text to summarize/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate summary/i }),
    ).toBeInTheDocument();
  });

  it("handles successful summarization with streaming", async () => {
    const user = userEvent.setup();

    // Mock streaming response
    // Each mocked read() delivers one complete "data: ...\n\n" event, matching
    // how the backend actually streams (every token is yielded with its own
    // trailing \n\n). A separate test below covers a chunk split mid-event.
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("data: This is \n\n"),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("data: a test summary.\n\n"),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("data: [DONE]\n\n"),
        })
        .mockResolvedValueOnce({ done: true }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<Home />);

    const textarea = screen.getByRole("textbox");
    await user.type(
      textarea,
      "This is a long text that needs summarization for testing.",
    );

    const submitButton = screen.getByRole("button", {
      name: /generate summary/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("This is a test summary.")).toBeInTheDocument();
    });
  });

  it("reassembles an SSE event split mid-line across two reads", async () => {
    const user = userEvent.setup();

    // Simulates a chunk boundary landing inside a single event -- the
    // trailing "\n\n" only arrives in the second read. The reader must
    // buffer the incomplete event instead of dropping or mis-parsing it.
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("data: partial-eve"),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("nt-text\n\ndata: [DONE]\n\n"),
        })
        .mockResolvedValueOnce({ done: true }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<Home />);

    const textarea = screen.getByRole("textbox");
    await user.type(
      textarea,
      "This is a long text that needs summarization for testing.",
    );

    const submitButton = screen.getByRole("button", {
      name: /generate summary/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("partial-event-text")).toBeInTheDocument();
    });
  });

  it("displays error message when API returns error", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: "API Error" }),
    });

    render(<Home />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "This is a test text for error handling.");

    const submitButton = screen.getByRole("button", {
      name: /generate summary/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("handles network errors gracefully", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<Home />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "This is a test text for network error.");

    const submitButton = screen.getByRole("button", {
      name: /generate summary/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("clears error when new summarization is attempted", async () => {
    const user = userEvent.setup();

    // First request fails
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("First error"));

    render(<Home />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Test text that will fail.");

    const submitButton = screen.getByRole("button", {
      name: /generate summary/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("First error")).toBeInTheDocument();
    });

    // Clear textarea and type new text
    await user.clear(textarea);
    await user.type(textarea, "New test text for retry.");

    // Mock successful response for second attempt
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("data: Success\n\n"),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode("data: [DONE]\n\n"),
        })
        .mockResolvedValueOnce({ done: true }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    await user.click(submitButton);

    // Error should be cleared (not finding it means it was removed)
    await waitFor(() => {
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });
  });
});
