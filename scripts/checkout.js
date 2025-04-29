import { cart, removeFromCart, saveToLocalStorage } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatMoney } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

let cartHTML = ``;

document.querySelector('.js-checkout-header-quantity').innerHTML = `${cart.length}`;

const today = dayjs();

const freeDeliveryDate = today.add(7, 'day').format('dddd, MMMM D');
const paidDeliveryDate1 = today.add(4, 'day').format('dddd, MMMM D');
const paidDeliveryDate2 = today.add(2, 'day').format('dddd, MMMM D');



cart.forEach((item) => {
    // find the product in the products array using the productId
    const product = products.find((product) => product.id === item.productId);
    
    // create the cart item HTML
    cartHTML += `
        <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>
        
        <div class="cart-item-details-grid">
        <img class="product-image"
        src="${product.image}">
        
        <div class="cart-item-details">
        <div class="product-name">
                ${product.name}
            </div>
            <div class="product-price">
                ${formatMoney(product.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label" data-product-id = ${product.id}>${item.productQuantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-button" data-product-id = "${product.id}">
                Update
                </span>

                <input style = "display : none;" type="number" class="update-quantity-input" data-product-id = "${product.id}" value="${item.productQuantity}">
                <span style = "display :none;" class="save-quantity-link link-primary js-save-button" data-product-id = "${product.id}">
                Save
                </span>

                <span class="delete-quantity-link link-primary js-delete-button" data-product-id = "${product.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            <div class="delivery-option">
                <input type="radio" checked
                class="delivery-option-input"
                name="${product.id}" data-delivery-option-id = "1">
                <div>
                <div class="delivery-option-date js-free-delivery-date" data-product-id = "${product.id}">
                    ${freeDeliveryDate}
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="${product.id}" data-delivery-option-id = "2">
                <div>
                <div class="delivery-option-date js-paid-delivery-date1" data-product-id = "${product.id}">
                    ${paidDeliveryDate1}
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="${product.id}" data-delivery-option-id = "3">
                <div>
                <div class="delivery-option-date js-paid-delivery-date2" data-product-id = "${product.id}">
                    ${paidDeliveryDate2}
                </div>
                <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        `;
        document.querySelector('.js-checkout-order-summary').innerHTML = cartHTML;

        // Delay to ensure DOM is updated
        setTimeout(() => {
            document.querySelectorAll('.delivery-option-input').forEach((input) => {
                if (input.name === item.productId) {
                    if (input.dataset.deliveryOptionId === item.deliveryOptionsId) {
                        input.checked = true;
                    }
                }
            });
        }, 0);


}); 

//calculations for order summary
let paymentSummary = 0;
let shippingAndHandling = 0;

cart.forEach((item) => {
    // find the product in the products array using the productId
    const product = products.find((product) => product.id === item.productId);
    
    // calculate the total price of the item
    const productPrice = parseFloat(((item.productQuantity * product.priceCents) / 100).toFixed(2));
    
    paymentSummary += productPrice;
    paymentSummary = parseFloat(paymentSummary.toFixed(2));
    // console.log(typeof productPrice, typeof paymentSummary, productPrice, paymentSummary);
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
}
);

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

          <button class="place-order-button button-primary">
            Place your order
          </button>
`;

document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

document.querySelectorAll('.delivery-option-input').forEach((input) => {
    input.addEventListener('click', () => {
        console.log(input.dataset.deliveryOptionId, input.name);
        
        // change the value of cart.deliveryOptionsId to the selected delivery option id based on the product id
        cart.forEach((item) => {
            if (item.productId === input.name) {
                item.deliveryOptionsId = input.dataset.deliveryOptionId;
            }
        });
        console.log(cart);
        // save the cart to local storage
        saveToLocalStorage();

        // print the local storage to the console
        console.log(JSON.parse(localStorage.getItem("cart")));
    
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
                    item.productQuantity = newQuantity;
                }
            });

            // save the cart to local storage
           saveToLocalStorage(); 

            // update the quantity label in the DOM
            quantityLabel.innerHTML = `${newQuantity}`;
            quantityLabel.style.display = 'inline';
            button.style.display = 'inline';
            inputText.style.display = 'none';
            saveButton.style.display = 'none';
        });

    });
});