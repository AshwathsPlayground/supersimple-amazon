export function formatMoney(amount) {
    // Format the amount to 2 decimal places and add a dollar sign
    return `$${parseFloat((amount / 100)).toFixed(2)}`;
}