import { cart, removeFromCart, saveToLocalStorage, renderOrderSummary } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatMoney } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

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
                        ${formatMoney(product.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label" data-product-id="${product.id}">${item.productQuantity}</span>
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
        const deliveryPrice = formatMoney(option.priceCents);
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
                    item.productQuantity = newQuantity;
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