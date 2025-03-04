const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios'); 
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const productsFile = 'products.json';

// Получение всех товаров
app.get('/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка чтения файла' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Добавление товара (Исправленный маршрут)
app.post('/products', (req, res) => {
    const newProduct = req.body;
    console.log('Новый товар:', newProduct);

    // Загружаем текущие товары
    let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

    // Отправляем товар в shop-backend
    axios.post('http://localhost:8080/products', newProduct)
        .then(() => {
            console.log('Товар успешно отправлен в shop-backend');
            res.status(201).json({ message: 'Товар добавлен!' });
        })
        .catch(err => {
            console.error('Ошибка передачи в магазин:', err);
            res.status(500).json({ error: 'Ошибка при передаче данных в магазин', details: err });
        });
});

// Отдаем панель администратора
app.use(express.static(path.join(__dirname, '../frontend-admin')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-admin/index.html'));
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Admin backend запущен на порту 3000');
});
