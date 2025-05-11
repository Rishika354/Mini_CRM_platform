const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { promisify } = require('util');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Schema
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: String,
    email: String,
    total_spend: Number,
    visit_count: Number,
    last_active: Date,
}));

// Redis Client (Stream)
const redisClient = redis.createClient();
const xAddAsync = promisify(redisClient.xadd).bind(redisClient);

// Mongo Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// API Route - Ingest Customer
app.post('/api/customers', async (req, res) => {
    const { name, email, total_spend, visit_count, last_active } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Push to Redis Stream
    await xAddAsync('customer_stream', '*', 
        'name', name,
        'email', email,
        'total_spend', total_spend.toString(),
        'visit_count', visit_count.toString(),
        'last_active', last_active || new Date().toISOString()
    );

    res.status(202).json({ message: "Customer queued for ingestion." });
});

app.listen(3000, () => console.log("API server running on port 3000"));
