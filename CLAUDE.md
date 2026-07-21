# Smart Summary App - AI-Powered Text Summarization

> Full-stack AI summarization application with SSE streaming, supporting multiple input types.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS, TypeScript
- **Backend:** FastAPI 0.115, OpenAI SDK, Pydantic, Uvicorn
- **Deployment:** Vercel (frontend), Render (backend)
- **Testing:** Jest + React Testing Library + Playwright (frontend), pytest (backend)

## Commands

### Frontend

```bash
cd frontend
pnpm install
pnpm dev                    # http://localhost:3000
pnpm build                  # Production build
pnpm test                   # Jest unit tests
pnpm e2e                    # Playwright E2E
pnpm test:coverage          # Coverage report
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
pytest                      # All tests
pytest --cov                # Coverage
```

## Architecture

```
frontend/                   # Next.js 16 App Router
├── app/                    # Pages (page.tsx, layout.tsx, globals.css)
├── components/             # React components
├── lib/                    # Utilities (config.ts)
├── __tests__/              # Jest + RTL unit tests
├── e2e/                    # Playwright E2E tests
├── playwright.config.ts    # E2E config
└── vercel.json             # Vercel deployment

backend/                    # FastAPI
├── main.py                 # App entry point (routes, validation, streaming)
├── test_main.py            # pytest suite
└── requirements.txt        # Python dependencies
```

## Environment Variables

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
OPENAI_API_KEY=sk-...
```

## Recommended Agents

`fullstack-developer`, `ai-engineer`, `nextjs-developer`, `fastapi-expert`
