export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveToLocalStorage() {
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
      });
    }
    // save the cart to local storage
    saveToLocalStorage();
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
  });
}