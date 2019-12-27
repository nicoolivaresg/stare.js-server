module.exports = {
  backend_port: process.env.BACKEND_PORT || 3000,
  // Google API
  googleApiKey: process.env.GOOGLE_API_KEY || 'Your Google API Key',
  googleApiCx: process.env.GOOGLE_API_CX || 'Your Google Cx Key',
  // Bing API
  bingServiceKey: process.env.BING_SERVICE_KEY || 'Your Bing Service Key'
};