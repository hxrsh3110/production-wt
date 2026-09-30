// ApexFit Studio OS - Structured Request Logging Middleware (Exp 8 Enhanced)

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Intercept the finish event to log status code and total execution time
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '🔀' : '✅';

    console.log(
      `[${timestamp}] ${statusEmoji} ${req.method} ${req.originalUrl} | Status: ${statusCode} | ${duration}ms`
    );
  });

  next();
};
