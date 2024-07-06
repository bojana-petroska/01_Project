document.addEventListener('DOMContentLoaded', () => {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  let total = 0;

  // function updateCartDisplay() {
  //   cartItemsContainer.innerHTML = '';
  //   total = 0;

  //   cartItems.forEach((item, index) => {
  //     const itemElement = document.createElement('div');
  //     itemElement.classList.add('cart-item');
  //     itemElement.dataset.index = index;
  //     itemElement.innerHTML = `
  //               <img src="${item.image}" alt="${item.name}" class="cart-item-image">
  //               <div class="cart-item-details">
  //                   <span class="cart-item-name">${item.name}</span>
  //                   <span class="cart-item-price">$${item.price}</span>
  //                   <span class="cart-item-quantity">$${item.quantity}</span>
  //               </div>
  //           `;
  //     itemElement.addEventListener('click', () => {
  //       itemElement.classList.toggle('selected');
  //     });

  //     cartItemsContainer.appendChild(itemElement);
  //     total += parseFloat(item.price);
  //   });
    
  //   cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  // }

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    total = 0;

    cartItems.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.dataset.index = index;

      itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price}</span>
                    <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
                    <span class="cart-item-subtotal">Subtotal: $${item.subTotal.toFixed(2)}</span>
                </div>
            `;

      itemElement.addEventListener('click', () => {
        itemElement.classList.toggle('selected');
      });

      cartItemsContainer.appendChild(itemElement);
      total += parseFloat(item.subTotal);
    });

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

  updateCartDisplay();

  document
    .getElementById('remove-item-button')
    .addEventListener('click', () => {
      const selectedItems = document.querySelectorAll('.cart-item.selected');
      selectedItems.forEach((selectedItem => {
        const index = parseInt(selectedItem.dataset.index);
        const item = cartItems[index];

        if (item.quantity > 1) {
          item.quantity--;
          item.subTotal -=item.price;
        } else {
          cartItems.splice(index, 1);
        }
      }))

      localStorage.setItem('cart', JSON.stringify(cartItems));
      updateCartDisplay();
    });

  document
  .getElementById('checkout-btn')
  .addEventListener('click', () => {
    showMessage('Thank you for your purchase!');
    localStorage.removeItem('cart');
    setTimeout(() => {
      window.opener.postMessage('resetCart', '*');
      window.close();
    }, 3000);
  });
});
