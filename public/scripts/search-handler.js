// This file will handle the search functionality across all product categories

// Function to collect all products from different categories
function getAllProducts() {
    // Create an array to store all products with their category
    const allProducts = []
  
    // Check if each product array exists in the global scope and add them
    if (typeof window.fertilizersProducts !== "undefined") {
      window.fertilizersProducts.forEach((product) => {
        allProducts.push({
          ...product,
          category: "fertilizers",
        })
      })
    }
  
    if (typeof window.pebblesProducts !== "undefined") {
      window.pebblesProducts.forEach((product) => {
        allProducts.push({
          ...product,
          category: "pebbles",
        })
      })
    }
  
    if (typeof window.plantsProducts !== "undefined") {
      window.plantsProducts.forEach((product) => {
        allProducts.push({
          ...product,
          category: "plants",
        })
      })
    }
  
    if (typeof window.seedsProducts !== "undefined") {
      window.seedsProducts.forEach((product) => {
        allProducts.push({
          ...product,
          category: "seeds",
        })
      })
    }
  
    if (typeof window.toolsProducts !== "undefined") {
      window.toolsProducts.forEach((product) => {
        allProducts.push({
          ...product,
          category: "tools",
        })
      })
    }
  
    return allProducts
  }
  
  // Function to search products
  function searchProducts(query) {
    if (!query || query.trim() === "") return []
  
    query = query.toLowerCase().trim()
    const allProducts = getAllProducts()
  
    return allProducts.filter((product) => {
      // Search in name and description
      return (
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      )
    })
  }
  
  // Function to display search results
  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById("search-results")
  
    if (!searchResultsContainer) {
      // Create the search results container if it doesn't exist
      const container = document.createElement("div")
      container.id = "search-results"
      container.className = "search-results-container"
      document.querySelector(".search-container").appendChild(container)
  
      // Add event listener to close results when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) {
          hideSearchResults()
        }
      })
    }
  
    const resultsContainer = document.getElementById("search-results")
  
    // Clear previous results
    resultsContainer.innerHTML = ""
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found</div>'
      resultsContainer.style.display = "block"
      return
    }
  
    // Create results list
    const resultsList = document.createElement("ul")
    resultsList.className = "results-list"
  
    results.forEach((product) => {
      const listItem = document.createElement("li")
      listItem.className = "result-item"
  
      // Create result item content
      listItem.innerHTML = `
        <div class="result-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="result-info">
          <h4>${product.name}</h4>
          <p class="result-price">₹${product.price}</p>
        </div>
      `
  
      // Add click event to navigate to product page
      listItem.addEventListener("click", () => {
        navigateToProduct(product)
      })
  
      resultsList.appendChild(listItem)
    })
  
    resultsContainer.appendChild(resultsList)
    resultsContainer.style.display = "block"
  }
  
  // Function to hide search results
  function hideSearchResults() {
    const resultsContainer = document.getElementById("search-results")
    if (resultsContainer) {
      resultsContainer.style.display = "none"
    }
  }
  
  // Function to navigate to product page
  function navigateToProduct(product) {
    // Navigate to the category page
    window.location.href = `/${product.category}?productId=${product.id}`
  }
  
  // Initialize search functionality
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input")
    const searchIcon = document.querySelector(".search-icon")
  
    if (searchInput) {
      // Search on input change (with debounce)
      let debounceTimer
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          const query = e.target.value
          if (query.trim() !== "") {
            const results = searchProducts(query)
            displaySearchResults(results)
          } else {
            hideSearchResults()
          }
        }, 300)
      })
  
      // Search on enter key
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          const query = e.target.value
          if (query.trim() !== "") {
            const results = searchProducts(query)
            displaySearchResults(results)
          }
        }
      })
  
      // Search on icon click
      if (searchIcon) {
        searchIcon.addEventListener("click", () => {
          const query = searchInput.value
          if (query.trim() !== "") {
            const results = searchProducts(query)
            displaySearchResults(results)
          }
        })
      }
    }
  })
  
  