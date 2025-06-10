import { cart, saveToLocalStorage, clearCart, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import '../data/cart-class.js';
import { addOrder } from '../data/ordersData.js';

renderCheckoutPage();

function renderOrderSummary(){
  //calculations for order summary
  let paymentSummary = 0;
  let shippingAndHandling = 0;
  
  cart.forEach((item) => {
    // find the product in the products array using the productId
    const product = products.find((product) => product.id === item.productId);
      
    // calculate the total price of the item
    const productPrice = parseFloat(((item.quantity * product.priceCents) / 100).toFixed(2));
    
    paymentSummary += productPrice;
    paymentSummary = parseFloat(paymentSummary.toFixed(2));
  });

  // get unique delivery options from the cart
  const uniqueDeliveryOptions = [...new Set(cart.map(item => item.deliveryOptionsId))];

  uniqueDeliveryOptions.forEach((deliveryOption) => {
    // find the delivery option in the deliveryOptions array using the deliveryOptionId
    const deliveryOptionDetails = deliveryOptions.find((option) => option.id === deliveryOption);
    
    // calculate the shipping and handling cost based on the delivery option
    if (deliveryOptionDetails) {
        shippingAndHandling += deliveryOptionDetails.priceCents / 100;
    }
  });

  let totalBeforeTax = parseFloat((paymentSummary + shippingAndHandling).toFixed(2));
  let estimatedTax = parseFloat((totalBeforeTax * 0.1).toFixed(2)); // 10% tax
  let orderTotal = parseFloat((totalBeforeTax + estimatedTax).toFixed(2));

  const orderSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div>Items (${cart.length}):</div>
      <div class="payment-summary-money">$${paymentSummary}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${shippingAndHandling}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${totalBeforeTax}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${estimatedTax}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${orderTotal}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

  document.querySelector('.js-place-order')?.addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });
      const order = await response.json();
      addOrder(order);
      clearCart();
      window.location.href = 'orders.html';
    } catch (error) {
      console.error('Error placing order:', error);
    }
  });
}

export function renderCheckoutPage(){
    let cartHTML = ``;

    cart.forEach((item) => {
        // find the product in the products array using the productId
        const product = products.find((product) => product.id === item.productId);
        
        // create the cart item HTML
        cartHTML += `
            <div class="cart-item-container js-cart-item-container-${product.id}">
                <div class="delivery-date js-delivery-date" data-product-id="${product.id}">
                    Delivery date: Tuesday, June 21
                </div>
                
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${product.image}">
                    
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${product.name}
                        </div>
                        <div class="product-price">
                            ${product.formatMoney(product.priceCents)}
                        </div>
                        <div class="product-quantity">
                            <span>
                                Quantity: <span class="quantity-label" data-product-id="${product.id}">${item.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-button" data-product-id="${product.id}">
                                Update
                            </span>
                            
                            <input style="display: none;" type="number" class="update-quantity-input" data-product-id="${product.id}" value="${item.productQuantity}">
                            <span style="display: none;" class="save-quantity-link link-primary js-save-button" data-product-id="${product.id}">
                                Save
                            </span>
                            
                            <span class="delete-quantity-link link-primary js-delete-button" data-product-id="${product.id}">
                                Delete
                            </span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        ${renderDeliverOptions(product, deliveryOptions, cart)}
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.js-checkout-order-summary').innerHTML = cartHTML;
            
        renderOrderSummary();

        const option = cart.find((item) => item.productId === product.id).deliveryOptionsId;
        const days = deliveryOptions.find((opt) => opt.id === option).days;
        const deliveryDate = dayjs().add(days, 'day').format('dddd, MMMM D');
        renderDeliveryDateHeader(deliveryDate, product.id);


    });
}

function renderDeliveryDateHeader(deliveryDate, productId) {
    setTimeout(() => {
        document.querySelector(`.js-delivery-date[data-product-id="${productId}"]`).innerHTML = 'Delivery date : ' + deliveryDate;
    }, 0);
}

document.querySelector('.js-checkout-header-quantity').innerHTML = `${cart.length}`;


function renderDeliverOptions(product, deliveryOptions, cart) {
    let deliveryOptionsHTML = ``;

    const cartItem = cart.find((item) => item.productId === product.id);
    
    deliveryOptions.forEach((option) => {
        const deliveryDate = dayjs().add(option.days, 'day').format('dddd, MMMM D');
        const deliveryPrice = (option.priceCents);
        const isChecked = option.id === cartItem.deliveryOptionsId;
        
        deliveryOptionsHTML += `
            <div class="delivery-option">
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="${product.id}" data-delivery-option-id="${option.id}">
                <div>
                    <div class="delivery-option-date js-delivery-date" data-product-id="${product.id}">
                        ${deliveryDate}
                    </div>
                    <div class="delivery-option-price">
                        ${deliveryPrice === '$0.00' ? 'FREE' : deliveryPrice} - Shipping
                    </div>
                </div>
            </div>
        `;

    });

    return deliveryOptionsHTML;
}

document.querySelectorAll('.delivery-option-input').forEach((input) => {
    input.addEventListener('click', () => {

        // change the value of cart.deliveryOptionsId to the selected delivery option id based on the product id
        cart.forEach((item) => {
            if (item.productId === input.name) {
                item.deliveryOptionsId = input.dataset.deliveryOptionId;
            }

            const days = deliveryOptions.find((opt) => opt.id === item.deliveryOptionsId).days;
            const deliveryDate = dayjs().add(days, 'day').format('dddd, MMMM D');

            renderDeliveryDateHeader(deliveryDate, item.productId);

        });

        // save the cart to local storage
        saveToLocalStorage();

        renderOrderSummary();
    });
});

document.querySelectorAll('.js-delete-button')
.forEach((button) => {
    button.addEventListener('click', () => {
            removeFromCart(button.dataset.productId);

            // remove the cart item from the DOM
            const cartItemContainer = document.querySelector(`.js-cart-item-container-${button.dataset.productId}`);
            cartItemContainer.remove();
            document.querySelector('.js-checkout-header-quantity').innerHTML = `${cart.length}`;

    });
});

document.querySelectorAll('.js-update-button').forEach((button) => {
    button.addEventListener('click', () => {

        const inputText = document.querySelector(`.update-quantity-input[data-product-id="${button.dataset.productId}"]`);
        const saveButton = document.querySelector(`.js-save-button[data-product-id="${button.dataset.productId}"]`);
        const quantityLabel = document.querySelector(`.quantity-label[data-product-id="${button.dataset.productId}"]`);

        quantityLabel.style.display = 'none';
        button.style.display = 'none';
        inputText.style.display = 'inline';
        saveButton.style.display = 'inline';

        // add event listener to the save button
        saveButton.addEventListener('click', () => {
            const newQuantity = parseInt(inputText.value);
            const productId = button.dataset.productId;

            // update the cart with the new quantity
            cart.forEach((item) => {
                if (item.productId === productId) {
                    item.quantity = newQuantity;
                }
            });

            // save the cart to local storage
            saveToLocalStorage(); 

            renderOrderSummary();
            // update the quantity label in the DOM
            quantityLabel.innerHTML = `${newQuantity}`;
            quantityLabel.style.display = 'inline';
            button.style.display = 'inline';
            inputText.style.display = 'none';
            saveButton.style.display = 'none';
        });

    });
});