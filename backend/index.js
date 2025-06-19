require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: 'http://localhost:3000'
// }));

app.use(cors());
app.get('/', (req, res) => {
  res.send('NASA API Backend is running fine');
});

app.get('/api/mars-photos', async (req, res) => {
  const { rover, sol, earth_date, camera, page = 1 } = req.query;
  const roverName = rover ;
  console.log(roverName)
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  console.log('NASA_API_KEY:', apiKey)
  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?api_key=KBJIMteUqfi4kg1ZvJa0xYGbefrVg0KxhN8aSgkN
&page=${page}`;
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
module.exports = app;
module.exports = app;
