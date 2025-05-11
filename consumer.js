const mongoose = require('mongoose');
const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();

// MongoDB Schema
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: String,
    email: String,
    total_spend: Number,
    visit_count: Number,
    last_active: Date,
}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const redisClient = redis.createClient();
const xReadAsync = promisify(redisClient.xread).bind(redisClient);

async function listenToStream() {
    let lastId = '0';

    while (true) {
        const response = await xReadAsync('BLOCK', 0, 'STREAMS', 'customer_stream', lastId);
        if (response) {
            const [stream, messages] = response[0];
            for (const [id, fields] of messages) {
                const data = {};
                for (let i = 0; i < fields.length; i += 2) {
                    data[fields[i]] = fields[i + 1];
                }

                // Save to DB
                await new Customer({
                    name: data.name,
                    email: data.email,
                    total_spend: Number(data.total_spend),
                    visit_count: Number(data.visit_count),
                    last_active: new Date(data.last_active),
                }).save();

                lastId = id;
                console.log(`Customer ${data.email} saved to DB.`);
            }
        }
    }
}

listenToStream();
