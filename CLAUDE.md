# Smart Summary App - AI-Powered Text Summarization

> Full-stack AI summarization application with SSE streaming, supporting multiple input types.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS, TypeScript
- **Backend:** FastAPI 0.115, OpenAI SDK, Pydantic, Uvicorn
- **Deployment:** Vercel (frontend), Render (backend)
- **Testing:** Vitest + Playwright (frontend), pytest (backend)

## Commands

### Frontend
```bash
cd frontend
pnpm install
pnpm dev                    # http://localhost:3000
pnpm build                  # Production build
pnpm test                   # Vitest unit tests
pnpm test:e2e               # Playwright E2E
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
├── src/app/                # Pages
├── src/components/         # React components
├── src/lib/                # Utilities
├── playwright.config.ts    # E2E config
└── vercel.json             # Vercel deployment

backend/                    # FastAPI
├── main.py                 # App entry point
├── services/               # OpenAI summarization logic
├── models/                 # Pydantic schemas
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
