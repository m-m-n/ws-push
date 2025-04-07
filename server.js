require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocketクライアントの接続を保持する配列
const clients = new Set();

// WebSocket接続時の処理
wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('close', () => {
        clients.delete(ws);
    });
});

// /api/call エンドポイント
app.get('/api/call', (req, res) => {
    // 接続中の全クライアントに'CALL'メッセージを送信
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('CALL');
        }
    });

    res.status(200).json({ message: 'Call notification sent' });
});

const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
