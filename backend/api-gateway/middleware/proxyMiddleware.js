const axios = require('axios');

// Proxy request to target service
exports.proxyRequest = (serviceUrl) => {
  return async (req, res) => {
    try {
      const url = `${serviceUrl}${req.originalUrl}`;
      
      // Prepare request config
      const config = {
        method: req.method,
        url: url,
        headers: {
          ...req.headers,
          host: new URL(serviceUrl).host
        },
        data: req.body,
        params: req.query
      };

      // Remove headers that shouldn't be forwarded
      delete config.headers['host'];
      delete config.headers['content-length'];

      // Make request to target service
      const response = await axios(config);

      // Send response back to client
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Proxy error:', error.message);
      
      if (error.response) {
        // Forward the error response from the service
        res.status(error.response.status).json(error.response.data);
      } else {
        // Network or other error
        res.status(503).json({
          success: false,
          message: 'Service unavailable',
          error: error.message
        });
      }
    }
  };
};
