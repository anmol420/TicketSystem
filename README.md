# Ticketing System

A modern full-stack **Ticketing System** built using:

- ⚙️ **Backend**: [Hono](https://hono.dev/) + [Bun](https://bun.sh/) + [Inngest](https://www.inngest.com/) (Agentic AI) + [MongoDB](https://www.mongodb.com/)
- 🖥️ **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)

This project allows users to submit support tickets and agents/admins to manage and resolve them. Enhanced with **Inngest AI**, it helps automate replies, categorize tickets, and generate summaries.

---

## Project Structure

```
ticketing-system/
├── client/        # Frontend (React + Vite)
└── server/        # Backend (Hono + Bun + Inngest + MongoDB)
```

---

## Features

### Core Features
- Ticket creation, update, and deletion
- User authentication and session handling
- Role-based access control: User / Agent / Admin
- Ticket status: Open, In Progress, Resolved
- Real-time updates and management

### Inngest AI Features
- Auto-categorize new tickets
- Suggest smart replies for agents
- Summarize ticket conversations

---

## Tech Stack

| Layer     | Stack                                 |
|-----------|----------------------------------------|
| Frontend  | React, Vite, JavaScript                |
| Backend   | Hono (Bun), MongoDB                    |
| AI Layer  | Inngest Agentic Workflows              |
| Database  | MongoDB Atlas or local MongoDB         |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Inngest account](https://www.inngest.com/)

---

### 🧪 Local Development Setup

#### Clone the repository

```bash
git clone https://github.com/anmol420/TicketSystem.git
cd ticketing-system
```

#### Backend Setup (Bun + Hono)

```bash
cd server
bun install
cp .env.example .env
# Edit .env with your MongoDB and Inngest keys
bun run dev
```

#### Frontend Setup (React + Vite)

```bash
cd ../client
npm install
npm run dev
```

Then open your browser at: [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

Create a `.env` file inside the `server/` directory and follow the template in `.env.example`:

---

## API Endpoints

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/api/tickets`         | Create a new ticket          |
| GET    | `/api/tickets`         | Get all tickets              |
| GET    | `/api/tickets/:id`     | Get ticket by ID             |

> Inngest workflows are triggered on ticket events like creation and messages.