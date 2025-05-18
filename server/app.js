const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const verifyTokenRoute = require('./routes/verifyToken');
const env = require('./config');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);
app.use('/api', verifyTokenRoute);

// Import routes
const buildRoutes = require('./routes/builds');
app.use('/api/builds', buildRoutes);

const path = require('path');

// Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
