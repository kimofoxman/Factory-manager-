const texts = {
    ar: {
        dashboard: "لوحة التحكم",
        storage: "المخزن",
        sales: "المبيعات",
        expenses: "المصروفات",
        reports: "التقارير",
        clients: "العملاء",
        settings: "الإعدادات",
        addProducts: "إضافة  منتجات",
        inventorySearch: "البحث والجرد",
        productName: "اسم المنتج",
        quantity: "الكمية",
        costPrice: "سعر التكلفة",
        sellingPrice: "سعر البيع",
        menuTitle: "القائمة الرئيسية",
        settingsTitle: "إعدادات البرنامج",
        languageLabel: "تغيير اللغة",
        themeLabel: "تغيير اللون",
        saveButton: "حفظ",
        closeButton: "إغلاق",
        generalTab: "عام",
        appearanceTab: "المظهر",
        confirmDelete: "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
        productAdded: "تمت إضافة المنتج بنجاح",
        productEdited: "تم تعديل المنتج بنجاح",
        productDeleted: "تم حذف المنتج بنجاح",
        errorOccurred: "حدث خطأ",
        edit: "تعديل",
        delete: "حذف",
    },
    en: {
        dashboard: "Dashboard",
        storage: "Storage",
        sales: "Sales",
        expenses: "Expenses",
        reports: "Reports",
        clients: "Clients",
        settings: "Settings",
        addProducts: "Add Products",
        inventorySearch: "Inventory Search",
        productName: "Product Name",
        quantity: "Quantity",
        costPrice: "Cost Price",
        sellingPrice: "Selling Price",
        menuTitle: "Main Menu",
        settingsTitle: "Program Settings",
        languageLabel: "Change Language",
        themeLabel: "Change Theme",
        saveButton: "Save",
        closeButton: "Close",
        generalTab: "General",
        appearanceTab: "Appearance",
        confirmDelete: "Are you sure you want to delete this product?",
        productAdded: "Product added successfully",
        productEdited: "Product edited successfully",
        productDeleted: "Product deleted successfully",
        errorOccurred: "An error occurred",
        edit: "Edit",
        delete: "Delete",
    },
};

const sidebarLinks = document.querySelectorAll(".sidebar-menu a");
const sectionTitle = document.getElementById("section-title");
const sectionContent = document.getElementById("section-content");
const settingsModal = document.getElementById("settings-modal");
const languageSelect = document.getElementById("language");
const themeColorInput = document.getElementById("theme-color");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const confirmationModal = document.getElementById("confirmation-modal");
const confirmYesBtn = document.getElementById("confirm-yes");
const confirmNoBtn = document.getElementById("confirm-no");
const notification = document.getElementById("notification");
const notificationIcon = document.getElementById("notification-icon");
const notificationMessage = document.getElementById("notification-message");

let products = []; // Array to store products
let currentEditId = null; // Track which product is being edited
let deleteProductId = null;

// Utility function to show notifications
function showNotification(message, type = "success") {
    notificationMessage.textContent = message;
    notification.classList.remove("error", "success");
    notification.classList.add(type, "show");

    // Set icon based on notification type
    if (type === "success") {
        notificationIcon.className = "fas fa-check-circle";
    } else if (type === "error") {
        notificationIcon.className = "fas fa-times-circle";
    }

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000); // Hide after 3 seconds
}

function generateProductId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ربط الدالة بزر القائمة
menuToggle.addEventListener("click", toggleSidebar);

function toggleSidebar() {
    sidebar.classList.toggle("active");
}

function updateTexts(lang) {
    document.getElementById("menu-title").textContent = texts[lang].menuTitle;
    document.getElementById("settings-title").textContent =
        texts[lang].settingsTitle;
    document.getElementById("language-label").textContent =
        texts[lang].languageLabel;
    document.getElementById("theme-label").textContent = texts[lang].themeLabel;
    document.getElementById("save-button").textContent = texts[lang].saveButton;
    document.getElementById("general-tab").textContent = texts[lang].generalTab;
    document.getElementById("appearance-tab").textContent =
        texts[lang].appearanceTab;

    sidebarLinks.forEach((link) => {
        const section = link.getAttribute("data-section");
        link.querySelector("span").textContent = texts[lang][section];
    });
}

function resetContent() {
    sectionContent.innerHTML = `
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-box"></i> إجمالي المنتجات</h3>
                <p id="total-products">0</p>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-dollar-sign"></i> قيمة المخزون</h3>
                <p id="inventory-value">$0.00</p>
            </div>
            <div class="dashboard-card">
               <!-- Add more cards for sales, expenses, etc. -->
            </div>
        </div>
    `;
    sectionTitle.textContent = texts[document.documentElement.lang].dashboard;
    updateDashboardStats(); // Update the dashboard with actual data
}

