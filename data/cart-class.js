import { products } from './products.js';
import { deliveryOptions } from './deliveryOptions.js'; 

class Cart{
    #localStorageKey;  // private property, cannot be accessed outside the class
    cartItems;
    constructor(localStorageKey){
        this.#localStorageKey = localStorageKey; 
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
        this.#saveToLocalStorage(this.#localStorageKey);
    }

    #saveToLocalStorage(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }
    
    addToCart(productId, productQuantity) {
        // check if the product is already in the cart and update the quantity
        let matchedProduct;
        this.cartItems.forEach((item) => {
        
        if (item.productId === productId) {
            matchedProduct = item;
        }
        });
        
        // if the product is already in the cart, update the quantity
        if (matchedProduct) {
        // update the quantity
        matchedProduct.productQuantity += productQuantity;
        }else{
        // push the product to the cart
        this.cartItems.push({
            productId: productId,
            productQuantity,
            deliveryOptionsId: '1',
        });
        }
        // save the cart to local storage
        this.#saveToLocalStorage();
        }

    renderOrderSummary(){
        //calculations for order summary
        let paymentSummary = 0;
        let shippingAndHandling = 0;
        
        this.cartItem.forEach((item) => {
        // find the product in the products array using the productId
        const product = products.find((product) => product.id === item.productId);
            
        // calculate the total price of the item
        const productPrice = parseFloat(((item.productQuantity * product.priceCents) / 100).toFixed(2));
        
        paymentSummary += productPrice;
        paymentSummary = parseFloat(paymentSummary.toFixed(2));
        // console.log(typeof productPrice, typeof paymentSummary, productPrice, paymentSummary);
        });
    
        // get unique delivery options from the cart
        const uniqueDeliveryOptions = [...new Set(this.cartItem.map(item => item.deliveryOptionsId))];
    
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
                <div>Items (${this.cartItem.length}):</div>
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
    }

    removeFromCart(productId) {
        const newCart = [];
    
        this.cartItem.forEach((item) => {
        if (item.productId !== productId) {
            newCart.push(item);
        }
    
        this.cartItems = newCart;
    
        // save the cart to local storage
        this.saveToLocalStorage();
        this.renderOrderSummary();
        });
    }

}

const cart = new Cart("cart");
const businessCart = new Cart("business-cart");
businessCart.addToCart('54e0eccd-8f36-462b-b68a-8182611d9add', 2);

// cart.#localStorageKey = 'cart'; 
// Uncaught SyntaxError: reference to undeclared private field or method #localStorageKey