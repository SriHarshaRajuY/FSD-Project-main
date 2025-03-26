// This file exposes the product arrays to the global scope for the search functionality

// Make fertilizers products available globally
document.addEventListener("DOMContentLoaded", () => {
    // Declare the products variable
    let products
  
    if (typeof products !== "undefined") {
      // Determine which page we're on based on the URL
      const currentPath = window.location.pathname
  
      if (currentPath.includes("fertilizers")) {
        window.fertilizersProducts = products
      } else if (currentPath.includes("pebbles")) {
        window.pebblesProducts = products
      } else if (currentPath.includes("plants")) {
        window.plantsProducts = products
      } else if (currentPath.includes("seeds")) {
        window.seedsProducts = products
      } else if (currentPath.includes("tools")) {
        window.toolsProducts = products
      }
    }
  })
  
  