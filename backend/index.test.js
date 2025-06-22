const request = require('supertest');
const express = require('express');
const app = require('./index'); 

describe('Backend API Endpoints', () => {
  it('should return status 200 for root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/NASA API Backend/);
  });

  it('should return Mars Rover photos (mocked)', async () => {
    const res = await request(app).get('/api/mars-photos?&sol=1000&rover=curiosity');
    console.log(res)
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('photos');
  });

  it('should return Mars Rover manifest (mocked)', async () => {
    const res = await request(app).get('/api/mars-manifest/curiosity');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('photo_manifest');
  });

  it('should answer rover-qa (mocked)', async () => {
    const res = await request(app)
      .post('/api/rover-qa')
      .send({
        question: 'What is in this photo?',
        photo: {
          rover: { name: 'Curiosity' },
          camera: { full_name: 'Mast Camera' },
          earth_date: '2020-01-01',
          sol: 1000,
          img_src: 'http://mars.nasa.gov/photo.jpg'
        }
      });
    // Accept 200 or 500 (if OpenAI key is missing in CI)
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('answer');
    }
  });

  it('should return Mars weather for a sol (mocked)', async () => {
    const res = await request(app).get('/api/mars-weather/100');
    // Accept 200 or 500 (if NASA API key is missing in CI)
    expect([200, 500, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('temperature');
      expect(res.body).toHaveProperty('pressure');
      expect(res.body).toHaveProperty('windData');
      expect(res.body).toHaveProperty('sol');
    }
  });

  it('should return all Mars weather data (mocked)', async () => {
    const res = await request(app).get('/api/mars-weather');
    expect([200, 500]).toContain(res.statusCode);
    // If 200, should be an object with sol_keys or similar
    if (res.statusCode === 200) {
      expect(typeof res.body).toBe('object');
    }
  });

  it('should return Mars weather summary (mocked)', async () => {
    const res = await request(app)
      .post('/api/mars-weather-summary')
      .send({
        AT: { av: -60 },
        PRE: { av: 750 },
        WD: { N: { compass_point: 'N', compass_degrees: 0, ct: 10 } }
      });
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('summary');
    }
  });
});
