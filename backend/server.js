const express = require('express');
const cors = require('cors');  
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
require('dotenv').config();
const statusRoutes = require('./routes/statusRoute');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL, /\.statuscode\.fun$/],  // Allow localhost, frontend URL, and wildcard domain *.statuscode.fun
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'organizationId'],
}));
// Routes


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);

app.use('/api/organizations', organizationRoutes);
app.use('/api/status', statusRoutes);



// Initialize server
const startServer = async () => {
  // Connect to database
  await connectDB();
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Run server
startServer().catch(err => console.error('Failed to start server:', err));