/* =========================================================
   NOVA MARKET — COMPLETE APP SYSTEM
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = "http://localhost:5000/api";

const WHATSAPP_NUMBER = "918448502537";

const CART_STORAGE_KEY = "novamarket-cart";

const WISHLIST_STORAGE_KEY = "novamarket-wishlist";

const STORE_STORAGE_KEY = "novamarket-store";

const MAX_FEATURED_PRODUCTS = 8;


/* =========================================================
   STATE
========================================================= */

let allProducts = [];

let currentStore =

    localStorage.getItem(STORE_STORAGE_KEY)

    || "electronics";


let cart = [];

let wishlist = [];

try {

    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    cart = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(cart)) cart = [];

} catch (error) {

    console.warn("Invalid cart data was reset.", error);

    cart = [];

}

try {

    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

    wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    if (!Array.isArray(wishlist)) wishlist = [];

} catch (error) {

    console.warn("Invalid wishlist data was reset.", error);

    wishlist = [];

}


/* =========================================================
   HELPERS
========================================================= */

const $ = selector =>

    document.querySelector(selector);


const $$ = selector =>

    [...document.querySelectorAll(selector)];


const body = document.body;


const productsCarousel =

    $("#productsCarousel");


function escapeHTML(value) {

    return String(value ?? "")

        .replace(/[&<>"']/g, character => ({

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        }[character]));

}


function formatPrice(value) {

    return `₹${Number(value || 0).toLocaleString("en-IN")}`;

}


/* =========================================================
   STORE CONFIGURATION
========================================================= */

const storeConfig = {

    electronics: {

        badge: "INDIA'S TRUSTED DIGITAL MARKETPLACE",

        title: "Better Devices.<br><span>Better Value.</span>",

        description:

            "Discover quality-checked refurbished smartphones, laptops, tablets and premium gadgets at prices you'll love.",

        button: "Explore Electronics",

        categoryTitle: "Electronics",

        brandTitle: "Electronics"

    },


    riding: {

        badge: "BUILT FOR THE RIDERS WHO GO FURTHER",

        title: "Ride Further.<br><span>Ride Better.</span>",

        description:

            "Discover premium helmets, riding gear and quality motorcycle accessories built for every journey.",

        button: "Explore Riding Gear",

        categoryTitle: "Riding Gear",

        brandTitle: "Riding"

    }

};


/* =========================================================
   MANUAL STORE BRANDS
========================================================= */

const storeBrands = {

    electronics: [

        {

            name: "APPLE",

            subtitle: "Starting from ₹8,999"

        },

        {

            name: "SAMSUNG",

            subtitle: "Starting from ₹5,999"

        },

        {

            name: "ONEPLUS",

            subtitle: "Starting from ₹9,999"

        },

        {

            name: "DELL",

            subtitle: "Premium Laptops"

        },

        {

            name: "HP",

            subtitle: "Powerful Computing"

        },

        {

            name: "LENOVO",

            subtitle: "Smart Technology"

        },

        {

            name: "XIAOMI",

            subtitle: "Smart Devices"

        },

        {

            name: "SONY",

            subtitle: "Premium Electronics"

        }

    ],


    riding: [

        {

            name: "STUDDS",

            subtitle: "Starting from ₹999"

        },

        {

            name: "SMK",

            subtitle: "Premium Helmets"

        },

        {

            name: "AXOR",

            subtitle: "Rider Protection"

        },

        {

            name: "MT",

            subtitle: "Premium Helmets"

        },

        {

            name: "RYNOX",

            subtitle: "Riding Gear"

        },

        {

            name: "SOLACE",

            subtitle: "Adventure Gear"

        },

        {

            name: "VIATERRA",

            subtitle: "Motorcycle Luggage"

        },

        {

            name: "ROYAL ENFIELD",

            subtitle: "Riding Essentials"

        }

    ]

};


/* =========================================================
   PRODUCT FILTERING
========================================================= */

function currentProducts() {

    return allProducts.filter(product =>

        String(product.store || "")

            .toLowerCase()

            === currentStore

    );

}


