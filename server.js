const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(__dirname));

app.get('/api/get-code', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.json({ success: false, message: "Thiếu link rồi Vinh!" });

    try {
        // AI thực hiện quét link ngầm để tìm mã xác nhận
        // Ở đây mình sử dụng API trung gian ổn định để lấy mã từ trang đích
        const response = await axios.get(`https://api.bypass.vip/get-code?url=${encodeURIComponent(targetUrl)}`, {
            timeout: 10000 
        });

        if (response.data && response.data.code) {
            res.json({ success: true, code: response.data.code });
        } else {
            res.json({ success: false, message: "Không tìm thấy mã, thử lại nhé!" });
        }
    } catch (error) {
        res.json({ success: false, message: "Hệ thống bận, hãy thử lại sau 2s!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hệ thống lấy mã đang chạy trên port ${PORT}`));
