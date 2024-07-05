
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let total = 0;

    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price}</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += parseFloat(item.price);
        });
    }

    function updateCartTotal() {
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    function showMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.id = 'message';
        messageElement.textContent = text;
        messageElement.classList.add('message', 'show');
        document.body.appendChild(messageElement);
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }

    displayCartItems();
    updateCartTotal();

    document.getElementById('checkout-btn').addEventListener('click', () => {
        showMessage('Thank you for your purchase!');
        localStorage.removeItem('cart');
        setTimeout(() => {
            window.opener.postMessage('resetCart', '*');
            window.close();
        }, 3000);
    });
});