// Product data
window.newProducts = [
    {
        id: 1,
        name: "Money Plant Golden",
        image: "./public/images/new-products/p6.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "A beautiful low-maintenance plant that brings prosperity.",
        inStock: true
    },
    {
        id: 2,
        name: "Growing round Plastic pot",
        image: "./public/images/new-products/p7.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Durable plastic pot perfect for small plants.",
        inStock: true
    },
    {
        id: 3,
        name: "Spinach Seeds",
        image: "./public/images/new-products/p5.jpg",
        rating: 4.5,
        price: 5,
        originalPrice: 7.60,
        description: "High-quality seeds for growing fresh spinach.",
        inStock: true
    },
    {
        id: 4,
        name: "Pruning Secateur",
        image: "./public/images/new-products/p1.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Sharp tool for precise plant pruning.",
        inStock: false
    },
    {
        id: 5,
        name: "Onex Pebbles - 1Kg",
        image: "./public/images/new-products/p3.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Decorative pebbles for garden aesthetics.",
        inStock: true
    },
    {
        id: 6,
        name: "Parijat Tree",
        image: "./public/images/new-products/p4.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Fragrant flowering tree for your garden.",
        inStock: true
    },
    {
        id: 7,
        name: "Fungo Gaurd - 500ml",
        image: "./public/images/new-products/p2.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Fungicide to protect plants from fungal diseases.",
        inStock: true
    },
    {
        id: 8,
        name: "Coco Husk Block - 5kg",
        image: "./public/images/new-products/p8.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Natural growing medium for healthy plants.",
        inStock: true
    }
];

window.bestProducts = [
    {
        id: 1,
        name: "Bonsai",
        image: "public/images/best-products/s1.jpg"
    },
    {
        id: 2,
        name: "Indoor",
        image: "public/images/best-products/s2.jpg"
    },
    {
        id: 3,
        name: "Areca Palm",
        image: "public/images/best-products/s3.jpg"
    },
    {
        id: 4,
        name: "Seeds",
        image: "public/images/best-products/s4.jpg"
    }
];

//* Home Slider */
var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    loop: true,
});

// Function to create star rating HTML
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

