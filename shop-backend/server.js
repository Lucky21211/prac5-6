const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const productsFile = 'products.json';

// Получение товаров
app.get('/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка чтения файла' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Добавление товара в магазин
app.post('/products', (req, res) => {
    const newProduct = req.body;
    console.log('Товар получен от admin-backend:', newProduct);

    let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

    res.status(201).json({ message: 'Товар добавлен в магазин!' });
});

// Отдаем файлы магазина
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Запуск сервера
app.listen(8080, () => {
    console.log('Shop backend запущен на порту 8080');
});
