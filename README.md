# Portfolio Rafay

A premium futuristic developer portfolio built with Next.js 15, FastAPI, and modern technologies.

## 🚀 Features

- **3D Featured Projects Carousel** - Impressive homepage showcase
- **Complete Project Portfolio** - Grid layout with responsive design
- **Services with WhatsApp Integration** - Instant client contact
- **Admin Panel** - Full CRUD for content management
- **Neon-Glassmorphism UI** - Futuristic design with smooth animations
- **Mobile-First Responsive** - Works on all devices
- **Production-Ready** - Proper authentication, validation, and error handling

## 🛠️ Tech Stack

### Frontend
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + Framer Motion
- React Query for data fetching

### Backend
- FastAPI + SQLModel + Python 3.11+
- Neon PostgreSQL (cloud database)
- Alembic migrations
- JWT authentication

### Services
- ImageKit - Image hosting and optimization
- WhatsApp - Client communication
- Vercel - Frontend deployment
- Railway - Backend deployment

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone Repository

```bash
git clone <repository-url> portfolio-rafay
cd portfolio-rafay
```

### 2. Setup Credentials

Run the interactive setup script:

```bash
cd backend
python scripts/setup_credentials.py
```

This will prompt you for:
- Neon PostgreSQL connection string
- ImageKit API keys
- WhatsApp number
- Admin credentials
- JWT secret

### 3. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at: http://localhost:8000/docs

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend available at: http://localhost:3000

## 📁 Project Structure

```
portfolio-rafay/
├── backend/
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── models/        # SQLModel definitions
│   │   ├── utils/         # Utilities (security, etc.)
│   │   ├── config.py      # Configuration
│   │   ├── database.py    # Database setup
│   │   └── main.py        # FastAPI app
│   ├── scripts/
│   │   └── setup_credentials.py
│   ├── alembic/           # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   ├── styles/        # CSS files
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## 🔐 Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required variables.

**Never commit `.env` files to version control!**

## 📝 API Endpoints

### Public Endpoints

- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/featured` - Get featured projects
- `GET /api/v1/projects/{slug}` - Get project by slug
- `GET /api/v1/services` - Get all services
- `POST /api/v1/contact` - Submit contact form

### Admin Endpoints (Require Authentication)

- `POST /api/v1/admin/login` - Admin login
- `GET /api/v1/admin/projects` - Get all projects
- `POST /api/v1/admin/projects` - Create project
- `PUT /api/v1/admin/projects/{id}` - Update project
- `DELETE /api/v1/admin/projects/{id}` - Delete project
- Similar endpoints for services

## 🎨 Design System

### Colors
- Primary: Neon Pink (#FF00CC)
- Secondary: Neon Purple (#7B00FF)
- Base: White (#FFFFFF)

### Glassmorphism
- Background: rgba(255, 255, 255, 0.1)
- Blur: 10px
- Border: 1px solid rgba(255, 255, 255, 0.2)

### Animations
- Duration: 150-400ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- All interactions use Framer Motion

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` in Vercel dashboard.

### Backend (Railway)

```bash
cd backend
railway init
railway up
```

Set all environment variables from `.env.example`.

## 📊 Development Workflow

1. **Setup**: Run credential setup script
2. **Foundation**: Database migrations, API structure
3. **MVP**: Homepage carousel (User Story 1)
4. **Iterate**: Add features incrementally
5. **Deploy**: Test and deploy to production

See `specs/001-portfolio-launch/tasks.md` for detailed task breakdown.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# E2E tests
cd frontend
npm run test:e2e
```

## 📄 License

MIT

## 👤 Author

Rafay - Full-Stack Developer

## 📞 Contact

- Portfolio: [Your Portfolio URL]
- GitHub: [Your GitHub]
- LinkedIn: [Your LinkedIn]
- WhatsApp: [Your WhatsApp Number]
