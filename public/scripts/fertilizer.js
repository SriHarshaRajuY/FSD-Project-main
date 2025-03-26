const products = [
    {
        id: '1',
        name: 'Bone Meal Fertilizer - 5 kg',
        price: 165,
        image: '/public/images/fertilizerspics/product1.jpg',
        rating: 5,
        description: 'Perfect for plant growth & blooming, Gardenly Bone Meal Fertilizer is made of fish bones decomposed in a sterilized environment.',
        inStock: true,
        category: 'Fertilizer'
    },
    {
        id: '2',
        name: 'Epsom Salt - 1 kg',
        price: 275,
        image: '/public/images/fertilizerspics/p3.jpg',
        rating: 5,
        description: 'Helping flowering plants bloom better, Epsom Salt is a magnesium sulphate compound and is extensively for ornamental.',
        inStock: true,
        category: 'Fertilizer'
    },
    {
        id: '3',
        name: 'Humic Acid Powder Spray - 500 ml',
        price: 345,
        image: '/public/images/fertilizerspics/p9.png',
        description: 'Promoting root development & plant resilience, Gardenly HumiGrow helps revitalize your plants. It is an organic humic acid.',
        inStock: true,
        category: 'Growth Enhancer'
    },
    {
        id: '4',
        name: 'Flora Tab - 8pcs',
        price: 475,
        image: '/public/images/fertilizerspics/p5.jpg',
        rating: 5,
        description: 'Promoting better blooming & fruiting, the FloraTAB is perfect for flowering and fruiting plants. An easy to use fertiliser that can be simply dissolved in water and applied directly to leaves or roots.',
        inStock: false,
        category: 'Fertilizer'
    },
    {
        id: '5',
        name: 'Protec Tab - 8pcs',
        price: 475,
        image: '/public/images/fertilizerspics/p6.jpg',
        rating: 4,
        description: 'Plant protection and pest control has never been easier, with ProtecTAB all you have to do is add it to water and spray it on your plants, no hassle.',
        inStock: true,
        category: 'Plant Protection'
    },
    {
        id: '6',
        name: 'Grow Tab - 8pcs',
        price: 475,
        image: '/public/images/fertilizerspics/p2.jpg',
        rating: 4,
        description: 'Promoting better foliage & root health, the GrowTAB is an easy to use complete plant nutrient, packed in a tab. Simply add this tab to water and apply directly to your plants.',
        inStock: true,
        category: 'Growth Enhancer'
    },
    {
        id: '7',
        name: 'Rooting Hormone Powder - 1 Kg',
        price: 475,
        image: '/public/images/fertilizerspics/p7.png',
        rating: 4,
        description: 'Perfect to grow cuttings & promote root development, Gardenlys Rooting Hormone contains what is said to be the heart of organic matter - humus.',
        inStock: true,
        category: 'Growth Enhancer'
    },
    {
        id: '8',
        name: 'Seaweed Extract Liquid Fertilizer',
        price: 475,
        image: '/public/images/fertilizerspics/p8.png',
        rating: 4,
        description: 'Promoting healthy root growth & denser foliage, Gardenlys Seaweed Extract Plant Tonic is Used for nurturing the healthy growth of plants.',
        inStock: true,
        category: 'Fertilizer'
    },
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

    // Add click event listeners to product cards
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

    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category:checked')).map(cb => cb.value);
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
    }

    // Price filter
    const selectedPrices = Array.from(document.querySelectorAll('.filter-price:checked')).map(cb => cb.value);
    if (selectedPrices.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return selectedPrices.some(range => {
                if (range === '0-200') return product.price <= 200;
                if (range === '200-400') return product.price > 200 && product.price <= 400;
                if (range === '400+') return product.price > 400;
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

    // Home button navigation
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