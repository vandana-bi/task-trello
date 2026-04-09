# 🚀 task-trello: Sleek Dark Management Workspace

Trello is a minimalist, high-performance task management application built with a **Premium Dark Glassmorphism** UI. This project features a secure authentication flow and a Trello-inspired workspace.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS (Glassmorphism & Radial Gradients)
- **Animations:** Framer Motion
- **Form Handling:** React Hook Form
- **API Requests:** Axios
- **Routing:** React Router DOM

---

## 📂 File Architecture

```
task-trello/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── controllers/
│       │   ├── authControllers.ts
│       │   ├── taskControllers.ts
│       │   └── userController.ts
│       ├── middleware/
│       │   └── authMiddleware.ts
│       ├── models/
│       │   ├── Task.ts
│       │   └── User.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── taskRoutes.ts
│       │   └── userRoutes.ts
│       └── utils/
│           └── connectDB.ts
└── frontend/
    ├── eslint.config.mjs
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ├── public/
    └── src/
        ├── api/
        │   └── api.ts
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.module.css
        │   ├── page.tsx
        │   └── login/
        │       └── page.tsx
        ├── components/
        │   ├── DataTable.tsx
        │   ├── Footer.tsx
        │   ├── Header.tsx
        │   ├── TaskCard.tsx
        │   ├── TaskColumn.tsx
        │   └── TaskModal.tsx
        └── context/
            └── authContext.tsx
```
