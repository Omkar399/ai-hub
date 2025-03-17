// Environment-specific configuration
const config = {
    development: {
        API_BASE_URL: 'http://localhost:5000'
    },
    production: {
        API_BASE_URL: 'https://ai-hub-v4s7.onrender.com'
    }
};

// Use production config by default, override with development if in development mode
const environment = process.env.NODE_ENV || 'production';
export const API_BASE_URL = config[environment].API_BASE_URL; 