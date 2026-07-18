/* =========================================
   NOVA MARKET
   PRODUCT DETAILS PAGE
   PART 9.4
========================================= */


/* =========================================
   CONFIGURATION
========================================= */

const API_URL = "http://localhost:5000/api";

const WHATSAPP_NUMBER = "918448502537";

const CART_STORAGE_KEY = "novamarket-cart";


/* =========================================
   GET PRODUCT ID FROM URL
========================================= */

const urlParams = new URLSearchParams(
    window.location.search
);

const productId = urlParams.get("id");


/* =========================================
   DOM ELEMENTS
========================================= */

const productDetails =
    document.getElementById(
        "productDetails"
    );


const relatedProductsContainer =
    document.getElementById(
        "relatedProducts"
    );


const relatedSection =
    document.getElementById(
        "relatedSection"
    );


/* =========================================
   CART
========================================= */

let cart = JSON.parse(

    localStorage.getItem(

        CART_STORAGE_KEY

    )

) || [];


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return "₹" +

        Number(price || 0)

            .toLocaleString(

                "en-IN"

            );

}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    const totalItems = cart.reduce(

        (total, item) => {

            return total +

                Number(

                    item.quantity || 0

                );

        },

        0

    );


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(

        CART_STORAGE_KEY,

        JSON.stringify(cart)

    );

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(

    product,

    quantity

) {

    if (!product) return;


    const id = String(

        product._id ||

        product.id

    );


    const existingProduct = cart.find(

        item =>

            String(item.id) === id

    );


    if (existingProduct) {

        existingProduct.quantity +=

            quantity;

    } else {

        cart.push({

            id: id,

            name: product.name,

            brand:

                product.brand ||

                "NOVA MARKET",

            price:

                Number(

                    product.price

                ) || 0,

            image:

                product.image ||

                "",

            quantity: quantity

        });

    }


    saveCart();


    updateCartCount();


    showNotification(

        "Product added to cart"

    );

}


/* =========================================
   BUY NOW
========================================= */

function buyNow(

    product,

    quantity

) {

    if (!product) return;


    const message =

`Hello NOVA MARKET,

I want to buy this product.

Product: ${product.name}

Brand: ${product.brand || "NOVA MARKET"}

Model: ${product.model || "Not specified"}

Quantity: ${quantity}

Price: ${formatPrice(

        Number(product.price) *

        quantity

    )}

Please confirm availability and order details.`;


    const whatsappURL =

        `https://wa.me/${

            WHATSAPP_NUMBER

        }?text=${encodeURIComponent(

            message

        )}`;


    window.open(

        whatsappURL,

        "_blank"

    );

}


/* =========================================
   DISPLAY PRODUCT
========================================= */

function displayProduct(product) {

    if (!productDetails) return;


    const productImage =

        product.image ||

        "https://via.placeholder.com/700x700?text=Product";


    productDetails.innerHTML = `

        <div class="product-gallery">

            <div class="product-main-image">

                <img

                    src="${productImage}"

                    alt="${product.name}"

                    onerror="

                        this.src=

                        'https://via.placeholder.com/700x700?text=Product'

                    "

                >

            </div>

        </div>


        <div class="product-information">

            <span class="product-brand">

                ${product.brand || "NOVA MARKET"}

            </span>


            <h1>

                ${product.name}

            </h1>


            <div class="product-rating">

                <i class="fa-solid fa-star"></i>

                <span>

                    ${product.rating || "New Product"}

                </span>

            </div>


            <div class="product-price">

                ${formatPrice(product.price)}

            </div>


            <p class="product-description">

                ${product.description ||

                "Premium quality product available at NOVA MARKET."}

            </p>


            <div class="product-meta">

                <div>

                    <strong>

                        Category

                    </strong>

                    <span>

                        ${product.category || "General"}

                    </span>

                </div>


                <div>

                    <strong>

                        Model

                    </strong>

                    <span>

                        ${product.model || "Not specified"}

                    </span>

                </div>


                <div>

                    <strong>

                        Store

                    </strong>

                    <span>

                        ${product.store || "Electronics"}

                    </span>

                </div>

            </div>


            <div class="quantity-section">

                <label>

                    Quantity

                </label>


                <div class="quantity-control">

                    <button

                        id="quantityMinus"

                    >

                        <i class="fa-solid fa-minus"></i>

                    </button>


                    <span

                        id="quantityValue"

                    >

                        1

                    </span>


                    <button

                        id="quantityPlus"

                    >

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>


            <div class="product-actions">

                <button

                    id="addToCartBtn"

                    class="add-to-cart-btn"

                >

                    <i class="fa-solid fa-cart-plus"></i>

                    Add to Cart

                </button>


                <button

                    id="buyNowBtn"

                    class="buy-now-btn"

                >

                    <i class="fa-brands fa-whatsapp"></i>

                    Buy Now

                </button>

            </div>


            <div class="product-benefits">

                <div>

                    <i class="fa-solid fa-shield-halved"></i>

                    <span>

                        Quality Checked

                    </span>

                </div>


                <div>

                    <i class="fa-solid fa-truck"></i>

                    <span>

                        Fast Delivery

                    </span>

                </div>


                <div>

                    <i class="fa-solid fa-headset"></i>

                    <span>

                        Customer Support

                    </span>

                </div>

            </div>

        </div>

    `;


    let quantity = 1;


    const quantityValue =

        document.getElementById(

            "quantityValue"

        );


    const quantityMinus =

        document.getElementById(

            "quantityMinus"

        );


    const quantityPlus =

        document.getElementById(

            "quantityPlus"

        );


    quantityMinus?.addEventListener(

        "click",

        () => {

            if (quantity > 1) {

                quantity--;

                quantityValue.textContent =

                    quantity;

            }

        }

    );


    quantityPlus?.addEventListener(

        "click",

        () => {

            quantity++;

            quantityValue.textContent =

                quantity;

        }

    );


    document

        .getElementById(

            "addToCartBtn"

        )

        ?.addEventListener(

            "click",

            () => {

                addToCart(

                    product,

                    quantity

                );

            }

        );


    document

        .getElementById(

            "buyNowBtn"

        )

        ?.addEventListener(

            "click",

            () => {

                buyNow(

                    product,

                    quantity

                );

            }

        );

}


