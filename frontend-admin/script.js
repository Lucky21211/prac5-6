const chatWindow = document.getElementById("chatWindow");
const messageInput = document.getElementById("messageInput");

const ws = new WebSocket("ws://localhost:8081"); // Убедись, что WebSocket-сервер работает

ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    const message = document.createElement("p");
    message.innerHTML = `<strong>${messageData.sessionId}:</strong> ${messageData.message}`;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Автопрокрутка вниз
};

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === "") return;

    const data = JSON.stringify({ sessionId: "Admin", message });
    ws.send(data);

    messageInput.value = ""; // Очищаем поле ввода
}

// Функция загрузки списка товаров
// Функция загрузки списка товаров
function loadProducts() {
    fetch("http://localhost:8080/products") // ПРАВИЛЬНЫЙ ПОРТ!
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("adminProductList");
            productList.innerHTML = "";
            products.forEach(product => {
                const item = document.createElement("li");
                item.innerHTML = `<strong>${product.name}</strong> - ${product.price} руб.<br> <em>${product.description}</em>`;
                productList.appendChild(item);
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
}


// Загружаем товары при старте страницы
document.addEventListener("DOMContentLoaded", loadProducts);

document.getElementById("addProduct").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;

    if (!name || !price || !description) {
        alert("Заполните все поля!");
        return;
    }

    const newProduct = { name, price, description };

    fetch("http://localhost:3000/products", { // Отправляем товар в admin-backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (response.ok) {
            alert("Товар добавлен!");
            loadProducts(); // Обновляем список товаров
        } else {
            response.json().then(data => alert(`Ошибка: ${data.error}`));
        }
    })
    .catch(error => console.error("Ошибка добавления товара:", error));
});
