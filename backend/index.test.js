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
    const res = await request(app).get('/api/mars-photos?sol=1000');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('photos');
  });

  it('should return Mars Rover manifest (mocked)', async () => {
    const res = await request(app).get('/api/mars-manifest/curiosity');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('photo_manifest');
  });
});
