const proxyHandler = (req, res, next) => {
  const proxyAuthHeader = req.headers['x-proxy-auth'];
  const apiKey = req.headers['x-api-key'];
  const requestIP = req.ip || req.connection.remoteAddress;

  if (
    proxyAuthHeader !== 'my-proxy-key'
    // apiKey !== validApiKey ||
    // requestIP !== allowedProxyIP
    // process.env.NODE_ENV == 'production'
  ) {
    return res.status(403).send('Forbidden: Access is denied.');
  }

  next();
};

export { proxyHandler };
