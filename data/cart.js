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
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((item) => {
    if (item.productId !== productId) {
      newCart.push(item);
    }

    cart = newCart;
  });
}

export let cart = [
    {
        "productId":"54e0eccd-8f36-462b-b68a-8182611d9add",
        "productQuantity":2
    },
    {
        "productId": "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        "productQuantity": 1
    }
];