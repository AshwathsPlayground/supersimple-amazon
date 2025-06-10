import { products } from '../data/products.js';
import { orders } from '../data/ordersData.js';
import { cart, addToCart } from '../data/cart.js';
export function addOrder(order) {
  orders.unshift(order);
  saveOrders();
}

export function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

console.log(orders);

function renderOrders() {

  const cartQuantity = document.querySelector('.js-cart-quantity');
  cartQuantity.textContent = cart.length;

  // Only render if we're on the orders page
  const ordersGrid = document.querySelector('.orders-grid');
  if (!ordersGrid) return;

  let ordersHTML = '';

  orders.forEach((order) => {
    const orderDate = new Date(order.orderTime);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[orderDate.getMonth()];
    const day = orderDate.getDate();

    // Get image URLs from products data
    order.products.forEach((orderProduct) => {
      const matchingProduct = products.find((product) => product.id === orderProduct.productId);
      if (matchingProduct) {
        orderProduct.image = matchingProduct.image;
        orderProduct.name = matchingProduct.name;
      }
    });


    
    const totalDollars = (order.totalCostCents / 100).toFixed(2);
    
    let productsHTML = '';
    
    order.products.forEach((product) => {
      productsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${month} ${day + 5}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.productId}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${month} ${day}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${totalDollars}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = ordersHTML;
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderOrders);
} else {
  renderOrders();
}

const buyAgainButtons = document.querySelectorAll('.js-buy-again');

buyAgainButtons.forEach((button) => {
  button.addEventListener('click', () => {
    console.log('Buy it again button clicked');

    const productId = button.dataset.productId;
    
    addToCart(productId, 1);
    renderOrders();

    // redirect to the cart page
    window.location.href = 'checkout.html';
  });
});