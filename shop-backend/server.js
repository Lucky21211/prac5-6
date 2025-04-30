const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const WS_PORT = process.env.WS_PORT || 4001;

const productsFile = path.join(__dirname, 'products.json');

// Функция для чтения файла товаров
function readProductsFile() {
    try {
        if (!fs.existsSync(productsFile)) return [];
        const data = fs.readFileSync(productsFile, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        return [];
    }
}

// Функция для записи в файл
function writeProductsFile(products) {
    try {
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Ошибка записи в файл:', error);
    }
}

// Получение товаров
app.get('/products', (req, res) => {
    console.log("Запрос на получение списка товаров");
    const products = readProductsFile();
    res.json(products);
});

// Добавление товара
app.post('/products', (req, res) => {
    try {
        console.log("Добавление нового товара:", req.body);
        const products = readProductsFile();
        const newProduct = { id: products.length + 1, ...req.body };
        products.push(newProduct);
        writeProductsFile(products);
        res.status(201).json({ message: 'Товар добавлен!', product: newProduct });
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Раздача фронтенда (опционально, если нужен)


// HTTP-сервер
const server = app.listen(PORT, () => {
    console.log(`Shop backend запущен на порту ${PORT}`);
});

// WebSocket-сервер
const wss = new WebSocket.Server({ port: WS_PORT });

let userCounter = 1;
const clients = new Map();

wss.on('connection', (ws) => {
    const sessionId = `user${userCounter++}`;
    clients.set(ws, sessionId);
    console.log(`Подключился ${sessionId}`);

    ws.on('message', (message) => {
        console.log(`${sessionId} отправил сообщение: ${message}`);
        try {
            const messageData = JSON.parse(message.toString());
            messageData.sessionId = sessionId;
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(messageData));
                }
            });
        } catch (error) {
            console.error('Ошибка парсинга сообщения:', error);
        }
    });

    ws.on('close', () => {
        console.log(`${sessionId} отключился`);
        clients.delete(ws);
    });
});

console.log(`WebSocket сервер запущен на порту ${WS_PORT}`);
