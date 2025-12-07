# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript practice project for solving frontend coding challenges (BigFrontEnd.dev style problems), implementing custom React hooks, and algorithm exercises.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier
- **Additional Libraries**: TanStack Query, SWR, Lodash

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check and build for production
npm run test     # Run tests with Vitest
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── assignments/           # Standalone coding assignments (e.g., timer)
├── bigfrontend/
│   ├── javascript/        # JS utility implementations (curry, debounce, throttle, etc.)
│   ├── react/             # Custom React hooks (useTimeout, usePrevious, useHover, etc.)
│   └── system-design/     # UI component challenges (infinite scroller)
├── components/            # Reusable React components
└── utils/                 # Algorithm problems (binary search, palindrome, etc.)
```

## Code Conventions

- Each challenge is in its own directory with implementation (`.ts`/`.tsx`) and tests (`.test.ts`/`.test.tsx`)
- Test files are co-located with their implementations
- Use TypeScript strict mode
- Follow ESLint + Prettier configuration for formatting
