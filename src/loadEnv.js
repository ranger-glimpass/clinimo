const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('Environment variables loaded:', process.env.REACT_APP_OPENAI_API_KEY); // Add this line to confirm loading