function showConfirmationModal(message, yesCallback) {
    document.getElementById("confirmation-message").textContent = message;
    confirmationModal.style.display = "flex";

    confirmYesBtn.onclick = () => {
        yesCallback();
        closeConfirmationModal();
    };

    confirmNoBtn.onclick = closeConfirmationModal;
}

function closeConfirmationModal() {
    confirmationModal.style.display = "none";
}

// Local Storage Functions
function saveProductsToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        renderProductList(); // Re-render the product list after loading
    }
}

function loadSettings() {
    const savedLanguage = localStorage.getItem("language");
    const savedThemeColor = localStorage.getItem("themeColor");

    if (savedLanguage) {
        document.documentElement.lang = savedLanguage;
        languageSelect.value = savedLanguage;
        document.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    }
    if (savedThemeColor) {
        document.body.style.setProperty("--primary-color", savedThemeColor);
        themeColorInput.value = savedThemeColor;
        // Update gradient if needed
        const secondaryColor = adjustColor(savedThemeColor, -20); // Example adjustment
        document.body.style.setProperty("--secondary-color", secondaryColor);
        updateSidebarGradient(savedThemeColor, secondaryColor);
    }
    updateTexts(document.documentElement.lang);
}

function closeSettings() {
    settingsModal.style.display = "none";
}

function saveSettings() {
    const selectedLanguage = languageSelect.value;
    const selectedColor = themeColorInput.value;

    localStorage.setItem("language", selectedLanguage);
    localStorage.setItem("themeColor", selectedColor);

    document.documentElement.lang = selectedLanguage;
    document.dir = selectedLanguage === "ar" ? "rtl" : "ltr";

    document.body.style.setProperty("--primary-color", selectedColor);
    // Calculate a secondary color (e.g., a darker shade)
    const secondaryColor = adjustColor(selectedColor, -20); // Adjust by -20 (darker)
    document.body.style.setProperty("--secondary-color", secondaryColor);

    updateSidebarGradient(selectedColor, secondaryColor);

    updateTexts(selectedLanguage);
    closeSettings();
    showNotification("تم حفظ الإعدادات", "success");
}

function adjustColor(hexColor, amount) {
    let color = hexColor.replace("#", "");
    if (color.length === 3) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    const [r, g, b] = color.match(/.{2}/g).map((x) => parseInt(x, 16));

    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));

    const newHex = [newR, newG, newB]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");

    return `#${newHex}`;
}

function updateSidebarGradient(primary, secondary) {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
}

function renderProductForm() {
    sectionContent.innerHTML = `
        <h2><i class="fas fa-warehouse"></i> ${
            texts[document.documentElement.lang].storage
        }</h2>
        <form id="product-form">
            <div class="input-group">
                <label for="product-name">${
                    texts[document.documentElement.lang].productName
                }:</label>
                <input type="text" id="product-name" name="product-name" required>
            </div>
            <div class="input-group">
                <label for="quantity">${
                    texts[document.documentElement.lang].quantity
                }:</label>
                <input type="number" id="quantity" name="quantity" min="0" required>
            </div>
            <div class="input-group">
                <label for="cost-price">${
                    texts[document.documentElement.lang].costPrice
                }:</label>
                <input type="number" id="cost-price" name="cost-price" step="0.01" required>
            </div>
            <div class="input-group">
                <label for="selling-price">${
                    texts[document.documentElement.lang].sellingPrice
                }:</label>
                <input type="number" id="selling-price" name="selling-price" step="0.01" required>
            </div>
            <button type="submit">
                <i class="fas fa-check"></i> ${
                    currentEditId
                        ? texts[document.documentElement.lang].edit
                        : texts[document.documentElement.lang].addProducts
                }
            </button>
            ${
                currentEditId
                    ? `<button type="button" id="cancel-edit"><i class="fas fa-times"></i> إلغاء</button>`
                    : ""
            }
        </form>
        <h3><i class="fas fa-list"></i> قائمة المنتجات:</h3>
          <input type="text" id="search-input" placeholder="ابحث عن منتج...">
        <table id="product-table">
            <thead>
                <tr>
                    <th>${texts[document.documentElement.lang].productName}</th>
                    <th>${texts[document.documentElement.lang].quantity}</th>
                    <th>${texts[document.documentElement.lang].costPrice}</th>
                    <th>${texts[document.documentElement.lang].sellingPrice}</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody id="product-list">
            </tbody>
        </table>
    `;
    // Add event listeners *after* rendering the form
    const productForm = document.getElementById("product-form");
    productForm.addEventListener("submit", handleProductFormSubmit);

    const cancelEditBtn = document.getElementById("cancel-edit");
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", cancelEdit);
    }

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", handleSearch);

    renderProductList(); // Render the product list after rendering the form and table
}

