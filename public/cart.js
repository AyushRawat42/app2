// cart.js - Shopping Cart Functionality

// Initialize cart from localStorage or create empty array
let cart = JSON.parse(localStorage.getItem('autoPartsCart')) || [];

// Function to add item to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  updateCart();
  showNotification(`${product.name} added to cart`);
}

// Function to update cart in localStorage
function updateCart() {
  localStorage.setItem('autoPartsCart', JSON.stringify(cart));
  updateCartCount(); // Update cart count indicator
}

// Function to show cart count in navigation
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// Function to show notification
function showNotification(message) {
  // ... (use the same notification code from your existing script)
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  
  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price),
        image: this.dataset.image
      };
      addToCart(product);
    });
  });
});