import { cart, removeFromCart, saveToLocalStorage } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatMoney } from './utils/money.js';

let cartHTML = ``;

document.querySelector('.js-checkout-header-quantity').innerHTML = `${cart.length}`;

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
                name="${product.id}">
                <div>
                <div class="delivery-option-date">
                    Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="${product.id}">
                <div>
                <div class="delivery-option-date">
                    Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="${product.id}">
                <div>
                <div class="delivery-option-date">
                    Monday, June 13
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
});

document.querySelector('.js-checkout-order-summary').innerHTML = cartHTML;

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