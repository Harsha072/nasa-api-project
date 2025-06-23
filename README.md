# Mars Insights Project

Mars Insights is a full-stack web application that enables users to explore Mars Rover photos, view real-time Martian weather, and interact with AI-powered Q&A features. The project consists of a modern React frontend and a robust Node.js/Express backend, integrating data from NASA APIs and OpenAI.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

Mars Insights provides a seamless experience for space enthusiasts, students, and the curious to interactively explore Mars through authentic NASA data. Users can browse rover images, check Martian weather, and ask questions about Mars missions, all powered by real APIs and AI.

---
## Screenshots

### Gallery Page
![Gallery Page](./screenshots/screenshot1.png)

### Weather Forecast
<p align="center">
  <img src="./screenshots/screenshot2.png" alt="Mars Weather Forecast" width="700"/>
  <br>
  <em>Mars Weather Forecast Page 1</em>
</p>

<!-- Add more screenshots as needed, e.g.: -->
<!-- ![Chat Page](screenshots/screenshot3.png) -->
<!-- <p align="center"><img src="screenshots/screenshot4.png" alt="Picture of the Day" width="700"/><br><em>Picture of the Day</em></p> -->

---


## Features

- **Browse Mars Rover Photos:** Filter by date, rover, and camera.
- **Mission Summaries:** View detailed rover and mission information.
- **Martian Weather:** Access daily weather data from NASA’s InSight lander.
- **AI-Powered Q&A:** Ask questions about Mars photos and get instant, intelligent answers.
- **Weather Summaries:** Receive AI-generated, easy-to-read summaries of complex Mars weather data.
- **Secure & Modern:** Rate limiting, CORS security, and production-ready deployment.

---

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

- The app is  deployed on Render.com - https://nasa-api-project-frontend.onrender.com
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
### Backend setup
#### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/)

#### Project structure
```
Backend/
  ├── index.js
  ├── index.test.js
  ├── package-lock.json 
  ├── package.json
  └── README.md
```

#### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nasa-api-project.git
   cd nasa-api-project/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env` file in the `backend` directory with the following variables:

   ```
   PORT=5000
   NASA_API_KEY=your_nasa_api_key
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
   ```

   - `NASA_API_KEY`: [Get one from NASA](https://api.nasa.gov/)
   - `OPENAI_API_KEY`: [Get one from OpenAI](https://platform.openai.com/)
   - `CORS_ORIGINS`: Comma-separated list of allowed origins (for local dev and production)

4. **Run the server:**
   ```bash
   npm run dev
   ```
   The backend will be available at [http://localhost:5000](http://localhost:5000).

---

#### Running Tests

```bash
npm test
```

---

#### API Endpoints

- `GET /`  
  Health check endpoint.

- `GET /api/mars-photos`  
  Query Mars Rover photos.  
  **Params:** `rover`, `sol`, `earth_date`, `camera`, `page`

- `GET /api/mars-manifest/:rover`  
  Get mission manifest for a rover.

- `POST /api/rover-qa`  
  Ask a question about a Mars Rover photo (requires OpenAI API key).

- `GET /api/mars-weather/:sol`  
  Get Mars weather for a specific sol.

- `GET /api/mars-weather`  
  Get all available Mars weather data.

- `POST /api/mars-weather-summary`  
  Get an AI-generated summary of Mars weather data.

- `GET /api/picture-of-the-day`  
  Get NASA Astronomy Picture of the Day.

---

#### Deployment

- The backend is deployed on Render.com - https://nasa-api-project-backend-029v.onrender.com

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact [harshaswamy789@gmail.com](mailto:harshaswamy789@gmail.com).




