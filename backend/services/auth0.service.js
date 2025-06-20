const { ManagementClient } = require('auth0');

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  scope: 'read:users update:users'
});

// Function to get user profile from Auth0
async function getUserProfile(userId) {
  try {
    const user = await auth0.getUser({ id: userId });
    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Unable to fetch user profile');
  }
}

// Function to check if user's email is verified
async function isEmailVerified(userId) {
  try {
    const user = await getUserProfile(userId);
    return user.email_verified === true;
  } catch (error) {
    console.error('Error checking email verification:', error);
    throw new Error('Unable to check email verification');
  }
}

module.exports = {
  getUserProfile,
  isEmailVerified
};