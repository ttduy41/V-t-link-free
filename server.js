const express = require('express');
const path = require('path');
const { nanoid } = require('nanoid');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Lưu tạm link vào bộ nhớ (Trong thực tế nên dùng Database như MongoDB)
const linkDatabase = {};

// 1. API Rút gọn link
app.post('/api/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.json({ success: false });

    const shortId = nanoid(6); // Tạo mã 6 ký tự
    linkDatabase[shortId] = {
        longUrl: longUrl,
        code: Math.random().toString(36).substring(2, 8).toUpperCase() // Tạo mã lấy link
    };

    res.json({ success: true, shortUrl: `${req.protocol}://${req.get('host')}/go/${shortId}` });
});

// 2. Trang chờ vượt link (Giống Link4m)
app.get('/go/:id', (req, res) => {
    const data = linkDatabase[req.params.id];
    if (!data) return res.send("Link không tồn tại!");
    res.sendFile(path.join(__dirname, 'verify.html'));
});

// 3. API Xác nhận mã để lấy link gốc
app.post('/api/verify', (req, res) => {
    const { id, userCode } = req.body;
    const data = linkDatabase[id];
    if (data && data.code === userCode.toUpperCase()) {
        res.json({ success: true, originalUrl: data.longUrl });
    } else {
        res.json({ success: false, message: "Mã xác nhận không đúng!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Link.net is running on port ' + PORT));
