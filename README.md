# React Router Todo App

[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, full-stack todo application showcasing React Router v7 (formerly Remix) capabilities including server-side rendering, data loaders, server actions, and API routes.

## 🎯 Overview

This project demonstrates production-ready patterns for building full-stack React applications using React Router's Framework mode. It features a clean architecture with server-side SQLite persistence, optimistic UI updates, and RESTful API endpoints.

**Key Features:**
- 🚀 Server-side rendering (SSR) for optimal performance
- 🗄️ SQLite database with repository pattern
- 🎨 Simple UI with Tailwind CSS and Lucide icons
- 🛣️ Path-based routing for shareable URLs (`/todos/:id`)
- 📱 Responsive design with modal-based editing
- 🎭 Loading states and error handling
- 🧪 Type-safe with TypeScript throughout

## 📚 Background

Originally built with Remix while working at Fixify, this project was migrated to React Router v7 following the framework's evolution. The migration preserves core concepts while adopting React Router's multi-strategy approach.

For migration details, see: [Upgrading from Remix](https://reactrouter.com/upgrading/remix)

## 🏗️ Architecture

This application uses React Router's **Framework mode**, which provides the full spectrum of features including server-side rendering, data loaders, and server actions.

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + React Router v7 | UI components and routing |
| **Styling** | Tailwind CSS 4 | Utility-first styling |
| **Icons** | Lucide React | Consistent icon system |
| **Tooltips** | Radix UI | Accessible UI primitives |
| **Backend** | React Router (SSR) | Server-side rendering & API |
| **Database** | SQLite + better-sqlite3 | Persistent storage |
| **Language** | TypeScript 5.6 | Type safety |
| **Build** | Vite | Fast bundling and HMR |

### Project Structure

```
app/
├── components/         # React components
│   ├── shared/         # Reusable UI components (Badge, etc.)
│   ├── TodoList.tsx    # Main todo list with state management
│   ├── TodoItem.tsx    # Individual todo item
│   └── EditTodoModal.tsx # Edit modal with native <dialog>
├── db/                 # Database layer
│   ├── index.ts        # SQLite connection
│   └── todos.repository.ts # Data access layer
├── routes/             # Route handlers
│   ├── home.tsx        # Main page with loader
│   └── api/todos/      # REST API endpoints
│       ├── index.tsx   # GET /api/todos, POST /api/todos
│       └── $id.tsx     # GET/PATCH/DELETE /api/todos/:id
├── services/           # Business logic
│   └── todos.api.ts    # Client-side API service
├── types/              # TypeScript definitions
│   └── todo.ts         # Todo type definitions
└── routes.ts           # Route configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/incubusknight/remix-todo-app.git
   cd remix-todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |

### Database

The application uses SQLite with data stored in `./data/todos.db`. The database is automatically created on first run with the following schema:

```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL
);
```

## 🎓 React Router Features Explored

This project showcases several advanced React Router capabilities:

### 1. Server Side Rendering Strategy

React Router supports Server-Side Rendering (SSR), allowing you to pre-render your React application on the server and send the initial HTML to the client. This offers advantages like improved initial page load performance and better SEO, as search engine crawlers can more easily index the content.

This is configured in the `react-router.config.ts`:

```typescript
export default {
  ssr: true, // Enable server-side rendering
} satisfies Config;
```
### 2. Framework Routing

Routes are explicitly defined in `app/routes.ts` using a combination of adhox route definitions and helper functions:

```typescript
export default [
  // Helpers
  route('/:id?', 'routes/home.tsx'),
  ...prefix('api/todos', [
    index('routes/api/todos/index.tsx'),
    route(':id', 'routes/api/todos/$id.tsx'),
  ]),
  // ADHOC
  {
    path: '/.well-known/*',
    file: 'routes/well-known.tsx',
  },
] satisfies RouteConfig;
```

> Refer to the file for more context on routing definitions.

### 3. Server Data Loading

Data is fetched server-side via `loader` functions before rendering. Example from `app/routes/home.tsx`:

```typescript
export async function loader() {
  return { todos: TodosRepository.getAll() };
}
```

### 4. Server Actions

Mutations are handled server-side via `action` functions. Example from `app/routes/api/todos/index.tsx`:

```typescript
export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method === "POST") {
    const body = await request.json();
    const todo = TodosRepository.create({
      id: Date.now().toString(),
      title: body.title,
      createdAt: Date.now(),
    });
    return Response.json(todo, { status: 201 });
  }
  return new Response(null, { status: 405 });
};
```

### 5. Router-Based API

React Router routes can serve as REST API endpoints by omitting the default component export.

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos` | List all todos |
| `POST` | `/api/todos` | Create a new todo |
| `GET` | `/api/todos/:id` | Get a specific todo |
| `PATCH` | `/api/todos/:id` | Update a todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |

#### Example Requests

**Create a todo:**
```bash
curl -X POST http://localhost:5173/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn React Router"}'
```

**Update a todo:**
```bash
curl -X PATCH http://localhost:5173/api/todos/123 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

## 🛠️ Development Notes

### Best Practices Implemented

1. **Server/Client Separation**: `.server.ts` files ensure database code never reaches the browser
2. **Type Safety**: Auto-generated route types via `+types/` modules
3. **Accessibility**: Native `<dialog>` elements with proper ARIA labels and keyboard navigation
4. **Performance**: Server-side rendering + optimistic updates for instant feedback
5. **URL State**: Edit operations reflected in URL for shareability and deep linking

## 🙏 Acknowledgments

- Project scaffolded with `npx create-react-router@latest`
- Developed with assistance from GitHub Copilot
- Inspired by React Router documentation and real-world use at Fixify
- Course reference: [Remix.js The Practical Guide](https://www.udemy.com/course/remix-course/)

## 📚 Resources

- [React Router Documentation](https://reactrouter.com)
- [Upgrading from Remix](https://reactrouter.com/upgrading/remix)
- [React Router Examples](https://github.com/remix-run/react-router/tree/main/examples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
