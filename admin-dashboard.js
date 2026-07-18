
const API_URL = "/api";
const ADMIN_TOKEN_KEY = "novamarket-admin-token";
const token = localStorage.getItem(ADMIN_TOKEN_KEY);

if (!token) {
    window.location.replace("admin-login.html");
    throw new Error("Admin authentication required");
}

const $ = (selector) => document.querySelector(selector);
const productsTable = $("#adminProductTable");
const form = $("#productForm");
const message = $("#productMessage");
const submitButton = form?.querySelector("button[type='submit']");
let products = [];
let editingId = null;

function headers() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

function price(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[char]));
}

function toast(text, error = false) {
    let el = document.querySelector(".admin-toast");
    if (!el) {
        el = document.createElement("div");
        el.className = "admin-toast";
        document.body.appendChild(el);
    }
    el.textContent = text;
    el.className = `admin-toast ${error ? "error" : ""}`;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 3500);
}

function showFormMessage(text, type = "success") {
    if (!message) return;
    message.textContent = text;
    message.style.color = type === "success" ? "#8de0d5" : "#ff7777";
}

function updateStats() {
    $("#totalProducts").textContent = products.length;
    $("#electronicsProducts").textContent =
        products.filter(p => String(p.store).toLowerCase() === "electronics").length;
    $("#ridingProducts").textContent =
        products.filter(p => String(p.store).toLowerCase() === "riding").length;
}

function renderProducts() {
    if (!productsTable) return;
    if (!products.length) {
        productsTable.innerHTML = `
            <tr><td colspan="8">
                <div class="empty-products">
                    <i class="fa-solid fa-box-open"></i>
                    <p>No products found.</p>
                </div>
            </td></tr>`;
        return;
    }

    productsTable.innerHTML = products.map(product => {
        const id = product._id;
        const store = String(product.store || "electronics").toLowerCase();
        const featured = product.featured === true || product.featured === "true";
        const inStock = product.inStock !== false;
        const image = escapeHTML(product.image || "https://via.placeholder.com/200?text=Product");

        return `
        <tr>
            <td><img class="admin-product-image" src="${image}" alt="${escapeHTML(product.name)}"
                onerror="this.src='https://via.placeholder.com/200?text=Product'"></td>
            <td>
                <strong>${escapeHTML(product.name || "Unnamed Product")}</strong><br>
                <small>${escapeHTML(product.brand || "No Brand")}</small>
            </td>
            <td>${escapeHTML(product.category || "General")}</td>
            <td><span class="store-badge ${store}">${store}</span></td>
            <td><strong>${price(product.price)}</strong></td>
            <td>${featured ? '<span class="featured-badge"><i class="fa-solid fa-star"></i> Featured</span>' : "—"}</td>
            <td><span class="status-badge ${inStock ? "in-stock" : "out-stock"}">${inStock ? "In Stock" : "Out of Stock"}</span></td>
            <td>
                <div class="product-actions">
                    <button class="action-btn edit-btn" data-id="${id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn delete-btn" data-id="${id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join("");
}

async function loadProducts() {
    if (productsTable) {
        productsTable.innerHTML = `<tr><td colspan="8">Loading products...</td></tr>`;
    }
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load products");
        products = Array.isArray(data) ? data : (data.products || []);
        updateStats();
        renderProducts();
    } catch (error) {
        console.error(error);
        if (productsTable) productsTable.innerHTML = `<tr><td colspan="8">Unable to load products. Check your backend server.</td></tr>`;
        toast(error.message, true);
    }
}

function getFormData() {
    return {
        name: $("#productName").value.trim(),
        brand: $("#productBrand").value.trim(),
        model: $("#productModel").value.trim(),
        price: Number($("#productPrice").value),
        category: $("#productCategory").value.trim(),
        store: $("#productStore").value,
        image: $("#productImage").value.trim(),
        keywords: $("#productKeywords").value.trim(),
        description: $("#productDescription").value.trim(),
        featured: $("#productFeatured").checked,
        inStock: $("#productInStock").checked
    };
}

function validateProduct(data) {
    if (!data.name || !data.category || !data.image || !Number.isFinite(data.price) || data.price < 0) {
        return "Please complete the required product fields correctly.";
    }
    try { new URL(data.image); } catch { return "Please enter a valid image URL."; }
    return null;
}

function resetForm() {
    form?.reset();
    $("#productInStock").checked = true;
    editingId = null;
    if (submitButton) {
        submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
    }
    showFormMessage("");
}

form?.addEventListener("submit", async event => {
    event.preventDefault();
    const data = getFormData();
    const validationError = validateProduct(data);
    if (validationError) {
        showFormMessage(validationError, "error");
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
        const response = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: headers(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Save failed");

        showFormMessage(editingId ? "Product updated successfully!" : "Product added successfully!");
        toast(editingId ? "Product updated successfully" : "Product added successfully");
        resetForm();
        await loadProducts();
    } catch (error) {
        showFormMessage(error.message, "error");
        toast(error.message, true);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = editingId
            ? '<i class="fa-solid fa-pen"></i> Update Product'
            : '<i class="fa-solid fa-plus"></i> Add Product';
    }
});

function startEdit(product) {
    editingId = product._id;
    $("#productName").value = product.name || "";
    $("#productBrand").value = product.brand || "";
    $("#productModel").value = product.model || "";
    $("#productPrice").value = product.price ?? "";
    $("#productCategory").value = product.category || "";
    $("#productStore").value = product.store || "electronics";
    $("#productImage").value = product.image || "";
    $("#productKeywords").value = product.keywords || "";
    $("#productDescription").value = product.description || "";
    $("#productFeatured").checked = !!product.featured;
    $("#productInStock").checked = product.inStock !== false;
    submitButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Product';
    showFormMessage(`Editing: ${product.name}`);
    $("#addProductSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteProduct(id) {
    const product = products.find(p => String(p._id) === String(id));
    if (!product || !confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
            headers: headers()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Delete failed");
        toast("Product deleted successfully");
        await loadProducts();
    } catch (error) {
        toast(error.message, true);
    }
}

productsTable?.addEventListener("click", event => {
    const edit = event.target.closest(".edit-btn");
    const del = event.target.closest(".delete-btn");
    if (edit) {
        const product = products.find(p => String(p._id) === String(edit.dataset.id));
        if (product) startEdit(product);
    }
    if (del) deleteProduct(del.dataset.id);
});

window.logoutAdmin = function() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem("novamarket-admin");
    window.location.replace("admin-login.html");
};

document.addEventListener("DOMContentLoaded", loadProducts);
