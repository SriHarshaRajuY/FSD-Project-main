document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("seller-product-form");
    const productList = document.getElementById("seller-product-list");
    const topSales = document.getElementById("seller-top-sales");
    const recentSales = document.getElementById("seller-recent-sales");
    const productModal = document.getElementById("seller-product-modal");
    const overlay = document.getElementById("seller-overlay");
    const modalImg = document.getElementById("seller-modal-img");
    const modalTitle = document.getElementById("seller-modal-title");
    const modalPrice = document.getElementById("seller-modal-price");
    const modalQuantity = document.getElementById("seller-modal-quantity");
    const modalSold = document.getElementById("seller-modal-sold");
    const modalDescription = document.getElementById("seller-modal-description");
    const closeBtn = document.querySelector(".seller-close");
    const addToCartBtn = document.getElementById("seller-add-to-cart");
    const buyNowBtn = document.getElementById("seller-buy-now");
    const cartCount = document.getElementById("cart-count");

    let products = [];
    let currentCartCount = parseInt(cartCount.textContent) || 0;

    // Function to fetch top sales from server
    async function fetchTopSales() {
        try {
            const response = await fetch('/api/top-sales');
            if (!response.ok) throw new Error('Failed to fetch top sales');
            return await response.json();
        } catch (error) {
            console.error('Error loading top sales:', error);
            return [];
        }
    }

    // Function to fetch recent sales from server
    async function fetchRecentSales() {
        try {
            const response = await fetch('/api/recent-sales');
            if (!response.ok) throw new Error('Failed to fetch recent sales');
            return await response.json();
        } catch (error) {
            console.error('Error loading recent sales:', error);
            return [];
        }
    }

    // Function to create a product card
    function createProductCard(product) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("seller-product");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
            <p>Sold: ${product.sold}</p>
            <button class="seller-details-btn" data-product-id="${product.id}">View Details</button>
            <button class="seller-edit-btn" data-product-id="${product.id}">Edit</button>
            <button class="seller-delete-btn" data-product-id="${product.id}">Delete</button>
        `;

        productDiv.querySelector(".seller-details-btn").addEventListener("click", () => showProductDetails(product));
        productDiv.querySelector(".seller-edit-btn").addEventListener("click", () => editProduct(product));
        productDiv.querySelector(".seller-delete-btn").addEventListener("click", () => deleteProduct(product));

        return productDiv;
    }

    // Function to show product details in modal
    function showProductDetails(product) {
        modalImg.src = product.image;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `Price: ${product.price}`;
        modalQuantity.textContent = `Available Quantity: ${product.quantity}`;
        modalSold.textContent = `Sold: ${product.sold}`;
        modalDescription.textContent = `Description: ${product.description}`;

        addToCartBtn.setAttribute('data-product-id', product.id);
        buyNowBtn.setAttribute('data-product-id', product.id);

        productModal.classList.add("active");
        overlay.classList.add("active");
    }

    // Function to edit a product
    async function editProduct(product) {
        const newName = prompt("Enter new product name:", product.name);
        const newPrice = prompt("Enter new price (e.g., 10.99):", product.price.replace('$', ''));
        const newQuantity = prompt("Enter new quantity:", product.quantity);
        const newDescription = prompt("Enter new description:", product.description);

        if (newName && newPrice && newQuantity && newDescription) {
            try {
                const response = await fetch(`/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newName,
                        price: newPrice,
                        quantity: newQuantity,
                        description: newDescription
                    })
                });

                const rawResponse = await response.text();
                console.log('Edit response:', rawResponse);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(rawResponse);
                    } catch {
                        throw new Error('Server returned an unexpected response: ' + rawResponse);
                    }
                    throw new Error(errorData.message || 'Failed to update product');
                }

                await renderProducts();
            } catch (error) {
                console.error('Error updating product:', error);
                alert(error.message || 'Failed to update product. Please try again.');
            }
        }
    }

    // Function to delete a product
    async function deleteProduct(product) {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`/api/products/${product.id}`, {
                    method: 'DELETE'
                });

                const rawResponse = await response.text();
                console.log('Delete response:', rawResponse);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(rawResponse);
                    } catch {
                        throw new Error('Server returned an unexpected response: ' + rawResponse);
                    }
                    throw new Error(errorData.message || 'Failed to delete product');
                }

                products = products.filter(p => p.id !== product.id);
                await renderProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(error.message || 'Failed to delete product. Please try again.');
            }
        }
    }

    // Function to add to cart
    function addToCart() {
        currentCartCount++;
        cartCount.textContent = currentCartCount;
        closeModal();
    }

    // Function to close modal
    function closeModal() {
        productModal.classList.remove("active");
        overlay.classList.remove("active");
    }

    // Function to render all products
    async function renderProducts() {
        productList.innerHTML = "";
        topSales.innerHTML = "";
        recentSales.innerHTML = "";

        // Get initial products from the script tag
        const scriptTag = document.querySelector('script[data-initial-products]');
        if (scriptTag) {
            try {
                products = JSON.parse(scriptTag.textContent);
            } catch (error) {
                console.error('Error parsing initial products:', error);
                products = [];
            }
        } else {
            products = [];
        }

        // Render all products
        products.forEach(product => {
            const productCard = createProductCard(product);
            productList.appendChild(productCard);
        });

        // Fetch and render top sales
        const topProducts = await fetchTopSales();
        topProducts.forEach(product => {
            const productCard = createProductCard(product);
            topSales.appendChild(productCard);
        });

        // Fetch and render recent sales
        const recentProducts = await fetchRecentSales();
        recentProducts.forEach(product => {
            const productCard = createProductCard(product);
            recentSales.appendChild(productCard);
        });
    }

    // Function to compress image
    async function compressImage(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // Form submission handler
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const name = document.getElementById("seller-product-name").value.trim();
            const priceInput = document.getElementById("seller-product-price").value.trim();
            const quantityInput = document.getElementById("seller-product-quantity").value.trim();
            const imageFile = document.getElementById("seller-product-image").files[0];

            if (!name || !priceInput || !quantityInput || !imageFile) {
                alert('Please fill in all fields');
                return;
            }

            const price = parseFloat(priceInput);
            const quantity = parseInt(quantityInput);

            if (isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
                alert('Please enter valid price and quantity');
                return;
            }

            const compressedImage = await compressImage(imageFile);

            const response = await fetch('/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    price,
                    quantity,
                    image: compressedImage
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const result = await response.json();
            console.log('Product added:', result);

            // Clear form
            productForm.reset();

            // Refresh product list
            await renderProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    });

    // Close modal when clicking close button or overlay
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // Add to cart button click handler
    addToCartBtn.addEventListener("click", addToCart);

    // Initial render
    renderProducts();
});
