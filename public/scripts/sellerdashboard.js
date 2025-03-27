
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const themeToggle = document.getElementById("theme-toggle")
  const themeSelectorBtn = document.getElementById("theme-selector-btn")
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const sidebarClose = document.getElementById("sidebar-close")
  const sidebar = document.querySelector(".sidebar")
  const overlay = document.getElementById("overlay")
  const navItems = document.querySelectorAll(".sidebar-nav li")
  const pages = document.querySelectorAll(".page")
  const addProductBtn = document.getElementById("add-product-btn")
  const settingsForm = document.getElementById("settings-form")

  // Initialize Charts
  initCharts()

  // Toggle Theme
  function toggleTheme() {
    document.body.classList.toggle("dark-mode")
    updateThemeButtonText()
  }

  function updateThemeButtonText() {
    const isDarkMode = document.body.classList.contains("dark-mode")
    if (themeSelectorBtn) {
      themeSelectorBtn.innerHTML = isDarkMode
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode'
    }
  }

  themeToggle.addEventListener("click", toggleTheme)
  if (themeSelectorBtn) {
    themeSelectorBtn.addEventListener("click", toggleTheme)
  }

  // Mobile Menu Toggle
  mobileMenuToggle.addEventListener("click", () => {
    sidebar.classList.add("active")
    overlay.style.display = "block"
  })

  sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("active")
    overlay.style.display = "none"
  })

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active")
    overlay.style.display = "none"
  })

  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      // Update active nav item
      navItems.forEach((navItem) => navItem.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding page
      const pageId = this.getAttribute("data-page") + "-page"
      pages.forEach((page) => page.classList.remove("active"))
      document.getElementById(pageId).classList.add("active")

      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active")
        overlay.style.display = "none"
      }
    })
  })

 

  // Settings Form
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("Settings saved successfully!")
    })
  }

  // Initialize Charts
  function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById("revenue-chart").getContext("2d")
    const revenueChart = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [5000, 7000, 9000, 12000, 15000, 18000],
            borderColor: "#22c55e",
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--border"),
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground"),
            },
          },
          x: {
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--border"),
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground"),
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--foreground"),
            },
          },
        },
      },
    })

    // Category Chart
    const categoryCtx = document.getElementById("category-chart").getContext("2d")
    const categoryChart = new Chart(categoryCtx, {
      type: "pie",
      data: {
        labels: ["Plants", "Tools", "Seeds"],
        datasets: [
          {
            data: [40, 30, 30],
            backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--foreground"),
            },
          },
        },
      },
    })

    // Sales Trends Chart (for Analytics page)
    const salesTrendsCtx = document.getElementById("sales-trends-chart")
    if (salesTrendsCtx) {
      const salesTrendsChart = new Chart(salesTrendsCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Sales 2023",
              data: [5000, 7000, 9000, 12000, 15000, 18000, 20000, 22000, 24000, 26000, 28000, 30000],
              borderColor: "#22c55e",
              tension: 0.3,
              fill: false,
            },
            {
              label: "Sales 2022",
              data: [4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000, 26000],
              borderColor: "#3b82f6",
              tension: 0.3,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--border"),
              },
              ticks: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground"),
              },
            },
            x: {
              grid: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--border"),
              },
              ticks: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground"),
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--foreground"),
              },
            },
          },
        },
      })
    }
  }

  // Update chart colors when theme changes
  themeToggle.addEventListener("click", () => {
    // Destroy and reinitialize charts to update colors
    setTimeout(initCharts, 100)
  })

  // Handle window resize for responsive charts
  window.addEventListener("resize", () => {
    setTimeout(initCharts, 100)
  })
})
document.getElementById("add-product-btn").addEventListener("click", () => {
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const quantity = parseInt(document.getElementById("product-quantity").value, 10);

  if (name && !isNaN(price) && !isNaN(quantity)) {
      fetch("http://localhost:7000/add-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price, quantity })
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          loadProducts();
      })
      .catch(error => console.error("Error:", error));
  } else {
      alert("Please enter valid product details.");
  }
});
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page refresh

  // Collect form data
  const formData = new FormData(e.target);
  const productData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price')),
    category: formData.get('category'),
    image: formData.get('image'),
  };

  try {
    const response = await fetch('/addproduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert('Product added successfully');
      window.location.href = "/sellerdashboard"; // Redirect to seller dashboard
    } else {
      const errorData = await response.json();
      alert(`Failed to add product: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the product');
  }
});

function loadProducts() {
  fetch("http://localhost:3000/get-products")
      .then(response => response.json())
      .then(data => {
          const productList = document.getElementById("product-list");
          productList.innerHTML = "";
          data.forEach(row => {
              const li = document.createElement("li");
              li.textContent = `${row.name} - $${row.price} - Quantity: ${row.quantity}`;
              productList.appendChild(li);
          });
      })
      .catch(error => console.error("Error:", error));
}

