const chatWindow = document.getElementById("chatWindow");
const messageInput = document.getElementById("messageInput");
const productList = document.getElementById("productList");

// WebSocket клиент
const socket = new WebSocket("ws://localhost:8080");

// Уникальный ID для вкладки
const sessionId = Math.random().toString(36).substring(7);

socket.onopen = () => {
    console.log("Соединение с WebSocket установлено.");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const message = document.createElement("p");
    message.textContent = data.message;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
};

socket.onclose = () => {
    console.log("Соединение с WebSocket закрыто.");
};

function sendMessage() {
    const message = messageInput.value;
    if (message) {
        socket.send(JSON.stringify({ sessionId, message }));
        messageInput.value = "";
    }
}

// Загрузка каталога товаров
function loadProducts() {
    fetch("http://localhost:8080/products")
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = "";
            products.forEach(product => {
                const item = document.createElement("li");
                item.innerHTML = `<strong>${product.name}</strong> - ${product.price} руб.<br> <em>${product.description}</em>`;
                productList.appendChild(item);
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
}

// Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", loadProducts);
