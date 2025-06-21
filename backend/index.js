require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const OpenAI = require('openai').default;  // Updated import for v4.x
const app = express();
const PORT = process.env.PORT || 5000;

// Add this line to parse JSON bodies
app.use(express.json());
app.use(cors());

// Initialize OpenAI with v4.x syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
  res.send('NASA API Backend is running fine');
});

app.get('/api/mars-photos', async (req, res) => {
  const { rover, sol, earth_date, camera, page = 1 } = req.query;
  const roverName = rover;
  console.log(roverName);
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  console.log('NASA_API_KEY:', apiKey);
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

app.post('/api/rover-qa', async (req, res) => {
  const { question, photo } = req.body;
  if (!question || !photo) {
    return res.status(400).json({ error: 'Missing question or photo details' });
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
    console.error('OpenAI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get answer from OpenAI' });
  }
});

app.get('/api/mars-weather/:sol', async (req, res) => {
  try {
    const { sol } = req.params;
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await axios.get(
      `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`
    );
    const allData = response.data;
    console.log("all data" ,allData)
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

app.post('/api/mars-weather-summary', async (req, res) => {
  const weatherData = req.body;
  if (!weatherData) {
    return res.status(400).json({ error: 'Missing weather data' });
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
    console.error('OpenAI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate summary from OpenAI' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
module.exports = app;

