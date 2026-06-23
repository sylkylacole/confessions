# confessions
We all have secrets, but we don't want everyone to know them :3

## Setup Instructions

1. Install dependencies in the server folder:
   ```bash
   cd server
   npm install
   ```
2. Create a MySQL database and user, or use your existing local MySQL server.
3. Create a `.env` file in `server/` with:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=confessions_db
   PORT=3000
   ```
4. Start the Node server:
   ```bash
   npm start
   ```
5. Open `public/index.html` in your browser or visit `http://localhost:3000` if you serve from the server.

## How It Works

- `server/index.js` runs Express and exposes:
  - `POST /api/confessions` for uploading a confession and optional image
  - `GET /api/confessions` for loading recent confessions
- `public/index.html` contains the submission form.
- `public/browse.html` loads confessions dynamically from the backend.
- Uploaded images are stored in `server/uploads` and served from `/uploads`.
