let data;

document.addEventListener("DOMContentLoaded", async function() {
    await loadData();
    loadCategories();
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

    if (selectedCategory !== "" && selectedSubcategory !== "") {
        let products = data.katalogs[selectedCategory].apakškategorijas[selectedSubcategory].produkti;

        products.forEach(product => {
            let productCard = document.createElement("div");
            productCard.classList.add("product");

            productCard.innerHTML = `
            <img src="${product.bilde}" alt="${product.nosaukums}">
            <h3>${product.nosaukums}</h3>
            <button class="show-more" onclick="toggleDetails(this)">Parādīt vairāk</button>
            <div class="details">
                ${product.apraksts ? `<p>${product.apraksts}</p>` : ""}
                ${product.iepakojums ? `<p><strong>Iepakojums:</strong> ${product.iepakojums}</p>` : ""}
                ${product.dozēšana ? `<p><strong>Dozēšana:</strong> ${product.dozēšana}</p>` : ""}
                ${product.mazgāšanastemperatūra ? `<p><strong>Mazgāšanas temperatūra:</strong> ${product.mazgāšanastemperatūra}</p>` : ""}
            </div>
        `;

            productList.appendChild(productCard);
        });
    }
}

function toggleDetails(button) {
    let details = button.nextElementSibling;
    if (details.style.display === "block") {
        details.style.display = "none";
        button.textContent = "Parādīt vairāk";
    } else {
        details.style.display = "block";
        button.textContent = "Parādīt mazāk";
    }
}
