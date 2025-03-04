document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:8080/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";
            products.forEach(product => {
                const productItem = document.createElement("div");
                productItem.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Цена: ${product.price}</p>
                    <p>${product.description}</p>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
});
