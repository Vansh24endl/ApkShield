require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({ origin: '*' })); // Allow all origins for production
app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api/apk', require('./routes/apk'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Sever running on port ${PORT}`));
