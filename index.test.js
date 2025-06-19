```javascript
it('should return Mars Rover photos with all query params (mocked)', async () => {
  const mockPhotos = {
    photos: [
      {
        id: 1,
        sol: 1000,
        camera: { name: 'MAST' },
        img_src: 'http://mars.jpl.nasa.gov/msl-raw-images/image2.jpg',
        earth_date: '2015-06-01',
        rover: { name: 'curiosity' }
      }
    ]
  };
  axios.get.mockResolvedValue({ data: mockPhotos });

  const res = await request(app)
    .get('/api/mars-photos')
    .query({
      rover: 'curiosity',
      sol: 1000,
      camera: 'MAST',
      earth_date: '2015-06-01',
      page: 2
    });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('photos');
  expect(res.body.photos[0].camera.name).toBe('MAST');
  expect(res.body.photos[0].earth_date).toBe('2015-06-01');
});
```