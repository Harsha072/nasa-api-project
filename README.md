# Mars Insights Project

Mars Insights is a full-stack web application that enables users to explore Mars Rover photos, view real-time Martian weather, and interact with AI-powered Q&A features. The project consists of a modern React frontend and a robust Node.js/Express backend, integrating data from NASA APIs and OpenAI.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

Mars Insights provides a seamless experience for space enthusiasts, students, and the curious to interactively explore Mars through authentic NASA data. Users can browse rover images, check Martian weather, and ask questions about Mars missions, all powered by real APIs and AI.

---

## Screenshots

<!-- Add your screenshots below. Example: -->
<p align="center">
  <img src="screenshots/homepage.png" alt="Mars Insights Home" width="700"/>
  <br>
  <em>Home Page</em>
</p>

<p align="center">
  <img src="screenshots/gallery.png" alt="Mars Rover Gallery" width="700"/>
  <br>
  <em>Mars Rover Gallery</em>
</p>

<!-- Add more screenshots as needed -->

---

## Features

- **Browse Mars Rover Photos:** Filter by date, rover, and camera.
- **Mission Summaries:** View detailed rover and mission information.
- **Martian Weather:** Access daily weather data from NASA’s InSight lander.
- **AI-Powered Q&A:** Ask questions about Mars photos and get instant, intelligent answers.
- **Weather Summaries:** Receive AI-generated, easy-to-read summaries of complex Mars weather data.
- **Secure & Modern:** Rate limiting, CORS security, and production-ready deployment.

---

## Architecture
- nasa-api-project/ 
  ├── backend/ # Node.js/Express API server 
  └── frontend/ # React SPA (Create React App)

## Getting started
### Frontend setup
#### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

#### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nasa-api-project.git
   cd nasa-api-project/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env` file in the `frontend` directory if you need to override defaults.  
   By default, the frontend expects the backend to run at `http://localhost:5000` in development.

   Example `.env`:
   ```
   REACT_APP_ENV=development
   ```

   > **Note:** For production, the backend URL is set in `src/config/config.js`.

4. **Run the development server:**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

#### Build for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `build/` directory.

---

#### Deployment

- The app is ready to be deployed to any static hosting provider (e.g., Render, Netlify, Vercel).
- For SPA routing on Render, ensure you have a `render.yaml` file with the correct rewrite rules.
- No `_redirects` file is needed if using `render.yaml`.

---

#### Project Structure

```
frontend/
  ├── public/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── config/
  │   ├── App.js
  │   └── ...
  ├── package.json
  └── README.md
```

---

#### API Integration

- The frontend expects the backend API to be running and accessible at the URL specified in `src/config/config.js`.
- All API requests are proxied to the backend for data retrieval and AI-powered features.

---


