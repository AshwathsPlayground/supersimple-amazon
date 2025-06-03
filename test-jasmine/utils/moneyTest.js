import { formatMoney} from "../../scripts/utils/money.js";

// test suite
describe("test suite :  formatMoney", () => {
    // test case 1
    it("test case 1: formatMoney function works correctly for 1000 cents", () => {
        expect(formatMoney(1000)).toEqual("$10.00");
    });
    
    // test case 2
    it("test case 2: formatMoney function works correctly for 0 cents", () => {
        expect(formatMoney(0)).toEqual("$0.00");
    });
    
    // test case 3
    it("test case 3: formatMoney function works correctly for 2000.5 cents", () => {
        expect(formatMoney(2000.5)).toBe("$20.01");
    });
    
    // test case 4
    it("test case 4: formatMoney function works correctly for 2000.4 cents", () => {
        expect(formatMoney(2000.4)).toBe("$20.00");
    });
});