function featuredProducts() {

    return currentProducts()

        .filter(product =>

            product.featured === true

            || product.featured === "true"

        )

        .slice(0, MAX_FEATURED_PRODUCTS);

}


/* =========================================================
   UPDATE STORE UI
========================================================= */

function updateStoreUI() {

    const config =

        storeConfig[currentStore];


    if (!config) {

        currentStore = "electronics";

        localStorage.setItem(

            STORE_STORAGE_KEY,

            currentStore

        );

        return updateStoreUI();

    }


    const heroBadge =

        $("#heroBadgeText");


    const heroTitle =

        $("#heroTitle");


    const heroDescription =

        $("#heroDescription");


    const heroPrimaryText =

        $("#heroPrimaryText");


    const categoryHeading =

        $("#categoryHeading");


    const brandHeading =

        $("#brandHeading");


    const productHeading =

        $("#productHeading");


    if (heroBadge)

        heroBadge.textContent = config.badge;


    if (heroTitle)

        heroTitle.innerHTML = config.title;


    if (heroDescription)

        heroDescription.textContent =

            config.description;


    if (heroPrimaryText)

        heroPrimaryText.textContent =

            config.button;


    if (categoryHeading)

        categoryHeading.textContent =

            config.categoryTitle;


    if (brandHeading)

        brandHeading.textContent =

            config.brandTitle;


    if (productHeading)

        productHeading.textContent =

            `${config.categoryTitle} Featured Products`;


    body.classList.toggle(

        "riding-mode",

        currentStore === "riding"

    );


    $("#storeToggle")?.classList.toggle(

        "riding-active",

        currentStore === "riding"

    );


    $$(".store-option").forEach(option => {

        option.classList.toggle(

            "active",

            option.dataset.store === currentStore

        );

    });


    displayCategories();

    displayBrands();

    displayProducts(featuredProducts());

    resetCarousel();

}


/* =========================================================
   CATEGORIES
========================================================= */

function displayCategories() {

    const grid =

        $("#categoryGrid");


    if (!grid) return;


    const categories = [

        ...new Set(

            currentProducts()

                .map(product => product.category)

                .filter(Boolean)

        )

    ];


    if (!categories.length) {

        grid.innerHTML = `

            <div class="no-products">

                No categories available.

            </div>

        `;

        return;

    }


    grid.innerHTML =

        categories.map(category => `

            <button

                class="category-card"

                type="button"

                data-category="${escapeHTML(category)}"

            >

                <div class="category-card-image">

                    <i class="fa-solid fa-box"></i>

                </div>


                <div class="category-card-content">

                    <h3>

                        ${escapeHTML(category)}

                    </h3>


                    <span>

                        Explore Products

                        <i class="fa-solid fa-arrow-right"></i>

                    </span>

                </div>

            </button>

        `).join("");


    $$(".category-card").forEach(card => {

        card.addEventListener("click", () => {

            const category =

                card.dataset.category;


            window.location.href =

                `search.html?q=${encodeURIComponent(category)}`;

        });

    });

}


/* =========================================================
   BRANDS
========================================================= */

function displayBrands() {

    const brandGrid =

        $("#brandGrid");


    if (!brandGrid) {

        console.warn(

            "brandGrid not found in index.html"

        );

        return;

    }


    const brands =

        storeBrands[currentStore] || [];


    brandGrid.innerHTML =

        brands.map(brand => `

            <button

                class="brand-card"

                type="button"

                data-brand="${escapeHTML(brand.name)}"

            >

                <h3>

                    ${escapeHTML(brand.name)}

                </h3>


                <p>

                    ${escapeHTML(brand.subtitle)}

                </p>


                <i class="fa-solid fa-arrow-right"></i>

            </button>

        `).join("");


    brandGrid

        .querySelectorAll(".brand-card")

        .forEach(card => {

            card.addEventListener("click", () => {

                const brand =

                    card.dataset.brand;


                window.location.href =

                    `search.html?q=${encodeURIComponent(brand)}`;

            });

        });

}


/* =========================================================
   PRODUCTS
========================================================= */