// Helper function to create star rating for product detail
function createStarRatingSVG(rating) {
    return Array(5).fill('').map((_, index) => {
        let fill = 'none';
        let colorClass = 'text-gray-300';
        
        if (index < Math.floor(rating)) {
            fill = 'currentColor';
            colorClass = 'text-yellow-400';
        } else if (index === Math.floor(rating) && rating % 1 !== 0) {
            fill = 'url(#half-star)';
            colorClass = 'text-yellow-400';
        }
        
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${colorClass}">
            <defs>
                <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                    <stop offset="50%" stop-color="currentColor"/>
                    <stop offset="50%" stop-color="transparent"/>
                </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`;
    }).join('');
}

// Check if user is logged in
async function isLoggedIn() {
    try {
        const response = await fetch('/api/check-auth', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.isAuthenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Render new products (no longer needed as products are server-rendered)
// This function is kept for potential dynamic updates
function renderNewProducts() {
    const newProductsContainer = document.querySelector('.product .box-container');
    if (newProductsContainer && window.newProducts) {
        newProductsContainer.innerHTML = window.newProducts.map(product => `
            <div class="box" data-product-id="${product.id}">
                <div class="icons">
                    <a href="#" class="fas fa-heart"></a>
                    <a href="#" class="fas fa-share"></a>
                    <a href="#" class="fas fa-eye"></a>
                </div>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <div class="stars">
                    ${createStarRating(product.rating || 4.5)}
                </div>
                <div class="quantity">
                    <span>Quantity</span>
                    <input type="number" min="1" max="50" value="1">
                </div>
                <div class="price">
                    $${product.price.toFixed(2)} <span>$${product.originalPrice ? product.originalPrice.toFixed(2) : (product.price * 1.45).toFixed(2)}</span>
                </div>
                <a href="#" class="btn add-to-cart-btn">${product.inStock ? 'Add to Cart' : 'Out of Stock'}</a>
            </div>
        `).join('');
    }
}

// Render best products (no longer needed as products are server-rendered)
// This function is kept for potential dynamic updates
function renderBestProducts() {
    const bestProductsContainer = document.querySelector('.sell .box-container');
    if (bestProductsContainer && window.bestProducts) {
        bestProductsContainer.innerHTML = window.bestProducts.map(product => `
            <div class="box" data-product-id="${product.id}">
                <div class="image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="content">
                    <h3>${product.name}</h3>
                    <div class="icons">
                        <i class="fas fa-shopping-cart"></i>
                        <i class="fas fa-heart"></i>
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Show product detail
function showProductDetail(productId) {
    const product = window.newProducts.find(p => p.id == productId) || 
                   window.bestProducts.find(p => p.id == productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const productDetail = document.getElementById('product-detail');
    const detailContent = productDetail.querySelector('.detail-content');

    detailContent.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <h1>${product.name}</h1>
            <div class="rating">
                ${createStarRatingSVG(product.rating || 4.5)}
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description || 'No description available.'}</p>
            <button class="add-to-cart-btn" ${!product.inStock ? 'disabled' : ''}>
                ${product.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
            ${product.inStock ? `
                <button class="buy-now">
                    Buy Now
                </button>
                <div class="quantity">
                    <button class="decrement">-</button>
                    <span class="quantity-value">1</span>
                    <button class="increment">+</button>
                </div>` : ''}
        </div>
    `;

    if (product.inStock) {
        const decrementBtn = detailContent.querySelector('.decrement');
        const incrementBtn = detailContent.querySelector('.increment');
        const quantityValue = detailContent.querySelector('.quantity-value');
        const priceElement = detailContent.querySelector('.price');
        const addToCartBtn = detailContent.querySelector('.add-to-cart-btn');
        let quantity = 1;

        const updateQuantityAndPrice = () => {
            quantityValue.textContent = quantity;
            priceElement.textContent = `$${(product.price * quantity).toFixed(2)}`;
            decrementBtn.disabled = quantity <= 1;
        };

        incrementBtn.addEventListener('click', () => {
            quantity++;
            updateQuantityAndPrice();
        });

        decrementBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                updateQuantityAndPrice();
            }
        });

        addToCartBtn.addEventListener('click', async () => {
            await handleAddToCart(productId, quantity);
        });
    }

    productDetail.classList.add('active');
}

// Handle product actions
function handleProductAction(action, productId) {
    switch (action) {
        case 'favorite':
            console.log(`Added product ${productId} to favorites`);
            // Add actual favorite functionality here
            break;
        case 'share':
            console.log(`Sharing product ${productId}`);
            // Add actual share functionality here
            break;
        case 'view':
            console.log(`Viewing product ${productId} details`);
            showProductDetail(productId);
            break;
        case 'cart':
            console.log(`Adding product ${productId} to cart`);
            handleAddToCart(productId, 1);
            break;
    }
}

// Handle add to cart with login check
async function handleAddToCart(productId, quantity) {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        window.location.href = '/login';
        return;
    }

    const product = window.newProducts.find(p => p.id == productId) || 
                   window.bestProducts.find(p => p.id == productId);
    
    if (!product) {
        console.error('Product not found for cart:', productId);
        return;
    }

    if (!product.inStock) {
        alert('This product is out of stock');
        return;
    }

    const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating || 4.5,
        description: product.description,
        inStock: product.inStock,
        quantity: quantity
    };

    let cart = JSON.parse(localStorage.getItem('plantShopCart')) || [];
    const existingProduct = cart.find(p => p.id === cartItem.id);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('plantShopCart', JSON.stringify(cart));

    const addToCartBtn = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`) || 
                       document.querySelector('#product-detail .add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added';
        addToCartBtn.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            addToCartBtn.innerHTML = 'Add to Cart';
            addToCartBtn.style.backgroundColor = '';
        }, 2000);
    }

    alert(`${product.name} has been added to your cart!`);
}

// Initialize products and add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Products are already rendered server-side, but we can update if needed
    renderNewProducts();
    renderBestProducts();

    document.querySelectorAll('.box').forEach(box => {
        const quantityInput = box.querySelector('input[type="number"]');
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value < 1) e.target.value = '1';
                if (value > 50) e.target.value = '50';
            });
        }

        box.querySelectorAll('.icons a, .icons i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.target.classList.contains('fa-heart') ? 'favorite' :
                            e.target.classList.contains('fa-share') ? 'share' :
                            e.target.classList.contains('fa-eye') ? 'view' :
                            e.target.classList.contains('fa-shopping-cart') ? 'cart' : null;
                
                if (action) {
                    const productId = box.getAttribute('data-product-id');
                    handleProductAction(action, productId);
                }
            });
        });

        const addToCartBtn = box.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const productId = box.getAttribute('data-product-id');
                const quantity = parseInt(box.querySelector('input[type="number"]')?.value || '1');
                await handleAddToCart(productId, quantity);
            });
        }

        box.addEventListener('click', (e) => {
            if (!e.target.closest('.icons') && !e.target.closest('.add-to-cart-btn')) {
                const productId = box.getAttribute('data-product-id');
                showProductDetail(productId);
            }
        });
    });

    const backBtn = document.querySelector('.back-btn');
    const productDetail = document.getElementById('product-detail');
    if (backBtn && productDetail) {
        backBtn.addEventListener('click', () => {
            productDetail.classList.remove('active');
        });
    }

    // Close product detail when clicking outside
    productDetail?.addEventListener('click', (e) => {
        if (e.target === productDetail) {
            productDetail.classList.remove('active');
        }
    });
});