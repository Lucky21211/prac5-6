const API_URL = 'http://localhost:3000/products';

// Получение товаров
function loadProducts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(products => {
            const productsDiv = document.getElementById('products');
            productsDiv.innerHTML = '';
            products.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('product');
                div.innerHTML = `
                    <h3>${product.name}</h3>
                    <p><strong>Цена:</strong> ${product.price}</p>
                    <p><strong>Описание:</strong> ${product.description}</p>
                    <button onclick="editProduct(${product.id})">Редактировать</button>
                    <button onclick="deleteProduct(${product.id})">Удалить</button>
                `;
                productsDiv.appendChild(div);
            });
        });
}

// Добавление товара
document.getElementById('addProduct').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Ошибка:', error));
});


// Удаление товара
function deleteProduct(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(() => loadProducts());
}

// Редактирование товара
function editProduct(id) {
    const name = prompt('Введите новое название');
    const price = prompt('Введите новую цену');
    const description = prompt('Введите новое описание');

    if (name && price && description) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, description })
        }).then(() => loadProducts());
    }
}

loadProducts();