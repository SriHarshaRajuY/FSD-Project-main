const products = [
    { id: '1', name: 'Double Prong Weeder', price: 165, image: '/public/images/toolspic/doubble-prong-weeder.jpg', rating: 5, description: 'Perfect for removing weeds and aerating soil. Features a comfortable wooden handle and durable metal prongs.', inStock: true, type: 'weeder' },
    { id: '2', name: 'Hedge Shear with Wooden Handle', price: 275, image: '/public/images/toolspic/p1.png', rating: 5, description: 'The Hedge Shear with Wooden Handle No. MMI-78 is an essential gardening tool designed for precision trimming and shaping of hedges and shrubs. Crafted with high-quality steel blades, this shear ensures clean cuts, promoting healthy growth and a polished appearance for your garden.', inStock: true, type: 'shear' },
    { id: '3', name: 'Transplanting Trowel No. MMI 83', price: 345, image: '/public/images/toolspic/p2.png', rating: 5, description: 'The Transplanting Trowel No. MMI 83 is an essential gardening tool designed for precision and ease. Crafted from high-quality stainless steel, this trowel features a sharp, pointed blade that effortlessly penetrates soil, making it perfect for transplanting seedlings and delicate plants.', inStock: true, type: 'trowel' },
    { id: '4', name: 'Fruit Harvest Blade', price: 475, image: '/public/images/toolspic/fruit harvest blade.webp', rating: 5, description: 'Professional fruit harvesting blade with ergonomic handle.', inStock: false, type: 'blade' },
    { id: '5', name: 'Five Prong Weeder', price: 475, image: '/public/images/toolspic/five prong weeder.jpg', rating: 4, description: 'A sturdy five-prong weeder for efficient weed removal.', inStock: true, type: 'weeder' },
    { id: '6', name: 'The Watermatic Stake', price: 475, image: '/public/images/toolspic/the-watermatic-stake.webp', rating: 4, description: 'An innovative watering tool for precise plant hydration.', inStock: true, type: 'mister' },
    { id: '7', name: 'Curve Pruning Saw', price: 475, image: '/public/images/toolspic/curve-pruning-saw.jpg', rating: 4, description: 'A curved pruning saw for cutting branches with ease.', inStock: true, type: 'blade' },
    { id: '8', name: 'Dom Metallic Mister', price: 475, image: '/public/images/toolspic/dom mettalic mister.webp', rating: 4, description: 'A stylish metallic mister for gentle plant watering.', inStock: true, type: 'mister' }
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
    const toolTypeCheckboxes = filterMenu.querySelectorAll('.tool-type');
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
        const selectedTypes = Array.from(toolTypeCheckboxes)
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
        toolTypeCheckboxes.forEach(cb => cb.checked = false);
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