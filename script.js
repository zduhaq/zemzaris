let data;

document.addEventListener("DOMContentLoaded", async function() {
    await loadData();
    loadCategories();
    displayProducts(); // Display all products on page load
});

async function loadData() {
    try {
        const response = await fetch("products.json"); // Ensure the path is correct
        if (!response.ok) {
            throw new Error("Failed to load JSON data");
        }
        data = await response.json();
    } catch (error) {
        console.error("Error loading JSON data:", error);
    }
}

function loadCategories() {
    const categorySelect = document.getElementById("category");
    data.katalogs.forEach((cat, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = cat.kategorija;
        categorySelect.appendChild(option);
    });
}

function updateSubcategories() {
    const categorySelect = document.getElementById("category");
    const subcategorySelect = document.getElementById("subcategory");
    subcategorySelect.innerHTML = '<option value="">-- Izvēlieties --</option>';

    let selectedCategory = categorySelect.value;
    if (selectedCategory !== "") {
        data.katalogs[selectedCategory].apakškategorijas.forEach((subcat, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = subcat.kategorija;
            subcategorySelect.appendChild(option);
        });
    }
}

function displayProducts() {
    const categorySelect = document.getElementById("category");
    const subcategorySelect = document.getElementById("subcategory");
    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

    let selectedCategory = categorySelect.value;
    let selectedSubcategory = subcategorySelect.value;

    if (selectedCategory === "" && selectedSubcategory === "") {
        // Display all products from all categories and subcategories
        data.katalogs.forEach(category => {
            if (category.apakškategorijas && Array.isArray(category.apakškategorijas)) {
                category.apakškategorijas.forEach(subcategory => {
                    subcategory.produkti.forEach(product => {
                        createProductCard(product, productList);
                    });
                });
            } else if (category.produkti && Array.isArray(category.produkti)) {
                // If the category has no subcategories but has products
                category.produkti.forEach(product => {
                    createProductCard(product, productList);
                });
            }
        });
    } else if (selectedCategory !== "" && selectedSubcategory === "") {
        // Display all products from the selected category
        let category = data.katalogs[selectedCategory];
        if (category.apakškategorijas && Array.isArray(category.apakškategorijas)) {
            category.apakškategorijas.forEach(subcategory => {
                subcategory.produkti.forEach(product => {
                    createProductCard(product, productList);
                });
            });
        } else if (category.produkti && Array.isArray(category.produkti)) {
            // If the selected category has no subcategories but has products
            category.produkti.forEach(product => {
                createProductCard(product, productList);
            });
        }
    } else if (selectedCategory !== "" && selectedSubcategory !== "") {
        // Display products from the selected subcategory
        let category = data.katalogs[selectedCategory];
        if (category.apakškategorijas && Array.isArray(category.apakškategorijas)) {
            let products = category.apakškategorijas[selectedSubcategory].produkti;
            products.forEach(product => {
                createProductCard(product, productList);
            });
        }
    }
}

function createProductCard(product, productList) {
    let productCard = document.createElement("div");
    productCard.classList.add("product");

    productCard.innerHTML = `
        <img src="${product.bilde || 'images/missingimage.jpeg'}" alt="${product.nosaukums}">
        <h3>${product.nosaukums}</h3>
        <div class="details">
            ${product.apraksts ? `<p>${product.apraksts}</p>` : ""}
            ${product.dozēšana ? `<p><strong>Dozēšana:</strong> ${product.dozēšana}</p>` : ""}
            ${product.priekšrocības && Array.isArray(product.priekšrocības) ? `
                <p><strong>Priekšrocības:</strong></p>
                <ul>
                    ${product.priekšrocības.map(item => `<li>${item}</li>`).join('')}
                </ul>
            ` : ""}

           ${product.pielietojums && Array.isArray(product.pielietojums) ? `
                <p><strong>Pielietojums:</strong></p>
                <ul>
                    ${product.pielietojums.map(item => `<li>${item}</li>`).join('')}
                </ul>
            ` : ""}
           ${product.sastāvs && Array.isArray(product.sastāvs) ? `
                <p><strong>Sastāvs:</strong></p>
                <ul>
                    ${product.sastāvs.map(item => `<li>${item}</li>`).join('')}
                </ul>
            ` : ""}

            ${product.mazgāšanastemperatūra ? `<p><strong>Mazgāšanas temperatūra:</strong> ${product.mazgāšanastemperatūra}</p>` : ""}
            ${product.iepakojums ? `<p><strong>Iepakojums:</strong> ${product.iepakojums}</p>` : ""}
        </div>
        <button class="show-more" onclick="toggleDetails(this)">Parādīt vairāk</button>

    `;

    productList.appendChild(productCard);
}
document.getElementById("category").addEventListener("change", function() {
    displayProducts();
});
document.getElementById("subcategory").addEventListener("change", function() {
    displayProducts();
});

function toggleDetails(button) {
    let details = button.previousElementSibling;
    if (details.style.display === "block") {
        details.style.display = "none";
        button.textContent = "Parādīt vairāk";
    } else {
        details.style.display = "block";
        button.textContent = "Parādīt mazāk";
    }
}
