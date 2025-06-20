import { handleAuth, handleCallback } from '@auth0/auth0-react';

export default handleAuth({
  async callback(req, res) {
    try {
      // Handle the callback and get the session with the ID token
      return await handleCallback(req, res, {
        afterCallback: (req, res, session) => {
            return session;
        }
      });
    } catch (error) {
      console.error('Authentication callback error:', error);
      res.status(error.status || 500).end(error.message);
    }
  }
});