function displayProducts(products) {

    if (!productsCarousel) return;


    if (!products.length) {

        productsCarousel.innerHTML = `

            <div class="no-products">

                <i class="fa-solid fa-box-open"></i>

                <p>

                    No featured products available

                    for this store yet.

                </p>


                <a href="search.html">

                    Browse all products

                </a>

            </div>

        `;

        return;

    }


    productsCarousel.innerHTML =

        products.map(product => {


            const id =

                String(product._id);


            const isLiked =

                wishlist.some(

                    item =>

                        String(item.id)

                        === id

                );


            const image =

                escapeHTML(

                    product.image

                    || "https://via.placeholder.com/600x600?text=Product"

                );


            return `

                <article

                    class="product-card"

                    data-product-id="${id}"

                >

                    <div

                        class="product-image-wrapper"

                    >

                        <span

                            class="product-badge"

                        >

                            Quality Checked

                        </span>


                        <button

                            class="wishlist-btn

                            ${isLiked ? "liked" : ""}"

                            type="button"

                            data-id="${id}"

                            aria-label="Wishlist"

                        >

                            <i class="fa-${

                                isLiked

                                    ? "solid"

                                    : "regular"

                            } fa-heart"></i>

                        </button>


                        <a

                            href="product.html?id=${id}"

                            class="product-image-link"

                        >

                            <img

                                class="product-real-image"

                                src="${image}"

                                alt="${escapeHTML(

                                    product.name

                                    || "Product"

                                )}"

                                loading="lazy"

                                onerror="this.src='https://via.placeholder.com/600x600?text=Product'"

                            >

                        </a>

                    </div>


                    <div class="product-info">

                        <span class="product-brand">

                            ${escapeHTML(

                                product.brand

                                || product.category

                                || "NOVA MARKET"

                            )}

                        </span>


                        <a

                            href="product.html?id=${id}"

                            class="product-title-link"

                        >

                            <h3>

                                ${escapeHTML(

                                    product.name

                                    || "Unnamed Product"

                                )}

                            </h3>

                        </a>


                        <div class="product-rating">

                            <i class="fa-solid fa-star"></i>

                            <span>

                                ${escapeHTML(

                                    product.rating

                                    || "New"

                                )}

                            </span>

                        </div>


                        <div class="product-price">

                            <strong>

                                ${formatPrice(

                                    product.price

                                )}

                            </strong>

                        </div>


                        <div class="product-actions">

                            <button

                                class="add-cart-btn"

                                type="button"

                                data-id="${id}"

                            >

                                <i

                                    class="fa-solid fa-cart-plus"

                                ></i>

                                Add to Cart

                            </button>


                            <a

                                href="product.html?id=${id}"

                                class="buy-btn"

                            >

                                View Details

                            </a>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================================
   CAROUSEL
========================================================= */

function resetCarousel() {

    if (!productsCarousel) return;


    productsCarousel.scrollTo({

        left: 0,

        behavior: "smooth"

    });

}


function moveCarousel(direction) {

    if (!productsCarousel) return;


    const card =

        productsCarousel.querySelector(

            ".product-card"

        );


    if (!card) return;


    const gap = 20;


    const amount =

        card.getBoundingClientRect().width

        + gap;


    const max =

        productsCarousel.scrollWidth

        - productsCarousel.clientWidth;


    let next =

        productsCarousel.scrollLeft

        + direction * amount;


    if (next > max - 5)

        next = 0;


    if (next < 0)

        next = max;


    productsCarousel.scrollTo({

        left: next,

        behavior: "smooth"

    });

}


$("#productNext")?.addEventListener(

    "click",

    () => moveCarousel(1)

);


$("#productPrev")?.addEventListener(

    "click",

    () => moveCarousel(-1)

);


let carouselTimer;


function startCarousel() {

    clearInterval(carouselTimer);


    carouselTimer = setInterval(

        () => moveCarousel(1),

        4500

    );

}


productsCarousel?.addEventListener(

    "mouseenter",

    () => clearInterval(carouselTimer)

);


productsCarousel?.addEventListener(

    "mouseleave",

    startCarousel

);


productsCarousel?.addEventListener(

    "touchstart",

    () => clearInterval(carouselTimer),

    { passive: true }

);


productsCarousel?.addEventListener(

    "touchend",

    startCarousel,

    { passive: true }

);


/* =========================================================
   STORE SWITCHER
========================================================= */

$$(".store-option").forEach(option => {

    option.addEventListener("click", () => {

        const selected =

            option.dataset.store;


        if (!storeConfig[selected]) return;


        currentStore = selected;


        localStorage.setItem(

            STORE_STORAGE_KEY,

            currentStore

        );


        updateStoreUI();

    });

});


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileBtn =

    $("#mobileMenuBtn");


const nav =

    $("#mainNavigation");


mobileBtn?.addEventListener(

    "click",

    () => {

        const open =

            nav?.classList.toggle("active");


        const icon =

            mobileBtn.querySelector("i");


        icon?.classList.toggle(

            "fa-bars",

            !open

        );


        icon?.classList.toggle(

            "fa-xmark",

            open

        );

    }

);


$$(".nav-link").forEach(link => {

    link.addEventListener(

        "click",

        () => {

            nav?.classList.remove("active");

        }

    );

});


/* =========================================================
   SEARCH
========================================================= */

function goToSearch(query) {

    const q =

        String(query || "").trim();


    window.location.href =

        q

            ? `search.html?q=${encodeURIComponent(q)}`

            : "search.html";

}


$("#globalSearch")?.addEventListener(

    "keydown",

    event => {

        if (event.key === "Enter") {

            goToSearch(event.target.value);

        }

    }

);


$("#quickSearchInput")?.addEventListener(

    "keydown",

    event => {

        if (event.key === "Enter") {

            goToSearch(event.target.value);

        }

    }

);


$$(".search-suggestions button")

    .forEach(button => {

        button.addEventListener(

            "click",

            () => {

                goToSearch(button.textContent);

            }

        );

    });


$("#searchToggle")?.addEventListener(

    "click",

    () => {

        $("#searchPanel")?.classList.toggle(

            "active"

        );


        setTimeout(

            () => $("#globalSearch")?.focus(),

            100

        );

    }

);


$("#closeSearch")?.addEventListener(

    "click",

    () => {

        $("#searchPanel")?.classList.remove(

            "active"

        );

    }

);


/* =========================================================
   CART STORAGE
========================================================= */

function saveCart() {

    localStorage.setItem(

        CART_STORAGE_KEY,

        JSON.stringify(cart)

    );

}


function updateCartCount() {

    const count =

        cart.reduce(

            (sum, item) =>

                sum + Number(item.quantity || 0),

            0

        );


    $$(".cart-count")

        .forEach(element => {

            element.textContent = count;

        });

}


function addProductToCart(product) {

    const id =

        String(product._id);


    const existing =

        cart.find(

            item =>

                String(item.id)

                === id

        );


    if (existing) {

        existing.quantity =

            Math.max(

                1,

                Number(existing.quantity || 0)

            ) + 1;

    } else {

        cart.push({

            id,

            name: product.name,

            brand:

                product.brand

                || "NOVA MARKET",

            price:

                Number(product.price)

                || 0,

            image:

                product.image

                || "",

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    renderCart();

    showNotification(

        `${product.name} added to cart`

    );

}


/* =========================================================
   CART DRAWER
========================================================= */

const cartDrawer =

    $("#cartDrawer");


const cartOverlay =

    $("#cartOverlay");


const cartItemsContainer =

    $("#cartItems");


const cartSubtotal =

    $("#cartSubtotal");


const cartTotal =

    $("#cartTotal");


const cartFooter =

    $("#cartFooter");


const emptyCart =

    $("#emptyCart");


function openCart() {

    cartDrawer?.classList.add("active");

    cartOverlay?.classList.add("active");

    body.classList.add("cart-open");

    renderCart();

}


function closeCart() {

    cartDrawer?.classList.remove("active");

    cartOverlay?.classList.remove("active");

    body.classList.remove("cart-open");

}


function renderCart() {

    if (!cartItemsContainer) return;


    if (!cart.length) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">

                    <i class="fa-solid fa-cart-shopping"></i>

                </div>


                <h3>

                    Your cart is empty

                </h3>


                <p>

                    Add some amazing products

                    to your cart.

                </p>

            </div>

        `;


        if (cartFooter)

            cartFooter.style.display = "none";

        if (emptyCart)

            emptyCart.style.display = "flex";


        return;

    }


    if (cartFooter)

        cartFooter.style.display = "block";

    if (emptyCart)

        emptyCart.style.display = "none";


    cartItemsContainer.innerHTML =

        cart.map(item => `

            <div

                class="cart-item"

                data-id="${item.id}"

            >

                <img

                    src="${item.image || "https://via.placeholder.com/100"}"

                    alt="${escapeHTML(item.name)}"

                >


                <div class="cart-item-info">

                    <h4>

                        ${escapeHTML(item.name)}

                    </h4>


                    <span>

                        ${formatPrice(item.price)}

                    </span>


                    <div class="cart-quantity">

                        <button

                            class="quantity-btn"

                            data-action="decrease"

                            data-id="${item.id}"

                        >

                            −

                        </button>


                        <strong>

                            ${item.quantity}

                        </strong>


                        <button

                            class="quantity-btn"

                            data-action="increase"

                            data-id="${item.id}"

                        >

                            +

                        </button>

                    </div>

                </div>


                <button

                    class="remove-cart-item"

                    data-id="${item.id}"

                    aria-label="Remove"

                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `).join("");


    const total =

        cart.reduce(

            (sum, item) =>

                sum

                + Number(item.price)

                * Number(item.quantity),

            0

        );


    if (cartSubtotal)

        cartSubtotal.textContent =

            formatPrice(total);


    if (cartTotal)

        cartTotal.textContent =

            formatPrice(total);

}


function changeCartQuantity(id, amount) {

    const item =

        cart.find(

            product =>

                String(product.id)

                === String(id)

        );


    if (!item) return;


    item.quantity =

        Math.max(

            0,

            Number(item.quantity || 0) + amount

        );


    if (item.quantity <= 0) {

        cart = cart.filter(

            product =>

                String(product.id)

                !== String(id)

        );

    }


    saveCart();

    updateCartCount();

    renderCart();

}


function removeFromCart(id) {

    cart = cart.filter(

        item =>

            String(item.id)

            !== String(id)

    );


    saveCart();

    updateCartCount();

    renderCart();

}


document.addEventListener(

    "click",

    event => {

        const cartButton =

            event.target.closest(

                ".cart-btn"

            );


        if (cartButton) {

            event.preventDefault();

            openCart();

        }

    }

);


$("#cartCloseBtn")?.addEventListener(

    "click",

    closeCart

);


cartOverlay?.addEventListener(

    "click",

    closeCart

);


document.addEventListener(

    "click",

    event => {

        const quantityButton =

            event.target.closest(

                ".quantity-btn"

            );


        if (quantityButton) {

            changeCartQuantity(

                quantityButton.dataset.id,

                quantityButton.dataset.action

                === "increase"

                    ? 1

                    : -1

            );

        }


        const removeButton =

            event.target.closest(

                ".remove-cart-item"

            );


        if (removeButton) {

            removeFromCart(

                removeButton.dataset.id

            );

        }

    }

);


document.addEventListener(

    "keydown",

    event => {

        if (event.key === "Escape") {

            closeCart();

        }

    }

);


/* =========================================================
   WISHLIST
========================================================= */

function saveWishlist() {

    localStorage.setItem(

        WISHLIST_STORAGE_KEY,

        JSON.stringify(wishlist)

    );

}


function toggleWishlist(productId) {

    const id =

        String(productId);


    const product =

        allProducts.find(

            item =>

                String(item._id)

                === id

        );


    if (!product) return;


    const existingIndex =

        wishlist.findIndex(

            item =>

                String(item.id)

                === id

        );


    if (existingIndex >= 0) {

        wishlist.splice(

            existingIndex,

            1

        );


        showNotification(

            "Removed from wishlist"

        );

    } else {

        wishlist.push({

            id,

            name: product.name,

            brand:

                product.brand

                || "NOVA MARKET",

            price:

                Number(product.price)

                || 0,

            image:

                product.image

                || ""

        });


        showNotification(

            "Added to wishlist"

        );

    }


    saveWishlist();

    displayProducts(featuredProducts());

}


document.addEventListener(

    "click",

    event => {

        const wishlistButton =

            event.target.closest(

                ".wishlist-btn"

            );


        if (!wishlistButton) return;


        event.preventDefault();

        event.stopPropagation();


        toggleWishlist(

            wishlistButton.dataset.id

        );

    }

);


/* =========================================================
   ADD TO CART
========================================================= */

document.addEventListener(

    "click",

    event => {

        const button =

            event.target.closest(

                ".add-cart-btn"

            );


        if (!button) return;


        event.preventDefault();


        const product =

            allProducts.find(

                item =>

                    String(item._id)

                    === String(button.dataset.id)

            );


        if (product)

            addProductToCart(product);

    }

);


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(text) {

    const existing =

        document.querySelector(

            ".cart-notification"

        );


    existing?.remove();


    const notification =

        document.createElement("div");


    notification.className =

        "cart-notification";


    notification.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <span>

            ${escapeHTML(text)}

        </span>

    `;


    document.body.appendChild(

        notification

    );


    requestAnimationFrame(

        () => notification.classList.add("show")

    );


    setTimeout(

        () => {

            notification.classList.remove(

                "show"

            );


            setTimeout(

                () => notification.remove(),

                350

            );

        },

        2500

    );

}


/* =========================================================
   FAQ
========================================================= */

$$(".faq-item").forEach(item => {

    const question =

        item.querySelector(

            ".faq-question"

        );


    const answer =

        item.querySelector(

            ".faq-answer"

        );


    question?.addEventListener(

        "click",

        () => {

            const isOpen =

                item.classList.contains(

                    "active"

                );


            $$(".faq-item").forEach(

                faq => {

                    faq.classList.remove(

                        "active"

                    );


                    const faqAnswer =

                        faq.querySelector(

                            ".faq-answer"

                        );


                    if (faqAnswer)

                        faqAnswer.style.maxHeight =

                            null;

                }

            );


            if (!isOpen) {

                item.classList.add(

                    "active"

                );


                if (answer)

                    answer.style.maxHeight =

                        `${answer.scrollHeight}px`;

            }

        }

    );

});


/* =========================================================
   BACK TO TOP
========================================================= */

$("#backToTop")?.addEventListener(

    "click",

    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

);


window.addEventListener(

    "scroll",

    () => {

        $("#backToTop")?.classList.toggle(

            "show",

            window.scrollY > 500

        );

    }

);


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

$("#checkoutBtn")?.addEventListener(

    "click",

    () => {

        if (!cart.length) {

            alert(

                "Your cart is empty."

            );

            return;

        }


        const items =

            cart.map(

                item =>

                    `${item.name} x ${item.quantity} — ${formatPrice(

                        item.price

                        * item.quantity

                    )}`

            ).join("\n");


        const total =

            cart.reduce(

                (sum, item) =>

                    sum

                    + Number(item.price)

                    * Number(item.quantity),

                0

            );


        const message =

            `Hello NOVA MARKET,

I want to place an order.

${items}

Total: ${formatPrice(total)}

Please confirm my order.`;


        window.open(

            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,

            "_blank"

        );

    }

);


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    try {

        const response =

            await fetch(

                `${API_URL}/products`

            );


        const data =

            await response.json();


        if (!response.ok)

            throw new Error(

                data.message

                || "Unable to load products"

            );


        allProducts =

            Array.isArray(data)

                ? data

                : data.products || [];


        updateStoreUI();

        updateCartCount();

        renderCart();

        startCarousel();


    } catch (error) {

        console.error(

            "Product loading error:",

            error

        );


        if (productsCarousel) {

            productsCarousel.innerHTML = `

                <div class="no-products">

                    <i

                        class="fa-solid

                        fa-triangle-exclamation"

                    ></i>


                    <p>

                        Unable to load products.

                        Please check the backend server.

                    </p>

                </div>

            `;

        }

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        updateCartCount();

        renderCart();

        loadProducts();

    }

);


console.log(

    "NOVA MARKET Complete App System Loaded"

);


