# Sociality App

A modern social media application built with the latest Next.js 16 ecosystem, focusing on performance, user experience, and clean design.

## Data Flow & Architecture

This project follows a robust architecture designed for scalability and maintainability:

- **Frontend**: Next.js 16 (App Router) with React 19.
- **State Management**: 
  - **Server State**: React Query v5 (TanStack Query) handles caching, optimistic updates, and infinite scrolling.
  - **Client State**: Zustand for lightweight global state (Auth, UI modals).
- **Styling**: Tailwind CSS v4 with Shadcn UI for accessible, reusable components.
- **Form Handling**: React Hook Form validated with Zod.

## Key Features

- **Authentication**: Secure Login and Registration flow with JWT handling.
- **Dynamic Feed**: Infinite scrolling timeline with optimistic updates for likes and saves.
- **Explore**: Discover new posts and users.
- **Rich Post Creation**: 
  - Drag-and-drop image uploads.
  - Image preview and editing.
- **Social Interactions**:
  - Like, Comment, and Save posts.
  - Follow/Unfollow users.
  - View detailed lists of Likes, Followers, and Following.
- **User Profiles**: 
  - Detailed profile pages.
  - Tabbed views for User Posts and Liked Posts.
  - Edit Profile functionality (avatar, bio).
- **Responsive Design**: Fully optimized for Desktop and Mobile interactions.
- **Search**: Real-time user search functionality.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Date Handling**: [Day.js](https://day.js.org/)

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sociality-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://basic-social-media-api-app.vercel.app # Example API URL
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components (Shadcn + Custom)
│   ├── auth/         # Authentication forms and guards
│   ├── posts/        # Post-related components (Card, Grid, Modals)
│   ├── users/        # User-related components (Avatar, Profile Header)
│   └── ui/           # Base Shadcn UI components
├── hooks/            # Custom React hooks (Data fetching, logic)
├── lib/              # Utilities (API, Utils, Query helpers)
├── services/         # API service layer
├── stores/           # Zustand state stores
└── types/            # TypeScript type definitions
```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to catch code quality issues.
