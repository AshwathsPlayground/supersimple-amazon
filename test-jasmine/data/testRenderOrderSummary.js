import { renderOrderSummary, addToCart, cart  } from "../../data/cart.js";

const productID = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

describe('test suite : renderOrderSummary', () => {
    it('displays the cart', () => {
        document.querySelectorAll('.js-test-container').innerHTML = `
        <div class = "js-order-summary"</div>>
        `;

        spyOn(localStorage, 'getItem').and.callFake(() =>{
            return JSON.stringify([{
                productId :'e43638ce-6aaO-4b85-b27f-e1d07eb678c6' ,
                productQuantity: 2,
                deliveryOptionId :'1'
            }, {
                productid : '15b6fc6f-327a-4ec4-896f-486349e85a3d' ,
                productQuantity: 1,
                deliveryOptionId :'2'
            }]);
        });
    });
});