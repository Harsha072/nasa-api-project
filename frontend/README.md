# Mars Insights Frontend

Mars Insights is a modern React-based web application that allows users to explore Mars Rover photos, view real-time Martian weather, and interact with AI-powered Q&A features. The frontend is built with [Create React App](https://github.com/facebook/create-react-app) and communicates with a Node.js/Express backend.

---

## Features

- Browse Mars Rover photos by date, rover, and camera
- View mission summaries and rover details
- See daily Mars weather data from NASA’s InSight lander
- Ask questions about Mars photos and get instant, AI-powered answers
- Enjoy AI-generated, easy-to-read summaries of complex Mars weather data

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

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

## Build for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `build/` directory.

---

## Deployment

- The app is ready to be deployed to any static hosting provider (e.g., Render, Netlify, Vercel).
- For SPA routing on Render, ensure you have a `render.yaml` file with the correct rewrite rules.
- No `_redirects` file is needed if using `render.yaml`.

---

## Project Structure

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

## API Integration

- The frontend expects the backend API to be running and accessible at the URL specified in `src/config/config.js`.
- All API requests are proxied to the backend for data retrieval and AI-powered features.

---

## Troubleshooting

- If you encounter CORS issues, ensure the backend is configured to allow requests from your frontend's origin.
- For any issues with API keys or environment variables, check the backend README.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact [harshaswamy789@gmail.com](mailto:harshaswamy789@gmail.com).
