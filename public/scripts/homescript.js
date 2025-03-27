// Home Slider
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

// Show product detail
function showProductDetail(productId) {
    const productElement = document.querySelector(`.product .box[data-product-id="${productId}"]`);
    if (!productElement) {
        console.error('Product not found:', productId);
        return;
    }

    const product = {
        id: productId,
        name: productElement.querySelector('h3').textContent,
        image: productElement.querySelector('img').src,
        rating: 4.5,
        price: parseFloat(productElement.querySelector('.price').textContent.split(' ')[0].replace('$', '')),
        description: productElement.dataset.description || 'No description available.',
        inStock: productElement.querySelector('.add-to-cart-btn').textContent === 'Add to Cart',
        available: parseInt(productElement.querySelector('.available span').textContent.split(': ')[1])
    };

    const productDetail = document.getElementById('product-detail');
    const detailContent = productDetail.querySelector('.detail-content');

    detailContent.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <h1>${product.name}</h1>
            <div class="rating">
                ${createStarRatingSVG(product.rating)}
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <p class="available">Available: ${product.available}</p>
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
            incrementBtn.disabled = quantity >= product.available;
        };

        incrementBtn.addEventListener('click', () => {
            if (quantity < product.available) {
                quantity++;
                updateQuantityAndPrice();
            }
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
            break;
        case 'share':
            console.log(`Sharing product ${productId}`);
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

    const productElement = document.querySelector(`.box[data-product-id="${productId}"]`);
    if (!productElement) {
        console.error('Product not found for cart:', productId);
        return;
    }

    const product = {
        id: productId,
        name: productElement.querySelector('h3').textContent,
        price: parseFloat(productElement.querySelector('.price').textContent.split(' ')[0].replace('$', '')),
        image: productElement.querySelector('img').src,
        rating: 4.5,
        description: productElement.dataset.description || 'No description available.',
        inStock: productElement.querySelector('.add-to-cart-btn').textContent === 'Add to Cart',
        available: parseInt(productElement.querySelector('.available span').textContent.split(': ')[1])
    };

    if (!product.inStock) {
        alert('This product is out of stock');
        return;
    }

    if (quantity > product.available) {
        alert(`Only ${product.available} items available in stock!`);
        return;
    }

    const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
        description: product.description,
        inStock: product.inStock,
        available: product.available,
        quantity: quantity
    };

    let cart = JSON.parse(localStorage.getItem('plantShopCart')) || [];
    const existingProduct = cart.find(p => p.id === cartItem.id);
    
    if (existingProduct) {
        if (existingProduct.quantity + quantity > product.available) {
            alert(`Only ${product.available - existingProduct.quantity} more items can be added!`);
            return;
        }
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
    document.querySelectorAll('.box').forEach(box => {
        const quantityInput = box.querySelector('input[type="number"]');
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                const max = parseInt(e.target.max);
                const value = parseInt(e.target.value);
                if (value < 1) e.target.value = '1';
                if (value > max) e.target.value = max.toString();
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

    productDetail?.addEventListener('click', (e) => {
        if (e.target === productDetail) {
            productDetail.classList.remove('active');
        }
    });
});