document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update displays on page load
    updateCartDisplay();
    updateCartCount();

    // Add event listeners to all add-to-cart buttons
    initializeCartButtons();

    // MISSING FUNCTION - Cart Count Badge
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count, #cart-badge');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            if (totalItems > 0) {
                element.textContent = totalItems;
                element.style.display = 'inline-block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    // Initialize all cart buttons
    function initializeCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart, .btn-cart, button[onclick*="addToCart"]');
        
        addToCartButtons.forEach(button => {
            // Remove any existing onclick attributes to prevent conflicts
            button.removeAttribute('onclick');
            
            // Add our event listener
            button.addEventListener('click', function(event) {
                event.preventDefault();
                addToCart(event);
            });
        });
    }

    // Enhanced Add to Cart Function
    function addToCart(event) {
        const button = event.target;
        const productContainer = findProductContainer(button);
        
        if (!productContainer) {
            showNotification('Error: Product information not found', 'error');
            return;
        }

        // Extract product data with multiple fallback methods
        const productData = extractProductData(productContainer, button);
        
        if (!productData.id || !productData.name || !productData.price) {
            showNotification('Error: Missing product information', 'error');
            console.error('Missing product data:', productData);
            return;
        }

        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`Updated ${productData.name} quantity in cart`, 'success');
        } else {
            const newItem = {
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: 1,
                addedAt: new Date().toISOString()
            };
            cart.push(newItem);
            showNotification(`${productData.name} added to cart!`, 'success');
        }

        // Save and update displays
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();

        // Button feedback
        buttonFeedback(button);
    }

    // Find product container with multiple selectors
    function findProductContainer(button) {
        const selectors = [
            '.product-card',
            '.engine-card', 
            '.product-item',
            '.item-card',
            '.product-detail',
            '.engine-item',
            '.transmission-item',
            '.turbo-item'
        ];

        for (let selector of selectors) {
            const container = button.closest(selector);
            if (container) return container;
        }

        // If no container found, use the button's parent elements
        let parent = button.parentElement;
        while (parent && parent !== document.body) {
            if (parent.dataset.id || parent.dataset.name || parent.dataset.price) {
                return parent;
            }
            parent = parent.parentElement;
        }

        return null;
    }

    // Extract product data with multiple methods
    function extractProductData(container, button) {
        let data = {
            id: null,
            name: null,
            price: null,
            image: '/images/default-engine.jpg'
        };

        // Method 1: Data attributes on container
        data.id = container.dataset.id || container.dataset.productId;
        data.name = container.dataset.name || container.dataset.productName;
        data.price = container.dataset.price || container.dataset.productPrice;
        data.image = container.dataset.image || container.dataset.productImage;

        // Method 2: Data attributes on button
        if (!data.id) data.id = button.dataset.id || button.dataset.productId;
        if (!data.name) data.name = button.dataset.name || button.dataset.productName;
        if (!data.price) data.price = button.dataset.price || button.dataset.productPrice;
        if (!data.image || data.image === '/images/default-engine.jpg') {
            data.image = button.dataset.image || button.dataset.productImage;
        }

        // Method 3: Extract from HTML content
        if (!data.name) {
            const nameElement = container.querySelector('h3, h4, .product-name, .engine-name, .item-name');
            if (nameElement) data.name = nameElement.textContent.trim();
        }

        if (!data.price) {
            const priceElement = container.querySelector('.price, .product-price, .engine-price');
            if (priceElement) {
                const priceText = priceElement.textContent.trim();
                data.price = priceText.replace(/[^0-9.,]/g, '').replace(',', '');
            }
        }

        if (!data.image || data.image === '/images/default-engine.jpg') {
            const imgElement = container.querySelector('img');
            if (imgElement && imgElement.src && !imgElement.src.includes('data:')) {
                data.image = imgElement.src;
            }
        }

        // Method 4: Generate ID if missing
        if (!data.id && data.name) {
            data.id = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        }

        // Clean price value
        if (data.price) {
            const cleanPrice = parseFloat(data.price.toString().replace(/[,$]/g, ''));
            data.price = isNaN(cleanPrice) ? null : cleanPrice;
        }

        return data;
    }

    // Button visual feedback
    function buttonFeedback(button) {
        const originalText = button.textContent;
        const originalStyle = button.style.backgroundColor;

        button.style.backgroundColor = '#27ae60';
        button.textContent = 'Added!';
        button.disabled = true;

        setTimeout(() => {
            button.style.backgroundColor = originalStyle;
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

   // Update cart display (for cart page)
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartTotalElement = document.querySelector('#cart-total');
    
    if (!cartItemsContainer) return; // Not on cart page

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Browse our products and add items to your cart.</p>
                <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
        updateCartCount();
        return;
    }

    // Build cart items HTML with safe image handling
    const cartHTML = cart.map(item => {
        // Safe image URL - use placeholder if image is missing or invalid
        let imageUrl = item.image;
        if (!imageUrl || imageUrl === '/images/default-engine.jpg' || imageUrl.includes('undefined')) {
            imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9Ijc1IiB2aWV3Qm94PSIwIDAgMTAwIDc1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9Ijc1IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zNS41IDMzLjVMMzkuNSAyOS41TDQ2IDM2TDU0LjUgMjcuNUw2NC41IDM3LjVWNTBINDdIMzVWMzMuNVoiIGZpbGw9IiNDQ0MiLz4KPHBhdGggZD0iTTQyIDMxQzQyIDMzLjIwOTEgNDAuMjA5MSAzNSAzOCAzNUMzNS43OTA5IDM1IDM0IDMzLjIwOTEgMzQgMzFDMzQgMjguNzkwOSAzNS43OTA5IDI3IDM4IDI3QzQwLjIwOTEgMjcgNDIgMjguNzkwOSA0MiAzMVoiIGZpbGw9IiNDQ0MiLz4KPHRleHQgeD0iNTAiIHk9IjQyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NjYiPkVuZ2luZTwvdGV4dD4KPHN2Zz4K';
        }
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${imageUrl}" alt="${item.name}" style="width: 100px; height: 75px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toLocaleString()}</p>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}" title="Decrease quantity">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}" title="Increase quantity">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" title="Remove from cart">Remove</button>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        `;
    }).join('');

    cartItemsContainer.innerHTML = cartHTML;

    // Calculate and display total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toLocaleString()}`;
    }

    // Add event listeners for cart controls
    addCartEventListeners();
    updateCartCount();
}


    // Cart control event listeners
    function addCartEventListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const isIncrease = this.classList.contains('increase');
                
                const item = cart.find(item => item.id === itemId);
                if (!item) return;

                if (isIncrease) {
                    item.quantity += 1;
                } else {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(cartItem => cartItem.id !== itemId);
                        showNotification(`${item.name} removed from cart`, 'success');
                    }
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const item = cart.find(item => item.id === itemId);
                
                if (item) {
                    cart = cart.filter(cartItem => cartItem.id !== itemId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    showNotification(`${item.name} removed from cart`, 'success');
                    updateCartDisplay();
                    updateCartCount();
                }
            });
        });
    }

    // Enhanced notification system
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification" title="Close">&times;</button>
        `;

        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 350px;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Close functionality
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    // Utility functions for debugging
    window.cartDebug = {
        getCart: () => cart,
        clearCart: () => {
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
            updateCartCount();
            showNotification('Cart cleared', 'success');
        },
        addTestItem: () => {
            const testItem = {
                id: 'test-engine-1',
                name: 'Test Engine 2.0L',
                price: 1500,
                image: '/images/default-engine.jpg',
                quantity: 1,
                addedAt: new Date().toISOString()
            };
            cart.push(testItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
            showNotification('Test item added', 'success');
        }
    };
});

// Add required CSS animations
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto auto;
        gap: 15px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 15px;
        align-items: center;
        background: white;
    }
    
    .cart-item img {
        width: 80px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .quantity-btn {
        background: #c0392b;
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .quantity-btn:hover {
        background: #a93226;
    }
    
    .remove-item {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .remove-item:hover {
        background: #c0392b;
    }
    
    .empty-cart {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }
    
    .continue-shopping-btn {
        background: #c0392b;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin-top: 15px;
    }
    
    .continue-shopping-btn:hover {
        background: #a93226;
    }
`;
document.head.appendChild(cartStyles);