/* =========================================
   RELATED PRODUCTS
========================================= */

function displayRelatedProducts(

    currentProduct,

    allProducts

) {

    if (

        !relatedProductsContainer

    ) return;


    const related = allProducts

        .filter(product => {

            return (

                String(

                    product._id

                ) !==

                String(

                    currentProduct._id

                )

            );

        })

        .filter(product => {

            return (

                product.category ===

                currentProduct.category

            ) ||

            product.brand ===

            currentProduct.brand;

        })

        .slice(

            0,

            4

        );


    if (

        related.length === 0

    ) {

        relatedSection.style.display =

            "none";

        return;

    }


    relatedProductsContainer.innerHTML = "";


    related.forEach(product => {

        const card =

            document.createElement(

                "article"

            );


        card.className =

            "related-product-card";


        card.innerHTML = `

            <a

                href="product.html?id=${product._id}"

                class="related-image"

            >

                <img

                    src="${product.image || ""}"

                    alt="${product.name}"

                    onerror="

                        this.src=

                        'https://via.placeholder.com/400x400?text=Product'

                    "

                >

            </a>


            <div class="related-info">

                <span>

                    ${product.brand || "NOVA MARKET"}

                </span>


                <h3>

                    ${product.name}

                </h3>


                <strong>

                    ${formatPrice(product.price)}

                </strong>


                <a

                    href="product.html?id=${product._id}"

                    class="view-related"

                >

                    View Product

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

        `;


        relatedProductsContainer.appendChild(

            card

        );

    });

}


/* =========================================
   LOAD PRODUCT
========================================= */

async function loadProduct() {

    if (!productId) {

        showError(

            "Product ID is missing."

        );

        return;

    }


    try {

        const response =

            await fetch(

                `${API_URL}/products`

            );


        if (!response.ok) {

            throw new Error(

                "Unable to load products"

            );

        }


        const data =

            await response.json();


        const products =

            Array.isArray(data)

                ? data

                : data.products || [];


        const product =

            products.find(

                item =>

                    String(

                        item._id

                    ) ===

                    String(

                        productId

                    )

            );


        if (!product) {

            showError(

                "Product not found."

            );

            return;

        }


        displayProduct(product);


        displayRelatedProducts(

            product,

            products

        );


        document.title =

            `${product.name} | NOVA MARKET`;


    } catch (error) {

        console.error(

            error

        );


        showError(

            "Unable to load product. Please check your backend server."

        );

    }

}


/* =========================================
   ERROR MESSAGE
========================================= */

function showError(message) {

    if (!productDetails) return;


    productDetails.innerHTML = `

        <div class="product-error">

            <i class="fa-solid fa-triangle-exclamation"></i>


            <h2>

                ${message}

            </h2>


            <a

                href="index.html"

            >

                Return to Store

            </a>

        </div>

    `;

}


/* =========================================
   NOTIFICATION
========================================= */

function showNotification(message) {

    const notification =

        document.createElement(

            "div"

        );


    notification.className =

        "product-notification";


    notification.innerHTML = `

        <i class="fa-solid fa-check"></i>

        ${message}

    `;


    document.body.appendChild(

        notification

    );


    setTimeout(

        () => {

            notification.classList.add(

                "show"

            );

        },

        50

    );


    setTimeout(

        () => {

            notification.classList.remove(

                "show"

            );


            setTimeout(

                () => {

                    notification.remove();

                },

                300

            );

        },

        2500

    );

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        updateCartCount();

        loadProduct();

    }

);


console.log(

    "NOVA MARKET Product Details System Loaded"

);