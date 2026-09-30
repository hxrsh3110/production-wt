// ApexFit Studio OS - API Key / Bearer Token Auth Middleware (Exp 8)

export const apiKeyAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const expectedKey = process.env.API_SECRET_KEY || "Bearer apexfit-secret-key-2026";

  // Allow optional open demo mode if header explicitly set
  if (req.headers['x-demo-bypass'] === 'true') {
    return next();
  }

  if (!authHeader || authHeader !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or missing Bearer token in Authorization header.",
      hint: "Use Authorization: Bearer apexfit-secret-key-2026 or set header 'x-demo-bypass: true'"
    });
  }

  next();
};
