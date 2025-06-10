import { orders } from '../data/ordersData.js';
import { products } from '../data/products.js';

const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');

function renderTrackingPage(){
  const order = orders.find((order) => order.id === orderId);
  
  // Get product details from products data
  order.products.forEach((orderProduct) => {
    const matchingProduct = products.find((product) => product.id === orderProduct.productId);
    if (matchingProduct) {
      orderProduct.image = matchingProduct.image;
      orderProduct.name = matchingProduct.name;
    }
  });

  const orderDate = new Date(order.orderTime);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[orderDate.getMonth()];
  const day = orderDate.getDate();          

  const orderSummaryHTML = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${month} ${day + 5}
      </div>

      <div class="product-info">
        ${order.products[0].name}
      </div>

      <div class="product-info">
        Quantity: ${order.products[0].quantity}
      </div>

      <img class="product-image" src="${order.products[0].image}">

      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = orderSummaryHTML;
}

renderTrackingPage();