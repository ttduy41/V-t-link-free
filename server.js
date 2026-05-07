const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API xử lý vượt link siêu tốc
app.get('/api/bypass', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.json({ success: false });

    try {
        // AI gửi request ngầm để lấy link gốc trong 2s
        const response = await axios.get(`https://api.bypass.vip/bypass?url=${encodeURIComponent(targetUrl)}`, {
            timeout: 8000
        });

        if (response.data && response.data.status === "success") {
            res.json({ success: true, link: response.data.destination });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('AI System Online!'));
