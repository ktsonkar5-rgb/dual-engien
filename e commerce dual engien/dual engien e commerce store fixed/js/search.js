/* =========================================
   NOVA MARKET
   ADVANCED SEARCH SYSTEM
   PART 10
========================================= */


/* =========================================
   CONFIGURATION
========================================= */

const API_URL = "http://localhost:5000/api";


/* =========================================
   DOM ELEMENTS
========================================= */

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const searchResults =
    document.getElementById("searchResults");

const resultsTitle =
    document.getElementById("resultsTitle");

const resultsCount =
    document.getElementById("resultsCount");


/* =========================================
   SEARCH STATE
========================================= */

let allProducts = [];

let currentQuery =
    new URLSearchParams(
        window.location.search
    ).get("q") || "";


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return "₹" +

        Number(price || 0)
            .toLocaleString("en-IN");

}


/* =========================================
   NORMALIZE TEXT
========================================= */

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .trim();

}


/* =========================================
   CREATE SEARCHABLE TEXT
========================================= */

function getSearchableText(product) {

    return [

        product.name,

        product.brand,

        product.category,

        product.description,

        product.model,

        product.keywords,

        product.store,

        product.condition,

        product.color,

        product.storage,

        product.ram,

        product.processor

    ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();

}


/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts() {

    try {

        searchResults.innerHTML = `

            <div class="search-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>

                    Loading products...

                </p>

            </div>

        `;


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


        allProducts =

            Array.isArray(data)

                ? data

                : data.products || [];


        if (searchInput) {

            searchInput.value =

                currentQuery;

        }


        performSearch(

            currentQuery

        );


    } catch (error) {

        console.error(

            "SEARCH ERROR:",

            error

        );


        searchResults.innerHTML = `

            <div class="search-error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h2>

                    Unable to load products

                </h2>

                <p>

                    Please make sure your backend server is running.

                </p>

            </div>

        `;

    }

}


/* =========================================
   ADVANCED SEARCH
========================================= */

function performSearch(query) {

    const cleanQuery =

        normalizeText(query);


    let results;


    if (!cleanQuery) {

        results = allProducts;

    } else {

        const searchWords =

            cleanQuery

                .split(/\s+/)

                .filter(Boolean);


        results =

            allProducts.filter(

                product => {

                    const searchableText =

                        getSearchableText(

                            product

                        );


                    return searchWords.every(

                        word =>

                            searchableText.includes(

                                word

                            )

                    );

                }

            );

    }


    if (resultsTitle) {

        resultsTitle.textContent =

            cleanQuery

                ? `Results for "${query}"`

                : "All Products";

    }


    if (resultsCount) {

        resultsCount.textContent =

            `${results.length} product${

                results.length !== 1

                    ? "s"

                    : ""

            }`;

    }


    displayResults(

        results

    );

}


/* =========================================
   DISPLAY RESULTS
========================================= */

function displayResults(products) {

    if (!searchResults) return;


    searchResults.innerHTML = "";


    if (

        !products ||

        products.length === 0

    ) {

        searchResults.innerHTML = `

            <div class="no-results">

                <div class="no-results-icon">

                    <i class="fa-solid fa-box-open"></i>

                </div>

                <h2>

                    No products found

                </h2>

                <p>

                    Try searching for another keyword.

                </p>

                <a href="index.html">

                    Return to Store

                </a>

            </div>

        `;


        return;

    }


    products.forEach(

        product => {

            const productId =

                product._id;


            const card =

                document.createElement(

                    "article"

                );


            card.className =

                "search-product-card";


            const image =

                product.image ||

                "https://via.placeholder.com/600x600?text=Product";


            card.innerHTML = `

                <a

                    href="product.html?id=${productId}"

                    class="search-product-image"

                >

                    <span class="quality-badge">

                        Quality Checked

                    </span>


                    <img

                        src="${image}"

                        alt="${product.name || "Product"}"

                        loading="lazy"

                        onerror="

                            this.src=

                            'https://via.placeholder.com/600x600?text=Product'

                        "

                    >

                </a>


                <div class="search-product-info">

                    <span class="search-product-brand">

                        ${product.brand || "NOVA MARKET"}

                    </span>


                    <h3>

                        ${product.name || "Unnamed Product"}

                    </h3>


                    <p class="search-product-category">

                        ${product.category || "General"}

                    </p>


                    <div class="search-product-bottom">

                        <strong>

                            ${formatPrice(product.price)}

                        </strong>


                        <a

                            href="product.html?id=${productId}"

                            class="view-product-btn"

                        >

                            View Details

                            <i class="fa-solid fa-arrow-right"></i>

                        </a>

                    </div>

                </div>

            `;


            searchResults.appendChild(

                card

            );

        }

    );

}


/* =========================================
   EXECUTE SEARCH
========================================= */

function executeSearch() {

    const query =

        searchInput?.value.trim() || "";


    const newURL =

        query

            ? `search.html?q=${encodeURIComponent(query)}`

            : "search.html";


    window.history.pushState(

        {},

        "",

        newURL

    );


    currentQuery = query;


    performSearch(

        query

    );

}


/* =========================================
   SEARCH BUTTON
========================================= */

searchButton?.addEventListener(

    "click",

    executeSearch

);


/* =========================================
   ENTER KEY
========================================= */

searchInput?.addEventListener(

    "keydown",

    event => {

        if (

            event.key === "Enter"

        ) {

            executeSearch();

        }

    }

);


/* =========================================
   SUGGESTIONS
========================================= */

document

    .querySelectorAll(

        "[data-search]"

    )

    .forEach(

        button => {

            button.addEventListener(

                "click",

                () => {

                    const query =

                        button.dataset.search;


                    if (searchInput) {

                        searchInput.value =

                            query;

                    }


                    executeSearch();

                }

            );

        }

    );


/* =========================================
   BROWSER BACK/FORWARD SUPPORT
========================================= */

window.addEventListener(

    "popstate",

    () => {

        const params =

            new URLSearchParams(

                window.location.search

            );


        currentQuery =

            params.get("q") || "";


        if (searchInput) {

            searchInput.value =

                currentQuery;

        }


        performSearch(

            currentQuery

        );

    }

);


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(

    "DOMContentLoaded",

    loadProducts

);


console.log(

    "NOVA MARKET Advanced Search System Loaded"

);