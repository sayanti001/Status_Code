// middleware/auth.js - Simplified version
const jwt = require('jsonwebtoken');
const axios = require('axios');
let jwksCache = null;
let jwksCacheTime = 0;

// Function to fetch JWKS from Auth0
const fetchJwks = async () => {
  const currentTime = Date.now();
  if (jwksCache && (currentTime - jwksCacheTime < 3600000)) {
    return jwksCache;
  }
  
  console.log('Fetching JWKS from Auth0');
  try {
    const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`);
    jwksCache = response.data;
    jwksCacheTime = currentTime;
    return jwksCache;
  } catch (error) {
    console.error('Error fetching JWKS:', error.message);
    throw new Error(`Failed to fetch JWKS: ${error.message}`);
  }
};

// Function to find the right key from JWKS
const getKey = async (kid) => {
  const jwks = await fetchJwks();
  const key = jwks.keys.find(k => k.kid === kid);
  
  if (!key) {
    throw new Error(`Unable to find key with ID: ${kid}`);
  }
  
  // We need a library to convert JWK to PEM for proper verification
  // For simplicity, we'll use a different approach here
  const pemKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
  
  return {
    key: pemKey,
    kid: kid
  };
};

// Middleware function
const authenticate = async (req, res, next) => {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Decode token without verification to get the header
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    // Get the key ID from the token header
    const kid = decoded.header.kid;
    if (!kid) {
      return res.status(401).json({ error: 'No key ID in token' });
    }
    
    // Directly verify with jsonwebtoken but use the key info
    try {
      console.log('Getting key for verification');
      const keyInfo = await getKey(kid);
      
      // Log that we're attempting verification
      console.log('Verifying token with key:', kid);
      
      // Use a more direct approach for debugging
      const tokenOptions = {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`
      };
      
      console.log('Token verification options:', tokenOptions);
      
      // Use built-in JWT verification with the raw token
      const payload = jwt.verify(token, keyInfo.key, tokenOptions);
      
      // If we get here, token is valid
      req.auth = payload;
      console.log('Token verified successfully');
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ 
        error: 'Invalid token', 
        message: err.message 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error', 
      message: error.message 
    });
  }
};

module.exports = { authenticate };