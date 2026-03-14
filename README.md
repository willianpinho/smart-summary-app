# Smart Summary

**AI-powered text summarization with real-time streaming.**

Paste any text and watch a structured, markdown-formatted summary materialize word by word -- powered by GPT-4o-mini and delivered through Server-Sent Events.

[![CI](https://github.com/willianpinho/smart-summary-app/actions/workflows/ci.yml/badge.svg)](https://github.com/willianpinho/smart-summary-app/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Screenshots

> _Coming soon -- screenshots of the summarization interface, streaming in action, and dark mode._

---

## Features

| Feature | Description |
|---------|-------------|
| **Real-time streaming** | SSE-based progressive text rendering -- summary appears word by word |
| **Markdown output** | Structured summaries with headers, bold highlights, and bullet points via `@tailwindcss/typography` |
| **Prompt injection prevention** | Multi-layer defense: system prompt isolation, pattern detection, special character ratio checks |
| **Input validation** | 10--50,000 character range enforced on both client and server |
| **Dark mode** | System-aware theme switching with Tailwind |
| **Copy to clipboard** | One-click copy of the generated summary |
| **Example text loader** | Pre-loaded sample text for instant demo |
| **CORS security** | Allowlist restricted to `localhost` and `*.vercel.app` origins |

---

## Architecture

```
                                    POST /api/summarize
 ┌──────────────┐    HTTPS     ┌──────────────────┐    OpenAI SDK    ┌─────────────┐
 │              │ ───────────> │                  │ ──────────────> │             │
 │   Next.js    │              │     FastAPI      │                  │   OpenAI    │
 │   React 19   │ <─────────── │   Python 3.11    │ <────────────── │  GPT-4o-mini│
 │              │  SSE stream  │                  │  stream chunks  │             │
 └──────────────┘              └──────────────────┘                  └─────────────┘
    Port 3000                      Port 8000                          External API
```

### Data Flow

1. User pastes text into the React form
2. Client-side validation enforces length and format constraints
3. `POST /api/summarize` sends the text to FastAPI
4. Server-side validation runs prompt injection detection and input sanitization
5. FastAPI streams a chat completion request to OpenAI (GPT-4o-mini, temperature 0.3)
6. Tokens are accumulated, formatted with markdown post-processing, then re-streamed as SSE chunks
7. The frontend renders the summary progressively with `@tailwindcss/typography`

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **FastAPI middleware layer** | Keeps the OpenAI API key server-side, centralizes validation, enables logging and rate limiting without exposing secrets to the browser |
| **SSE over WebSockets** | Summarization is unidirectional (server to client). SSE is simpler, has native browser support via `EventSource`, and avoids the connection management overhead of WebSockets |
| **GPT-4o-mini** | Optimal cost-quality tradeoff for summarization ($0.15/1M input tokens, sub-2s latency) |
| **Markdown post-processing** | The LLM output is reformatted server-side (`format_markdown_with_breaks`) to ensure consistent heading spacing and bullet structure before streaming |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript 5.6 | App Router, server/client components |
| **Styling** | Tailwind CSS, `@tailwindcss/typography` | Utility-first CSS, prose rendering |
| **Backend** | FastAPI 0.115, Python 3.11, Pydantic 2.9 | Async API, streaming, validation |
| **AI** | OpenAI SDK, GPT-4o-mini | Chat completions with streaming |
| **Testing** | Jest, React Testing Library, Playwright, Pytest | Unit, component, E2E, API tests |
| **CI/CD** | GitHub Actions | Lint, test, build, deploy |
| **Hosting** | Vercel (frontend), Render (backend) | Edge deployment, managed Python |

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm (or pnpm)
- Python 3.11+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### 1. Clone and configure

```bash
git clone https://github.com/willianpinho/smart-summary-app.git
cd smart-summary-app

# Create environment file
cp .env.example .env   # or create manually
```

Add your API key to `.env`:

```
OPENAI_API_KEY=sk-...
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

| Variable | Location | Required | Default | Description |
|----------|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Backend `.env` | Yes | -- | OpenAI API key for GPT-4o-mini |
| `NEXT_PUBLIC_API_URL` | Frontend `.env` | No | `http://localhost:8000` | Backend API base URL |
| `ALLOWED_ORIGINS` | Backend `.env` | No | -- | Comma-separated additional CORS origins |

---

## Testing

The project maintains **62 tests** across three layers with 95%+ backend coverage.

### Backend (24 tests)

```bash
cd backend
source venv/bin/activate

pytest -v                                  # Run all tests
pytest --cov=main --cov-report=term-missing  # With coverage report
```

Covers: endpoint responses, input validation, prompt injection prevention, SSE streaming, error handling.

### Frontend Unit Tests (24 tests)

```bash
cd frontend

npm test                  # Run all unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

Covers: component rendering, form validation, streaming display, snapshot regression.

### E2E Tests (14 tests)

```bash
cd frontend

npx playwright install    # First time only
npm run e2e               # Headless
npm run e2e:ui            # Interactive UI mode
```

Covers: full summarization flow, error states, clipboard copy, dark mode, responsive layout.

---

## API Reference

### `GET /`

Health check.

```json
{ "status": "healthy", "service": "Smart Summary API", "version": "1.0.0" }
```

### `GET /health`

Detailed health check including OpenAI configuration status.

```json
{ "status": "healthy", "openai_configured": true, "service": "Smart Summary API" }
```

### `POST /api/summarize`

Streams a markdown-formatted summary via Server-Sent Events.

**Request:**

```json
{ "text": "Your long text here (10-50,000 characters)..." }
```

**Response** (`text/event-stream`):

```
data: ## Over
data: view\n\nTh
data: is is a su
data: mmary...
data: [DONE]
```

**Error codes:**

| Status | Reason |
|--------|--------|
| `422` | Validation error -- text too short, too long, or suspicious patterns detected |
| `500` | Internal server error (logged server-side, generic message returned) |

---

## Project Structure

```
smart-summary-app/
├── backend/
│   ├── main.py                 # FastAPI application (routes, validation, streaming)
│   ├── test_main.py            # 24 Pytest tests
│   └── requirements.txt
│
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout with metadata
│   │   └── globals.css         # Tailwind base styles
│   ├── components/
│   │   ├── SummaryForm.tsx     # Text input form with validation
│   │   ├── SummaryDisplay.tsx  # Streaming summary renderer
│   │   ├── FormattedSummary.tsx# Markdown prose component
│   │   └── StreamingProgress.tsx # Progress indicator
│   ├── lib/
│   │   └── config.ts           # API URL configuration
│   ├── __tests__/              # Jest + RTL unit tests
│   ├── e2e/                    # Playwright E2E tests
│   ├── playwright.config.ts
│   ├── jest.config.js
│   └── tailwind.config.js
│
├── .github/workflows/          # CI/CD pipeline
├── vercel.json                 # Vercel deployment config
├── render.yaml                 # Render deployment config
└── README.md
```

---

## Deployment

### Frontend (Vercel)

The frontend deploys automatically on push to `main` via Vercel's GitHub integration. Configuration lives in `vercel.json`.

Set the build-time environment variable:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend (Render)

The backend deploys automatically via `render.yaml`. Set the following environment variable in the Render dashboard:

```
OPENAI_API_KEY=sk-...
```

### CI/CD Pipeline

Every push and pull request triggers the GitHub Actions workflow:

1. **Lint** -- ESLint (frontend), formatting checks
2. **Test** -- Pytest (backend), Jest (frontend), Playwright (E2E)
3. **Build** -- Next.js production build
4. **Deploy** -- Automatic on `main` via Vercel and Render

---

## Security

- **Prompt injection prevention** -- System prompt uses strict role separation; user text is treated as content, never as instructions. Pattern detection flags suspicious inputs.
- **Input sanitization** -- Special character ratio analysis, repeated pattern detection, and length bounds enforced via Pydantic validators on the server.
- **API key isolation** -- The OpenAI key lives exclusively on the backend. The frontend never touches it.
- **CORS allowlist** -- Only `localhost` and `*.vercel.app` origins are permitted. Additional origins can be added via the `ALLOWED_ORIGINS` env var.
- **Error opacity** -- Detailed errors are logged server-side; clients receive generic messages only.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Write tests for your changes
4. Ensure all checks pass: `pytest` + `npm test` + `npm run e2e`
5. Open a pull request

All PRs must pass CI (lint, test, build) before merging.

---

## License

[MIT](LICENSE)
