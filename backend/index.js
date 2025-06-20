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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
module.exports = app;

