# Product Requirements Document: Media Garden App

-   **Version:** 1.0
-   **Status:** Draft
-   **Author:** T3 Chat
-   **Date:** 2025-10-11

## 1. Introduction & Vision

### 1.1. Vision

To create a simple, personal, and visually-driven application for tracking consumed media—books, movies, TV shows, and video games. The app will function as a "digital garden," where the collection is evergreen and can be browsed by topic rather than a chronological feed. The core experience is centered around a personal library with rich cover art and notes.

### 1.2. Inspiration

This project is inspired by the clean, minimalist bookshelf layout seen on [skooks.net/bookshelf](https://skooks.net/bookshelf).

![Inspiration Image](https://i.imgur.com/uR1Z3xv.jpeg)

## 2. Target Audience

This is a personal application for individuals who enjoy tracking, rating, and writing notes about the media they consume. They value aesthetics, simplicity, and ownership over their data. They are likely familiar with services like Goodreads, Letterboxd, or MyAnimeList but desire a more integrated and personal solution.

## 3. Core Features (MVP - Minimum Viable Product)

### 3.1. Media Item Management

#### User Story 1: Adding New Media
> As a user, I want to add a new item to my garden so I can track it.

**Requirements:**
-   An "Add New" button should be present on the main screen.
-   Tapping it opens a form where the user can select the media type (Book, TV Show, Movie, Video Game).
-   The user enters the title of the media.
-   Upon title entry, the system will **automatically search and fetch metadata** from a relevant public API.
-   The user will be presented with a list of potential matches, each showing the cover art, title, and creator/director/author.
-   The user selects the correct item.
-   The item is added to their garden, defaulting to a "To Consume" status.

#### User Story 2: Viewing the Garden
> As a user, I want to see all my tracked media in a clean, grid-based view so I can easily browse my collection.

**Requirements:**
-   The main screen will display all media items in a responsive grid.
-   Each item in the grid must display:
    -   Its cover image.
    -   Title.
    -   Creator (Author, Director, etc.).
    -   (Optional for MVP) A badge indicating its completion status (e.g., "Finished 2025").

#### User Story 3: Viewing Item Details
> As a user, I want to click on an item to see a detailed view where I can add my personal notes.

**Requirements:**
-   Clicking on an item in the grid navigates to a dedicated detail page.
-   This page will display:
    -   A larger version of the cover art.
    -   Title, creator, and a brief synopsis (fetched from API).
    -   A multi-line text field for personal notes and reviews (the "longer take").
    -   The current status of the item.
    -   The date of completion (if applicable).

### 3.2. Status and Filtering

#### User Story 4: Updating Status
> As a user, I want to change the status of my media (e.g., from "Want to Read" to "Reading") to reflect my progress.

**Requirements:**
-   On the item detail page, the user can change the item's status.
-   The statuses will be:
    -   **Backlog** (Want to Read / Watch / Play)
    -   **In-Progress** (Reading / Watching / Playing)
    -   **Completed** (Finished)
-   When an item is moved to "Completed", the system should automatically set the completion date to the current date, which the user can then edit.

#### User Story 5: Filtering the Garden
> As a user, I want to filter my garden by status and media type so I can easily find what I'm looking for.

**Requirements:**
-   The main garden view will have filter controls, similar to the "WANT TO READ | READING | READ" tabs in the inspiration image.
-   Users can filter by **Status** (Backlog, In-Progress, Completed).
-   Users can filter by **Media Type** (Book, TV Show, Movie, Video Game).
-   Filters should be combinable (e.g., show all "Completed" "Video Games").

## 4. Non-Functional Requirements

### 4.1. Data Fetching & APIs

-   The application **must** integrate with public APIs to fetch media metadata and cover art. This is crucial for a good user experience.
-   **Suggested APIs:**
    -   **Movies & TV Shows:** [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api)
    -   **Books:** [Google Books API](https://developers.google.com/books) or [Open Library API](https://openlibrary.org/developers/api)
    -   **Video Games:** [IGDB API](https://api-docs.igdb.com/) or [RAWG API](https://rawg.io/apidocs)

### 4.2. Design and User Interface

-   The UI should be clean, minimalist, and heavily inspired by the provided image.
-   The design must be responsive, ensuring usability on both desktop and mobile devices.
-   Focus on typography and whitespace to create a pleasant reading experience.

### 4.3. Technology Stack (Suggestion)

-   **Frontend:** A modern JavaScript framework like React, Vue, or Svelte.
-   **Backend:** A simple backend (e.g., Node.js with Express, Python with Flask) to handle API key security and database interactions.
-   **Database:** A simple database like SQLite, PostgreSQL, or a BaaS (Backend-as-a-Service) like Supabase/Firebase to persist user data.

## 5. Future Enhancements (Out of Scope for V1)

-   User accounts and authentication.
-   Custom tagging system.
-   A "Stats" page showing trends (e.g., books read per year).
-   Ability to share the garden with a public URL.
-   Advanced search and sorting functionality.
-   Adding custom entries for media not found in APIs.