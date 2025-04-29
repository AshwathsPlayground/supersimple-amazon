import { cart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatMoney } from './utils/money.js';

let cartHTML = ``;

cart.forEach((item) => {
    // find the product in the products array using the productId
    const product = products.find((product) => product.id === item.productId);
    
    // create the cart item HTML
    cartHTML += `
        <div class="cart-item-container">
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
                Quantity: <span class="quantity-label">${item.productQuantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                Update
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
    console.log(button)
    button.addEventListener('click', () => {
        // console.log(button.dataset.productId); 
        cart.filter((item) => {
            if(item.productId === button.dataset.productId){
                console.log('matched');
                return false;
            }
        console.log(cart);
        });
    });
});

