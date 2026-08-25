const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Enable CORS for all incoming requests from Netlify / browser
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-MBX-APIKEY', 'Authorization']
}));

app.use(express.json());

// Health check endpoint for "Test this URL"
app.get('/', (req, res) => {
    res.status(200).send('Binance Proxy is active');
});

// Main Proxy Handler
app.use('/api', async (req, res) => {
    try {
        const targetUrl = `https://api.binance.com${req.url.replace('/api', '')}`;
        
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                'X-MBX-APIKEY': req.headers['x-mbx-apikey'] || '',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Content-Type': req.headers['content-type'] || 'application/json'
            },
            data: req.method !== 'GET' ? req.body : undefined
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});

