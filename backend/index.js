require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai').default;  
const app = express();
const PORT = process.env.PORT || 5000;

// --- Security: Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// --- Security: Restrict CORS ---
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

// Initialize OpenAI with v4.x syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Never send NASA or OpenAI API keys to the client/browser ---

// Root endpoint: Simple health check
// GET /
// Response: Plain text message indicating backend is running
app.get('/', (req, res) => {
  res.send('NASA API Backend is running fine');
});

// Get Mars Rover photos from NASA API
// GET /api/mars-photos?rover={rover}&sol={sol}&earth_date={earth_date}&camera={camera}&page={page}
// Receives: Query params for rover, sol, earth_date, camera, page
// Sends: JSON with photos array from NASA API
app.get('/api/mars-photos', async (req, res) => {
  const { rover, sol, earth_date, camera, page = 1 } = req.query;
  const roverName = rover;
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?api_key=${apiKey}&page=${page}`;
  if (sol) url += `&sol=${sol}`;
  if (earth_date) url += `&earth_date=${earth_date}`;
  if (camera) url += `&camera=${camera}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Mars Rover photos check logs' });
  }
});

// Get Mars Rover manifest (mission summary) from NASA API
// GET /api/mars-manifest/:rover
// Receives: URL param 'rover' (e.g., curiosity, opportunity, spirit)
// Sends: JSON manifest data for the specified rover
app.get('/api/mars-manifest/:rover', async (req, res) => {
  const { rover } = req.params;
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Mars Rover manifest' });
  }
});

// Ask a question about a Mars Rover photo using OpenAI
// POST /api/rover-qa
// Receives: JSON body { question: string, photo: object }
// Sends: JSON { answer: string, generatedText: string } (OpenAI's answer)
app.post('/api/rover-qa', async (req, res) => {
  const { question, photo } = req.body;
  // --- Security: Input Validation ---
  if (
    typeof question !== 'string' ||
    !question.trim() ||
    typeof photo !== 'object' ||
    !photo ||
    typeof photo.img_src !== 'string' ||
    !photo.img_src.startsWith('http')
  ) {
    return res.status(400).json({ error: 'Invalid question or photo details' });
  }

  // Compose a prompt for OpenAI
  const prompt = `
You are a Mars Rover expert. Here are the details of a Mars Rover photo:
Rover: ${photo.rover?.name}
Camera: ${photo.camera?.full_name}
Earth Date: ${photo.earth_date}
Sol: ${photo.sol}
Image URL: ${photo.img_src}

User question: ${question}

Answer in a concise and informative way.
`;

  try {
    const completion = await openai.chat.completions.create({  // Updated method for v4.x
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful Mars Rover expert." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    });

    const answer = completion.choices[0].message.content.trim();  // Updated response structure
    res.json({ answer, generatedText: answer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get answer from OpenAI' });
  }
});

// Get Mars weather for a specific sol (Martian day)
// GET /api/mars-weather/:sol
// Receives: URL param 'sol' (Martian day number)
// Sends: JSON with temperature, pressure, windData, and sol
app.get('/api/mars-weather/:sol', async (req, res) => {
  try {
    const { sol } = req.params;
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await axios.get(
      `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`
    );
    const allData = response.data;
    const weather = allData[sol];
    if (!weather) return res.status(404).json({ error: 'Sol not found' });
    // WD is an object with keys for directions and 'most_common', filter out 'most_common'
    const windData = Object.entries(weather.WD || {})
      .filter(([key, wd]) => key !== 'most_common' && typeof wd === 'object' && wd.ct)
      .map(([key, wd]) => ({
        direction: wd.compass_point,
        degrees: wd.compass_degrees,
        count: wd.ct
      }));
    res.json({
      temperature: weather.AT?.av,
      pressure: weather.PRE?.av,
      windData,
      sol
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

// Get all available Mars weather data from NASA InSight API
// GET /api/mars-weather
// Receives: No parameters
// Sends: JSON with all weather data from NASA InSight API
app.get('/api/mars-weather', async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await axios.get(
      `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all Mars weather data' });
  }
});

// Generate a summary of Mars weather data using OpenAI
// POST /api/mars-weather-summary
// Receives: JSON body with Mars weather data for a single sol
// Sends: JSON { summary: string } (OpenAI's summary)
app.post('/api/mars-weather-summary', async (req, res) => {
  const weatherData = req.body;
  // --- Security: Input Validation ---
  if (!weatherData || typeof weatherData !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid weather data' });
  }
  const prompt = `You are a Mars weather scientist. Given the following Mars weather data for a single Sol, provide a concise, clear summary for a general audience. Highlight temperature, pressure, wind patterns, and any notable features.\n\nMars Weather Data (JSON):\n${JSON.stringify(weatherData, null, 2)}\n\nSummary:`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful Mars weather scientist with 20 years of experience." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    });
    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary from OpenAI' });
  }
});

// Get NASA Astronomy Picture of the Day (APOD)
// GET /api/picture-of-the-day
// Sends: JSON with APOD data from NASA API
app.get('/api/picture-of-the-day', async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NASA Picture of the Day' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

