// Placeholder function to handle adding items to the cart
let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        let productName = e.target.parentElement.querySelector('h2').textContent;
        cart.push(productName);
        alert(productName + ' has been added to your cart');
    });
});
