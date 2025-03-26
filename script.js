let katalogs = []; // Store all categories globally

// Fetch JSON data
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    katalogs = data.katalogs;
    generateCategoryButtons(); // Generate category buttons
    displayProducts(katalogs[0].nosaukums); // Show first category by default
  })
  .catch(error => console.error("Error loading products:", error));

// Function to generate category buttons
function generateCategoryButtons() {
    const categoryContainer = document.getElementById("category-buttons");
    categoryContainer.innerHTML = "";

    katalogs.forEach(category => {
        categoryContainer.innerHTML += `
            <button onclick="displayProducts('${category.nosaukums}')">${category.nosaukums}</button>
        `;
    });
}
function displayProducts(selectedCategory) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Clear old products

    const selectedKatalog = katalogs.find(k => k.nosaukums === selectedCategory);
    if (!selectedKatalog) return;

    selectedKatalog.produkti.forEach(product => {
        productContainer.innerHTML += `
            <div class="product">
                <img src="${product.bilde}" alt="${product.nosaukums}">
                <h3>${product.nosaukums}</h3>
                <p>${product.apraksts}</p>
                <span>Iepakojums: ${product.iepakojums.join(", ")}</span>
            </div>
        `;
    });
}
