const products = [
    { id: '1', name: 'Peace Lily, Spathiphyllum - Plant', price: 165, image: '/public/images/plantspics/p1.png', rating: 5, description: 'The Peace Lily, scientifically known as Spathiphyllum, is a stunning houseplant celebrated for its elegant white blooms and lush green foliage. Native to the tropical rainforests of Central and South America, this plant thrives in low-light conditions, making it an ideal choice for indoor spaces.', inStock: true, type: 'indoor' },
    { id: '2', name: 'Parijat Tree, Parijatak, Night Flowering Jasmine - Plant', price: 259, image: '/public/images/plantspics/p2.png', rating: 5, description: 'The Parijat tree, also called Night-Flowering Jasmine or Coral Jasmine, is known for its nocturnal blooms that spread a sweet, floral aroma. Revered in Indian mythology, it symbolizes love, devotion, and resilience.', inStock: true, type: 'outdoor' },
    { id: '3', name: 'Raat Ki Rani, Raat Rani, Night Blooming Jasmine - Plant', price: 499, image: '/public/images/plantspics/p3.png', rating: 5, description: 'Raat Ki Rani (*Cestrum nocturnum*), also known as Night Blooming Jasmine, is a fragrant shrub native to the Caribbean and Central America.', inStock: true, type: 'outdoor' },
    { id: '4', name: 'Damascus Rose, Scented Rose (Any Color) - Plant', price: 475, image: '/public/images/plantspics/p4.png', rating: 5, description: 'The Damascus Rose, also known as Rosa damascena, is a timeless symbol of beauty and romance.', inStock: false, type: 'outdoor' },
    { id: '5', name: 'Rosemary - Plant', price: 799, image: '/public/images/plantspics/p5.png', rating: 4, description: 'Rosemary (Rosmarinus officinalis) is a fragrant evergreen herb native to the Mediterranean region.', inStock: true, type: 'herb' },
    { id: '6', name: 'Rhoeo Plant, Rhoeo discolor (Tricolor, Variegated) - Plant', price: 999, image: '/public/images/plantspics/p6.png', rating: 4, description: 'The Rhoeo discolor, commonly known as the Tricolor or Variegated Rhoeo, is a stunning perennial plant.', inStock: true, type: 'indoor' },
    { id: '7', name: 'Madhumalti Dwarf, Rangoon Creeper - Plant', price: 475, image: '/public/images/plantspics/p7.png', rating: 4, description: 'The Madhumalti Dwarf, also known as the Rangoon Creeper (Quisqualis indica), is a stunning perennial vine.', inStock: true, type: 'outdoor' },
    { id: '8', name: 'Lemon Grass - Plant', price: 475, image: '/public/images/plantspics/p8.png', rating: 4, description: 'Lemon Grass (Cymbopogon citratus) is a tropical perennial grass known for its aromatic leaves.', inStock: true, type: 'herb' }
];

function createStarRating(rating) {
    return Array(5).fill('').map((_, index) => 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${index < rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${index < rating ? 'text-yellow-400' : 'text-gray-300'}">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`
    ).join('');
}

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

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    const homeBtn = document.querySelector('.home-btn');
    homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });

    const sortBtn = document.querySelector('.sort-btn');
    const sortMenu = document.querySelector('.sort-menu');
    const sortItems = sortMenu.querySelectorAll('li');

    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('active');
        filterMenu.classList.remove('active');
    });

    sortItems.forEach(item => {
        item.addEventListener('click', () => {
            const sortType = item.textContent;
            let sortedProducts = [...products];

            switch (sortType) {
                case 'Price, low to high':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'Price, high to low':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'Rating, high to low':
                    sortedProducts.sort((a, b) => b.rating - a.rating);
                    break;
                case 'Name, A to Z':
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }

            renderProducts(sortedProducts);
            sortMenu.classList.remove('active');
        });
    });

    const filterBtn = document.querySelector('.filter-btn');
    const filterMenu = document.querySelector('.filter-menu');
    const applyBtn = filterMenu.querySelector('.apply-btn');
    const resetBtn = filterMenu.querySelector('.reset-btn');
    const nameSearchInput = filterMenu.querySelector('.name-search');
    const minPriceInput = filterMenu.querySelector('.min-price');
    const maxPriceInput = filterMenu.querySelector('.max-price');
    const minRatingSelect = filterMenu.querySelector('.min-rating');
    const plantTypeCheckboxes = filterMenu.querySelectorAll('.plant-type');
    const inStockCheckbox = filterMenu.querySelector('.in-stock-only');

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterMenu.classList.toggle('active');
        sortMenu.classList.remove('active');
    });

    applyBtn.addEventListener('click', () => {
        const nameSearch = nameSearchInput.value.trim().toLowerCase();
        const minPrice = minPriceInput.value ? parseInt(minPriceInput.value) : 0;
        const maxPrice = maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;
        const minRating = parseInt(minRatingSelect.value);
        const selectedTypes = Array.from(plantTypeCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const inStockOnly = inStockCheckbox.checked;

        let filteredProducts = products.filter(product => {
            const matchesName = nameSearch ? product.name.toLowerCase().includes(nameSearch) : true;
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            const matchesRating = product.rating >= minRating;
            const matchesType = selectedTypes.length > 0 ? selectedTypes.includes(product.type) : true;
            const matchesStock = inStockOnly ? product.inStock : true;

            return matchesName && matchesPrice && matchesRating && matchesType && matchesStock;
        });

        renderProducts(filteredProducts);
        filterMenu.classList.remove('active');
    });

    resetBtn.addEventListener('click', () => {
        nameSearchInput.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        minRatingSelect.value = '0';
        plantTypeCheckboxes.forEach(cb => cb.checked = false);
        inStockCheckbox.checked = false;
        renderProducts(products);
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