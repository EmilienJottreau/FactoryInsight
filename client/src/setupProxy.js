const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
  }));

  app.use(createProxyMiddleware('/socket.io', {
    pathFilter: '/socket',
    target: 'ws://127.0.0.1:5000',
    changeOrigin: true,
    ws: true,  // Activer le proxy pour les WebSockets
  }));
};