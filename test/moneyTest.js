import { formatMoney } from "../scripts/utils/money.js";


// bsasic test cases for formatMoney function
if(formatMoney(1000) === '$10.00') {
    console.log("test passed: formatMoney function works correctly for 1000 cents.");
}else { 
    console.log("test failed: formatMoney function does not work correctly for 1000 cents.");
}

// edge test cases for formatMoney function
if(formatMoney(0) === '$0.00') {
    console.log("test passed: formatMoney function works correctly for 0 cents.");
}
else { 
    console.log("test failed: formatMoney function does not work correctly for 0 cents.");
}

if(formatMoney(2000.5)=== '$20.01') {
    console.log("test passed: formatMoney function works correctly for 20005 cents.");
}
else { 
    console.log(formatMoney(2000.5));
    console.log("test failed: formatMoney function does not work correctly for 20005 cents.");
}

if(formatMoney(2000.4) === '$20.00') {
    console.log("test passed: formatMoney function works correctly for 2000.4 cents.");
}
else { 
    console.log("test failed: formatMoney function does not work correctly for 2000.4 cents.");
}

