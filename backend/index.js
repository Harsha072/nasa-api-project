const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('NASA API Backend is running');
});

app.get('/api/mars-photos', async (req, res) => {
  const { rover = 'curiosity', sol, earth_date, camera, page = 1 } = req.query;
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${apiKey}&page=${page}`;
  if (sol) url += `&sol=${sol}`;
  if (earth_date) url += `&earth_date=${earth_date}`;
  if (camera) url += `&camera=${camera}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Mars Rover photos' });
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
module.exports = app;
