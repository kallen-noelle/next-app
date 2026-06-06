# Next.js App

A modern web application built with Next.js 16.

## Demo

### Main Interface
![Main Interface](./public/8.png)

### Homework Details
![Homework Details](./public/7.png)

### Question Tooltip
![Question Tooltip](./public/7.png)

### Upload Interface
![Upload Interface](./public/6.png)

### Knowledge Base
![Knowledge Base](./public/1.png)

### Login Interface
![Login Interface](./public/4.png)
### Signup Interface
![Signup Interface](./public/5.png)
### Settings Interface
![Settings Interface](./public/2.png)

## Tech Stack

- **Framework**: Next.js 16.1.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Component Library**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Form Validation**: Zod
- **Tables**: TanStack React Table
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Notifications**: Sonner
- **HTTP Client**: Axios

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm dev
```

Start the development server and visit <http://localhost:3000>

### Build Production Version

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Code Quality Checks

```bash
# Code formatting
pnpm format

# ESLint check
pnpm lint

# TypeScript type checking
pnpm typecheck
```

## Project Structure

```
├── app/                 # App Router pages
│   ├── dashboard/       # Dashboard page
│   ├── knowledge/       # Knowledge base page
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── upload/          # File upload page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and API clients
├── settings/            # Settings pages
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## Features

- 🎨 **Modern UI**: Beautiful and responsive interface built with shadcn/ui and Tailwind CSS
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- 🔐 **Authentication**: Secure user authentication system
- 📊 **Dashboard**: Comprehensive dashboard with data visualization
- 📁 **File Management**: Upload and manage files easily
- 🎯 **Homework Grading**: Intelligent homework grading system
- 🔧 **Customizable**: Highly customizable settings and preferences
- ⚡ **Fast Performance**: Optimized for speed with Next.js and React

## License

MIT