import { formatmoney } from "../scripts/utils/money.js";


// bsasic test cases for formatmoney function
if(formatmoney(1000) === '$10.00') {
    console.log("test passed: formatmoney function works correctly for 1000 cents.");
}else { 
    console.log("test failed: formatmoney function does not work correctly for 1000 cents.");
}

// edge test cases for formatmoney function
if(formatmoney(0) === '$0.00') {
    console.log("test passed: formatmoney function works correctly for 0 cents.");
}
else { 
    console.log("test failed: formatmoney function does not work correctly for 0 cents.");
}

if(formatmoney(2000.5)=== '$20.01') {
    console.log("test passed: formatmoney function works correctly for 20005 cents.");
}
else { 
    console.log(formatmoney(2000.5));
    console.log("test failed: formatmoney function does not work correctly for 20005 cents.");
}

if(formatmoney(2000.4) === '$20.00') {
    console.log("test passed: formatmoney function works correctly for 2000.4 cents.");
}
else { 
    console.log("test failed: formatmoney function does not work correctly for 2000.4 cents.");
}

