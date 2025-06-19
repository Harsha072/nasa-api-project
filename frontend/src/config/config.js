const config = {
  apiUrl: process.env.REACT_APP_ENV === 'production' 
    ? 'https://nasa-api-project-backend-029v.onrender.com' 
    : 'http://localhost:5000'
};

export default config;