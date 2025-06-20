const { auth } = require('express-oauth2-jwt-bearer');

// Auth0 middleware for validating tokens
const validateAuth0Token = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,  // Make sure this ends with a slash
    jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`  // Path to JWKS
});

module.exports = { validateAuth0Token };