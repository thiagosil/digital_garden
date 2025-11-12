# Echo

A private digital garden for tracking books, movies, TV shows, and video games. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Authentication**: Simple email/password login for single-user private digital garden
- **Add Media**: Search and add books, movies, TV shows, and video games to your collection
- **Automatic Metadata**: Fetches cover art, synopsis, and creator info from public APIs
- **Status Tracking**: Organize media by Backlog, In Progress, or Completed
- **Personal Notes**: Write reviews and notes for each item
- **Filtering**: Filter your collection by status and media type
- **Clean Design**: Minimalist bookshelf-inspired layout

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: Turso/SQLite with @libsql/client
- **APIs**:
  - Google Books API (Books)
  - TMDB API (Movies & TV Shows)
  - RAWG API (Video Games)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- [Turso CLI](https://docs.turso.tech/cli/installation) (for local development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd digital_garden
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# For local development
DATABASE_URL="http://127.0.0.1:8080"

# Authentication (required)
JWT_SECRET="your-secret-key-change-this-in-production"
# Generate a secure secret: openssl rand -base64 32

# API Keys (optional but recommended)
TMDB_ACCESS_TOKEN="your_tmdb_access_token"
RAWG_API_KEY="your_rawg_api_key"
# Google Books API doesn't require a key for basic usage
```

To get API keys:
- TMDB: https://www.themoviedb.org/settings/api (use the Read Access Token)
- RAWG: https://rawg.io/apidocs

4. Start the local Turso database server:
```bash
turso dev
```

This starts a local SQLite database server at `http://127.0.0.1:8080`.
Leave this running in a separate terminal.

5. Create your admin user:
```bash
pnpm run create-user
```

You'll be prompted to enter your email and password. This is the account you'll use to log in.

6. Run the development server (in a new terminal):
```bash
pnpm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

You'll be redirected to the login page. Use the credentials you created in step 5.

## Deployment

### Deploy to Vercel

For detailed instructions on deploying to Vercel with Turso database, see [VERCEL_SETUP.md](./VERCEL_SETUP.md).

Quick steps:
1. Create a Turso database
2. Deploy to Vercel and add environment variables:
   - `DATABASE_URL` (your Turso database URL)
   - `TURSO_AUTH_TOKEN` (your Turso auth token)
   - `JWT_SECRET` (generate with: `openssl rand -base64 32`)
3. The database schema will be automatically initialized on first deployment
4. **Create your admin account**: Visit `https://your-app.vercel.app/setup` to create your first user
   - This page is only accessible when no users exist in the database
   - After creating your account, you'll be redirected to the login page

## Usage

### Adding Media

1. Click the "Add Media" button
2. Select the media type (Book, Movie, TV Show, or Video Game)
3. Search for the title
4. Click "Add" on the item you want to add to your collection

### Managing Items

1. Click on any media card to view details
2. Update the status (Backlog, In Progress, Completed)
3. Write personal notes and reviews
4. Save your changes

### Filtering

Use the filter buttons at the top of the page to:
- Filter by status (Backlog, In Progress, Completed)
- Filter by media type (Books, Movies, TV Shows, Video Games)
- Combine filters to narrow down your collection

## Database Schema

The app uses two main models:

### User Model
- `id`: Unique identifier
- `email`: User's email (unique)
- `password`: Hashed password
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### MediaItem Model
- `id`: Unique identifier
- `title`: Title of the media
- `mediaType`: BOOK, MOVIE, TV_SHOW, or VIDEO_GAME
- `status`: BACKLOG, IN_PROGRESS, or COMPLETED
- `coverImage`: URL to cover art
- `creator`: Author, director, or developer
- `synopsis`: Description from the API
- `notes`: User's personal notes
- `completedAt`: Date when marked as completed
- `apiId`: Original ID from the external API

## Project Structure

```
digital_garden/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   │   ├── login/      # Login route
│   │   │   ├── logout/     # Logout route
│   │   │   ├── me/         # Current user session
│   │   │   └── setup/      # One-time setup for first user
│   │   ├── media/          # CRUD operations for media items
│   │   └── search/         # Search across different APIs
│   ├── login/              # Login page
│   ├── setup/              # One-time setup page (production)
│   ├── media/[id]/         # Detail view for individual items
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with grid view
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── add-media-dialog.tsx
│   ├── filter-bar.tsx
│   ├── media-card.tsx
│   ├── media-grid.tsx
│   └── navigation-header.tsx
├── lib/
│   ├── auth.ts             # Authentication utilities
│   ├── db.ts               # Database client and queries
│   └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema reference
├── scripts/
│   └── create-user.ts      # Script to create admin user
├── middleware.ts           # Auth middleware to protect routes
└── README.md
```

## Authentication

This digital garden is designed for **single-user private use**. All routes are protected by authentication middleware.

### Creating Your Account

**For local development:**
```bash
pnpm run create-user
```

**For production (Vercel, etc.):**
Visit `/setup` on your deployed app (e.g., `https://your-app.vercel.app/setup`)
- This page is only accessible when no users exist in the database
- Once you create your first user, the setup page will automatically redirect to login
- Perfect for initial deployment setup

### Security Features
- Passwords are hashed using bcryptjs
- Sessions are managed with JWT tokens stored in httpOnly cookies
- Tokens expire after 7 days
- All routes except `/login` and `/setup` require authentication
- Setup page automatically disabled after first user is created

### Creating Additional Users

To create additional users locally:
```bash
pnpm run create-user
```

Note: This app is designed for single-user use, but you can create multiple accounts if needed.

## Future Enhancements

See PRD.md for planned features including:
- Custom tagging system
- Stats and analytics
- Public sharing
- Advanced search and sorting
- Custom entries for media not in APIs

## License

ISC
