const products = [
    {
        id: '1',
        name: 'Bone Meal Fertilizer - 5 kg',
        price: 165,
        image: '/fertilizerspics/product1.jpg',
        rating: 5,
        description: 'Perfect for plant growth & blooming, Gardenly Bone Meal Fertilizer is made of fish bones decomposed in a sterilized environment.',
        inStock: true,
        quantity: 1
    },
    {
        id: '2',
        name: 'Epsom Salt - 1 kg',
        price: 275,
        image: './fertilizerspics/p3.jpg',
        rating: 5,
        description: 'Helping flowering plants bloom better, Epsom Salt is a magnesium sulphate compound and is extensively for ornamental.',
        inStock: true,
        quantity: 1
    },
    {
        id: '3',
        name: 'Humic Acid Powder Spray - 500 ml',
        price: 345,
        image: './fertilizerspics/p9.png',
        description: 'Promoting root development & plant resilience, Gardenly HumiGrow helps revitalize your plants. It is an organic humic acid.',
        inStock: true,
        quantity: 1
    },
    {
id: '4',
name: 'Garden Pebbles (Mix Color)',
price: 475,
image: './pebblespic/p1.png',
rating: 5,
description: 'Transform your creative projects with our premium Stone Sand (Blue). This 1 kg pack of vibrant blue sand is perfect for a variety of applications, from arts and crafts to landscaping. Its fine texture and striking color make it an ideal choice for adding a unique touch to your designs.',
inStock: false,
quantity: 1
},
{
id: '5',
name: 'River Pebbles (White)',
price: 475,
image: './pebblespic/p2.png',
rating: 4,
description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
inStock: true,
quantity: 1
},
{
id: '6',
name: 'Aquarium Pebbles (Yellow)',
price: 475,
image: './pebblespic/p3.png',
rating: 4,
description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
inStock: true,
quantity: 1
},

{
id: '7',
name: 'Rosemary - Plant',
price: 799,
image: './plantspics/p5.png',
rating: 4,
description: 'Rosemary (Rosmarinus officinalis) is a fragrant evergreen herb native to the Mediterranean region. Known for its needle-like leaves and woody stems, this versatile plant is not only a culinary delight but also a symbol of remembrance and fidelity. With its rich aroma and robust flavor, rosemary enhances a variety of dishes, making it a staple in kitchens worldwide.',
inStock: true,
quantity:1
},

{
id: '8',
name: '6.5 inch (17 cm) Hexa No. 2 Plastic Planter (Terracotta)',
price: 475,
image: './potspics/p8.png',
rating: 4,
description: 'Elevate your gardening experience with our 6.5 inch (17 cm) Hexa No. 2 Plastic Planter in a charming terracotta color. This set of 6 planters is perfect for both indoor and outdoor use, allowing you to showcase your favorite plants in style. Crafted from durable, lightweight plastic, these planters are designed to withstand the elements while providing excellent drainage for healthy plant growth..',
inStock: true,
quantity: 1
},

];
// Start with an empty cart instead of loading all products
let cart = []

// Load cart from localStorage if available
function loadCart() {
  const savedCart = localStorage.getItem("plantShopCart")
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart)
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e)
      cart = []
    }
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("plantShopCart", JSON.stringify(cart))
}

function renderCart() {
  const cartItems = document.getElementById("cart-items")
  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="/" class="btn">Start Shopping</a>
            </div>
        `
    document.getElementById("cart-total").textContent = "0"
    return
  }

  cart.forEach((product) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "cart-item"
    itemDiv.onclick = () => showProductDetails(product)

    itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
                <div class="item-info">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${product.id}', -1); event.stopPropagation();">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="updateQuantity('${product.id}', 1); event.stopPropagation();">+</button>
                    <button class="remove-btn" onclick="removeItem('${product.id}'); event.stopPropagation();">Remove</button>
                </div>
            </div>
        `
    cartItems.appendChild(itemDiv)
  })

  updateTotal()
}

function updateQuantity(productId, change) {
  const product = cart.find((p) => p.id === productId)
  if (product) {
    product.quantity = Math.max(1, product.quantity + change)
    saveCart()
    renderCart()
  }
}

function removeItem(productId) {
  cart = cart.filter((p) => p.id !== productId)
  saveCart()
  renderCart()
}

function updateTotal() {
  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0)
  document.getElementById("cart-total").textContent = total
}

function showProductDetails(product) {
  const modal = document.getElementById("product-modal")
  document.getElementById("modal-title").textContent = product.name
  document.getElementById("modal-image").src = product.image
  document.getElementById("modal-description").textContent = product.description || "No description available"
  document.getElementById("modal-price").textContent = product.price
  document.getElementById("modal-rating").textContent = product.rating || "N/A"
  modal.style.display = "block"
}

function closeModal() {
  document.getElementById("product-modal").style.display = "none"
}

// Add a product to cart
function addToCart(product) {
  // Check if product already exists in cart
  const existingProduct = cart.find((p) => p.id === product.id)

  if (existingProduct) {
    // Update quantity if product exists
    existingProduct.quantity += product.quantity || 1
  } else {
    // Add new product to cart
    cart.push({
      ...product,
      quantity: product.quantity || 1,
    })
  }

  saveCart()

  // Show confirmation message
  alert(`${product.name} has been added to your cart!`)
}

// Clear the entire cart
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = []
    saveCart()
    renderCart()
  }
}

// Add checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Get customer details
    const customerName = prompt('Please enter your name:');
    if (!customerName) return;

    const address = prompt('Please enter your delivery address:');
    if (!address) return;

    // Create delivery order
    const orderId = 'ORD' + Date.now();
    const deliveryOrder = {
        order_id: orderId,
        customer_name: customerName,
        address: address,
        status: 'pending',
        items: cart
    };

    // Save delivery order
    fetch('/api/delivery/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deliveryOrder)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order placed successfully! Your order ID is: ' + orderId);
            // Clear cart
            cart = [];
            saveCart();
            renderCart();
        } else {
            alert('Failed to place order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error creating delivery order:', error);
        alert('Failed to place order. Please try again.');
    });
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCart()
  renderCart()

  // Add clear cart button if it doesn't exist
  const cartContainer = document.querySelector(".cart-container")
  if (cartContainer && !document.getElementById("clear-cart-btn")) {
    const clearButton = document.createElement("button")
    clearButton.id = "clear-cart-btn"
    clearButton.className = "btn"
    clearButton.textContent = "Clear Cart"
    clearButton.onclick = clearCart

    const totalSection = document.querySelector(".total-section")
    if (totalSection) {
      totalSection.appendChild(clearButton)
    }
  }

  // Add checkout button if it doesn't exist
  if (cartContainer && !document.getElementById("checkout-btn")) {
    const checkoutButton = document.createElement("button")
    checkoutButton.id = "checkout-btn"
    checkoutButton.className = "btn checkout-btn"
    checkoutButton.textContent = "Proceed to Checkout"
    checkoutButton.onclick = checkout

    if (totalSection) {
      totalSection.appendChild(checkoutButton)
    }
  }
})

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("product-modal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}

