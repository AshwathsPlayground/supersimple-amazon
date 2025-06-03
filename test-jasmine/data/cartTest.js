import { addToCart, cart } from "../../data/cart.js";

const productID = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

describe("test suite : addToCart", () => {
    it('add an existing product to the cart', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() =>{
            return JSON.stringify([{
                productId : productID,
                productQuantity : 1,
                deliverOptionId : 1
            } 
            ]);
        });

        addToCart(productID, 1);

        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual(productID);
        expect(cart[0].productQuantity).toEqual(1);
        
   });
    
    it('add a new product to the cart', () => {        
        // mocking the cart localStorage to get consistent results
        spyOn(localStorage, 'setItem');

        spyOn(localStorage, 'getItem').and.callFake(() =>{
            return JSON.stringify([]);
        });

        console.log(cart)
        addToCart(productID, 1);

        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual(productID);
        expect(cart[0].productQuantity).toEqual(2);
    });


});
