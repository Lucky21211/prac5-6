const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios'); 
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const productsFile = 'products.json';

// Функция для безопасного чтения файла
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

// Функция для безопасной записи в файл
function writeProductsFile(products) {
    try {
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Ошибка записи в файл:', error);
    }
}

// Получение всех товаров
app.get('/products', (req, res) => {
    const products = readProductsFile();
    res.json(products);
});

// Добавление товара
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;

    // Проверяем, что данные корректные
    if (!name || !price || !description) {
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }

    const newProduct = { name, price, description };
    console.log('Новый товар:', newProduct);

    // Загружаем текущие товары и добавляем новый
    const products = readProductsFile();
    products.push(newProduct);
    writeProductsFile(products);

    // Отправляем товар в shop-backend
    axios.post('http://localhost:8080/products', newProduct)
        .then(() => {
            console.log('Товар успешно отправлен в shop-backend');
            res.status(201).json({ message: 'Товар добавлен!' });
        })
        .catch(err => {
            console.error('Ошибка передачи в магазин:', err.message);
            res.status(500).json({ error: 'Ошибка при передаче данных в магазин', details: err.message });
        });
});

// Отдаем панель администратора


// Запуск сервера
app.listen(3000, () => {
    console.log('Admin backend запущен на порту 3000');
});
