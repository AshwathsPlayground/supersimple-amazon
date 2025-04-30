import { products } from './products.js';
import { deliveryOptions } from './deliveryOptions.js'; 

export let cart = JSON.parse(localStorage.getItem("cart")) || [];

// console.log(cart);

export function saveToLocalStorage() {
  // save the cart to local storage
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, productQuantity) {
    // check if the product is already in the cart and update the quantity
    let matchedProduct;
    cart.forEach((item) => {
      
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
      cart.push({
        productId: productId,
        productQuantity,
        deliveryOptionsId: '1',
      });
    }
    // save the cart to local storage
    saveToLocalStorage();
}

export function renderOrderSummary(){
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
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((item) => {
    if (item.productId !== productId) {
      newCart.push(item);
    }

    cart = newCart;

    // save the cart to local storage
    saveToLocalStorage();
    renderOrderSummary();
  });
}