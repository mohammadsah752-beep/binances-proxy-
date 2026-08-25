const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());
app.use(async (req, res) => {
  try {
    const targetUrl = `https://api.binance.com${req.originalUrl}`;
    
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: headers,
      data: req.body
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
