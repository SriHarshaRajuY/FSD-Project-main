const products = [
    {
        id: '1',
        name: '5.1 inch (13 cm) Round Plastic Thermoform Pot (Mix Color)',
        price: 165,
        image: '/public/images/potspics/p1.png',
        rating: 5,
        description: 'Elevate your gardening experience with our vibrant 5.1 inch (13 cm) Round Plastic Thermoform Pots.',
        inStock: true,
        material: 'Plastic'
    },
    {
        id: '2',
        name: '4.5 inch (11 cm) Ronda No. 1110 Round Plastic Planter',
        price: 259,
        image: '/public/images/potspics/p2.png',
        rating: 5,
        description: 'The Ronda No. 1110 Round Plastic Planter is the perfect blend of style and functionality.',
        inStock: true,
        material: 'Plastic'
    },
    {
        id: '3',
        name: '6.6 inch (17 cm) Tulsi Vrindavan Matt',
        price: 499,
        image: '/public/images/potspics/p3.png',
        rating: 4,
        description: 'Enhance your home decor with our exquisite 6.6 inch (17 cm) Tulsi Vrindavan Matt Finish Rectangle Ceramic Pot.',
        inStock: true,
        material: 'Ceramic'
    },
    {
        id: '4',
        name: '2 inch (5 cm) Square Glass Vase (9 inch Height)',
        price: 475,
        image: '/public/images/potspics/p4.png',
        rating: 5,
        description: 'This elegant 2-inch square glass vase stands at a striking 9 inches tall.',
        inStock: false,
        material: 'Glass'
    },
    {
        id: '5',
        name: '11.8 inch (30 cm) Bello Window Planter No. 30 Rectangle',
        price: 799,
        image: '/public/images/potspics/p5.png',
        rating: 4,
        description: 'The Bello Window Planter No. 30 is a stylish and functional addition to your gardening collection.',
        inStock: true,
        material: 'Plastic'
    },
    {
        id: '6',
        name: '4 inch (10.1 cm) Round Ceramic',
        price: 999,
        image: '/public/images/potspics/p6.png',
        rating: 4,
        description: 'Elevate your home decor with our exquisite set of 3 round ceramic pots.',
        inStock: true,
        material: 'Ceramic'
    },
    {
        id: '7',
        name: 'Warli Painting Ceramic Pots - Pack of 3',
        price: 475,
        image: '/public/images/potspics/p7.png',
        rating: 4,
        description: 'Elevate your home decor with our exquisite Warli Painting Ceramic Pots.',
        inStock: true,
        material: 'Ceramic'
    },
    {
        id: '8',
        name: '6.5 inch (17 cm) Hexa No. 2 Plastic Planter (Terracotta)',
        price: 475,
        image: '/public/images/potspics/p8.png',
        rating: 4,
        description: 'Elevate your gardening experience with our 6.5 inch Hexa No. 2 Plastic Planter.',
        inStock: true,
        material: 'Plastic'
    }
];

// Helper function to create star rating
function createStarRating(rating) {
    return Array(5).fill('').map((_, index) => 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${index < rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${index < rating ? 'text-yellow-400' : 'text-gray-300'}">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`
    ).join('');
}

// Render product cards
function renderProducts(productList = products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = productList.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="content">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price}</p>
                <div class="rating">
                    ${createStarRating(product.rating)}
                </div>
                <button ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            showProductDetail(productId);
        });
    });
}

// Show product detail with quantity selector and dynamic price
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    const productDetail = document.getElementById('product-detail');
    const detailContent = productDetail.querySelector('.detail-content');

    detailContent.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <h1>${product.name}</h1>
            <div class="rating">
                ${createStarRating(product.rating)}
            </div>
            <p class="price">₹${product.price}</p>
            <p class="description">${product.description}</p>
            <button ${!product.inStock ? 'disabled' : ''}>
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
        let quantity = 1;

        const updateQuantityAndPrice = () => {
            quantityValue.textContent = quantity;
            priceElement.textContent = `₹${product.price * quantity}`;
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
    }

    productDetail.classList.add('active');
}

// Filter and sort products
function applyFiltersAndSort() {
    let filteredProducts = [...products];

    // Material filter
    const selectedMaterials = Array.from(document.querySelectorAll('.filter-material:checked')).map(cb => cb.value);
    if (selectedMaterials.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedMaterials.includes(product.material));
    }

    // Price filter
    const selectedPrices = Array.from(document.querySelectorAll('.filter-price:checked')).map(cb => cb.value);
    if (selectedPrices.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return selectedPrices.some(range => {
                if (range === '0-300') return product.price <= 300;
                if (range === '300-600') return product.price > 300 && product.price <= 600;
                if (range === '600+') return product.price > 600;
            });
        });
    }

    // Availability filter
    const selectedAvailability = Array.from(document.querySelectorAll('.filter-availability:checked')).map(cb => cb.value);
    if (selectedAvailability.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            if (selectedAvailability.includes('inStock') && product.inStock) return true;
            if (selectedAvailability.includes('outOfStock') && !product.inStock) return true;
            return false;
        });
    }

    // Rating filter
    const selectedRatings = Array.from(document.querySelectorAll('.filter-rating:checked')).map(cb => parseInt(cb.value));
    if (selectedRatings.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedRatings.some(rating => product.rating >= rating));
    }

    return filteredProducts;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    const homeBtn = document.querySelector('.home-btn');
    homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });

    // Sort menu toggle and functionality
    const sortBtn = document.querySelector('.sort-btn');
    const sortMenu = document.querySelector('.sort-menu');
    const sortItems = sortMenu.querySelectorAll('li');

    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('active');
    });

    sortItems.forEach(item => {
        item.addEventListener('click', () => {
            const sortType = item.textContent;
            let sortedProducts = applyFiltersAndSort();

            if (sortType === 'Price, low to high') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortType === 'Price, high to low') {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else if (sortType === 'Rating, high to low') {
                sortedProducts.sort((a, b) => b.rating - a.rating);
            } else if (sortType === 'Name, A to Z') {
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortType === 'Name, Z to A') {
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            }

            renderProducts(sortedProducts);
            sortMenu.classList.remove('active');
        });
    });

    // Filter menu toggle and functionality
    const filterBtn = document.querySelector('.filter-btn');
    const filterMenu = document.querySelector('.filter-menu');
    const applyFiltersBtn = document.querySelector('.apply-filters');

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterMenu.classList.toggle('active');
    });

    applyFiltersBtn.addEventListener('click', () => {
        const filteredProducts = applyFiltersAndSort();
        renderProducts(filteredProducts);
        filterMenu.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
            sortMenu.classList.remove('active');
        }
        if (!filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
            filterMenu.classList.remove('active');
        }
    });

    const backBtn = document.querySelector('.back-btn');
    const productDetail = document.getElementById('product-detail');
    backBtn.addEventListener('click', () => {
        productDetail.classList.remove('active');
    });
});