function renderProductList() {
    const productList = document.getElementById("product-list");
    if (!productList) return; // Important: Check if the element exists

    productList.innerHTML = ""; // Clear existing list

    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.costPrice}</td>
            <td>${product.sellingPrice}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fas fa-edit"></i> ${
                        texts[document.documentElement.lang].edit
                    }
                </button>
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash"></i> ${
                        texts[document.documentElement.lang].delete
                    }
                </button>
            </td>
        `;
        productList.appendChild(row);

        // Attach event listeners directly to the buttons
        row.querySelector(".edit-btn").addEventListener("click", () =>
            editProduct(product.id)
        );
        row.querySelector(".delete-btn").addEventListener("click", () =>
            confirmDelete(product.id)
        );
    });
}

function addProduct(productData) {
    productData.id = generateProductId(); // Generate unique ID
    products.push(productData);
    saveProductsToLocalStorage();
    renderProductList();
    showNotification(texts[document.documentElement.lang].productAdded, "success");
}

function handleProductFormSubmit(event) {
    event.preventDefault();

    const productName = document.getElementById("product-name").value.trim();
    const quantity = parseFloat(document.getElementById("quantity").value);
    const costPrice = parseFloat(document.getElementById("cost-price").value);
    const sellingPrice = parseFloat(document.getElementById("selling-price").value);

    // Input validation (more robust)
    if (
        !productName ||
        isNaN(quantity) ||
        quantity < 0 ||
        isNaN(costPrice) ||
        costPrice < 0 ||
        isNaN(sellingPrice) ||
        sellingPrice < 0
    ) {
        showNotification(
            texts[document.documentElement.lang].errorOccurred +
            ": تأكد من إدخال بيانات صحيحة",
            "error"
        );
        return;
    }

    const productData = {
        name: productName,
        quantity,
        costPrice,
        sellingPrice,
    };

    if (currentEditId) {
        updateProduct(currentEditId, productData);
    } else {
        addProduct(productData);
    }

    // Reset form and edit state
    currentEditId = null;
    renderProductForm();
    updateDashboardStats(); //update dashboard
}

function editProduct(productId) {
    currentEditId = productId;
    const productToEdit = products.find((product) => product.id === productId);

    if (productToEdit) {
        // Re-render the form *before* populating the fields
        renderProductForm();

        // Populate form fields
        document.getElementById("product-name").value = productToEdit.name;
        document.getElementById("quantity").value = productToEdit.quantity;
        document.getElementById("cost-price").value = productToEdit.costPrice;
        document.getElementById("selling-price").value = productToEdit.sellingPrice;
    }
}

function cancelEdit() {
    currentEditId = null;
    renderProductForm();
}

function updateProduct(productId, newData) {
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...newData };
        saveProductsToLocalStorage();
        renderProductList();
        showNotification(texts[document.documentElement.lang].productEdited, "success");
    }
}

function confirmDelete(productId) {
    showConfirmationModal(texts[document.documentElement.lang].confirmDelete, () => {
        deleteProduct(productId);
    });
}

function deleteProduct(productId) {
    products = products.filter(product => product.id !== productId);
    saveProductsToLocalStorage();
    renderProductList();
    showNotification(texts[document.documentElement.lang].productDeleted, 'success');
    updateDashboardStats(); // Update the dashboard
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    renderFilteredProductList(filteredProducts);
}

function renderFilteredProductList(filteredProducts) {
    const productList = document.getElementById('product-list');
        if (!productList) return;

    productList.innerHTML = ''; // Clear existing list

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.costPrice}</td>
            <td>${product.sellingPrice}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fas fa-edit"></i> ${texts[document.documentElement.lang].edit}
                </button>
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash"></i> ${texts[document.documentElement.lang].delete}
                </button>
            </td>
        `;
        productList.appendChild(row);

        row.querySelector('.edit-btn').addEventListener('click', () => editProduct(product.id));
        row.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(product.id));
    });
}

function updateDashboardStats() {
    const totalProducts = products.reduce((sum, product) => sum + product.quantity, 0);
    const inventoryValue = products.reduce((sum, product) => sum + (product.quantity * product.costPrice), 0);

    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('inventory-value').textContent = `$${inventoryValue.toFixed(2)}`;
}

// Event Listeners

// Tab switching (Settings Modal)
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');

        button.classList.add('active');
        document.getElementById(tabId).style.display = 'block';
    });
});

sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        sectionTitle.textContent = texts[document.documentElement.lang][section];

        // Update section content based on selected section
        if (section === 'storage') {
            renderProductForm();
        }
        //  أضف "else" هنا:
        else {
            sectionContent.innerHTML = `<p>مرحبًا بكم في قسم ${texts[document.documentElement.lang][section]}!</p>`;
        }

        if (window.innerWidth <= 768px) {
            toggleSidebar();
        }
    });
});

// Initial setup
window.addEventListener('load', () => {
    loadSettings();
    loadProductsFromLocalStorage();

    // Check if products array is empty, and if so, render the product form
    if (products.length === 0) {
        renderProductForm();
    } else {
        resetContent(); // استدعِ resetContent فقط إذا لم تكن products فارغة
    }
    updateDashboardStats();
});