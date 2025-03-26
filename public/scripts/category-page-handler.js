// This file handles showing the specific product when navigating from search results

document.addEventListener("DOMContentLoaded", () => {
    // Import the products array and showProductDetail function
    // Assuming they are in a separate module named 'product-utils.js'
    import("./product-utils.js")
      .then((module) => {
        const products = module.products
        const showProductDetail = module.showProductDetail
  
        // Check if there's a productId in the URL
        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get("productId")
  
        if (productId) {
          // Find the product in the current page's products array
          const product = products.find((p) => p.id === productId)
  
          if (product) {
            // Show the product detail
            showProductDetail(productId)
  
            // Scroll to the product detail
            const productDetail = document.getElementById("product-detail")
            if (productDetail) {
              setTimeout(() => {
                productDetail.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error importing product-utils.js:", error)
      })
  })
  
  