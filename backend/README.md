# Mars Insights Backend

This is the backend service for the Mars Insights project. It provides RESTful APIs for Mars Rover photos, mission manifests, Martian weather data, and AI-powered Q&A using OpenAI. Built with Node.js and Express.

---

## Features

- Fetch Mars Rover photos and mission data from NASA APIs
- Retrieve and summarize Mars weather data from NASA InSight
- AI-powered Q&A for Mars Rover photos (OpenAI GPT integration)
- Rate limiting and CORS security
- Ready for deployment on Render or any Node.js hosting

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/)

### Installation

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

## Running Tests

```bash
npm test
```

---

## API Endpoints

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

## Deployment

- The backend is ready for deployment on Render or any Node.js-compatible host.
- Ensure all environment variables are set in your deployment environment.

---

## Security

- Rate limiting is enabled to prevent abuse.
- CORS is restricted to allowed origins.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact [harshaswamy789@gmail.com](mailto:harshaswamy789@gmail.com).
