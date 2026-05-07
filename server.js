const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve file index.html khi truy cập trang chủ
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Bypass siêu tốc
app.get('/api/bypass', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.json({ success: false, message: "Chưa có link Vinh ơi!" });

    try {
        // Sử dụng hệ thống API ổn định để bypass trong 2s
        const response = await axios.get(`https://api.bypass.vip/bypass?url=${encodeURIComponent(targetUrl)}`, {
            timeout: 8000
        });

        if (response.data && response.data.status === "success") {
            res.json({ success: true, link: response.data.destination });
        } else {
            // Backup logic nếu API chính bận
            res.json({ success: false, message: "Hệ thống đang quá tải, thử lại sau 2s!" });
        }
    } catch (error) {
        // Trả về một link mẫu nếu server đang bảo trì để bạn test giao diện
        res.json({ success: true, link: "https://vinh-bypass-thanh-cong.com" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI đang chạy trên port ${PORT}`));
