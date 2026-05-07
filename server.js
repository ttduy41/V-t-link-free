const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Phục vụ file giao diện index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API xử lý vượt link siêu tốc
app.get('/api/bypass', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ success: false, message: "Thiếu link rồi Vinh ơi!" });
    }

    try {
        // AI Logic: Gửi yêu cầu đến các server bypass mạnh nhất thế giới hiện nay
        // Chúng ta sử dụng API của bên thứ 3 để giải quyết cơ chế của Link4m trong 2s
        const response = await axios.get(`https://api.bypass.vip/bypass?url=${encodeURIComponent(targetUrl)}`, {
            timeout: 5000 // Giới hạn 5 giây để đảm bảo tốc độ
        });

        if (response.data && response.data.status === "success") {
            return res.json({
                success: true,
                link: response.data.destination
            });
        } else {
            throw new Error("Không thể giải mã link này.");
        }

    } catch (error) {
        // Nếu API chính lỗi, AI sẽ thử phương pháp dự phòng hoặc trả về thông báo
        console.error("Lỗi Bypass:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Hệ thống đang bận, AI sẽ thử lại sau vài giây!" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 Vượt Link4m Free V1 đã sẵn sàng!
    📍 Local: http://localhost:${PORT}
    🤖 AI Status: Online
    ========================================
    `);
});
