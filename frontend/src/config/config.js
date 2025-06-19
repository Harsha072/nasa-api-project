const config = {
  apiUrl: process.env.REACT_APP_ENV === 'production' 
    ? 'https://your-backend-service-name.onrender.com' 
    : 'http://localhost:5000'
};

export default config;