/* ==========================================
   SURIYA ELECTRICAL
   script.js - Part A-1
========================================== */

// Firebase
import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Product List
let products = [];

// Shopping Cart
let cart = [];

// HTML Elements
const productContainer = document.getElementById("productContainer");
const search = document.getElementById("search");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const total = document.getElementById("total");
const totalItems = document.getElementById("totalItems");
const grandTotal = document.getElementById("grandTotal");
const billContainer = document.getElementById("billContainer");
const billTotal = document.getElementById("billTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderForm = document.getElementById("orderForm");
/* ==========================================
   PART A-2
   Display Products
========================================== */

function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML = `
            <h3 style="text-align:center;">
                No Products Available
            </h3>
        `;

        return;
    }

    productList.forEach(product => {

        productContainer.innerHTML += `

        <div class="product">

            <img src="${product.image}"
                 alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="price">
                    ₹${product.price}
                </p>

                <p class="${product.stock ? 'stock' : 'out-stock'}">

                    ${product.stock ? "In Stock" : "Out of Stock"}

                </p>

                <button
                    onclick="addToCart('${product.id}')"
                    ${product.stock ? "" : "disabled"}>

                    Add to Cart

                </button>

            </div>

        </div>

        `;

    });

}
/* ==========================================
   PART A-3
   Load Products From Firestore
========================================== */

async function loadProducts() {

    try {

        products = [];

        const querySnapshot = await getDocs(
            collection(db, "products")
        );

        querySnapshot.forEach((doc) => {

            products.push({
                id: doc.id,
                ...doc.data()
            });

        });

        displayProducts(products);

    } catch (error) {

        console.error("Error loading products:", error);

        productContainer.innerHTML = `
            <h3 style="text-align:center;color:red;">
                Failed to load products
            </h3>
        `;

    }

}
/* ==========================================
   PART A-4
   Search Products
========================================== */

search.addEventListener("input", function () {

    const searchText = this.value
        .trim()
        .toLowerCase();

    if (searchText === "") {

        displayProducts(products);

        return;

    }

    const filteredProducts = products.filter(product => {

        return product.name
            .toLowerCase()
            .includes(searchText);

    });

    displayProducts(filteredProducts);

});
/* ==========================================
   PART B-1
   Add Product To Cart
========================================== */

function addToCart(id){

    const product = products.find(item => item.id === id);

    if(!product){

        alert("Product not found.");

        return;

    }

    const existing = cart.find(item => item.id === id);

    if(existing){

        existing.qty++;

    }else{

        cart.push({

            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            qty: 1

        });

    }

    updateCart();

}
/* ==========================================
   PART B-2
   Update Shopping Cart
========================================== */

function updateCart(){

    cartItems.innerHTML = "";

    let amount = 0;

    let items = 0;

    if(cart.length === 0){

        cartItems.innerHTML =
        "<p>Your cart is empty.</p>";

        cartCount.innerText = 0;
        total.innerText = 0;
        totalItems.innerText = 0;
        grandTotal.innerText = 0;

        return;

    }

    cart.forEach(item=>{

        amount += item.price * item.qty;

        items += item.qty;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" width="60">

            <div>

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

            </div>

            <div>

                <button onclick="decreaseQty('${item.id}')">-</button>

                <strong>${item.qty}</strong>

                <button onclick="increaseQty('${item.id}')">+</button>

                <button onclick="removeItem('${item.id}')">

                    Remove

                </button>

            </div>

        </div>

        `;

    });

    cartCount.innerText = items;

    total.innerText = amount;

    totalItems.innerText = items;

    grandTotal.innerText = amount;

}
/* ==========================================
   PART B-3
   Cart Controls
========================================== */

// Increase Quantity
function increaseQty(id){

    const item = cart.find(product => product.id === id);

    if(item){

        item.qty++;

        updateCart();
        updateBill();

    }

}


// Decrease Quantity
function decreaseQty(id){

    const item = cart.find(product => product.id === id);

    if(!item) return;

    if(item.qty > 1){

        item.qty--;

    }else{

        removeItem(id);
        return;

    }

    updateCart();
    updateBill();

}


// Remove Product
function removeItem(id){

    cart = cart.filter(product => product.id !== id);

    updateCart();
    updateBill();

}
/* ==========================================
   PART B-4
   Bill Preview
========================================== */

function updateBill(){

    billContainer.innerHTML = "";

    let totalAmount = 0;

    if(cart.length === 0){

        billContainer.innerHTML =
        "<p>No products selected.</p>";

        billTotal.innerText = "0";

        return;

    }

    cart.forEach(item=>{

        const itemTotal = item.price * item.qty;

        totalAmount += itemTotal;

        billContainer.innerHTML += `

        <div class="bill-row">

            <span>

                ${item.name}
                × ${item.qty}

            </span>

            <span>

                ₹${itemTotal}

            </span>

        </div>

        `;

    });

    billTotal.innerText = totalAmount;

}


// Checkout Button

checkoutBtn.addEventListener("click",()=>{

    updateBill();

    document.getElementById("checkoutPage")
    .scrollIntoView({

        behavior:"smooth"

    });

});
/* ==========================================
   PART C-1
   Checkout & Save Order
========================================== */

orderForm.addEventListener("submit", async function(e){

    e.preventDefault();

    if(cart.length === 0){

        alert("Your cart is empty.");

        return;

    }

    const customerName =
    document.getElementById("customerName").value;

    const customerPhone =
    document.getElementById("customerPhone").value;

    const customerAddress =
    document.getElementById("customerAddress").value;

    let totalAmount = 0;

    let orderProducts = [];

    cart.forEach(item=>{

        totalAmount += item.price * item.qty;

        orderProducts.push({

            name:item.name,
            price:item.price,
            quantity:item.qty,
            total:item.price * item.qty

        });

    });

    try{

        await addDoc(collection(db,"orders"),{

            customerName:customerName,

            mobile:customerPhone,

            address:customerAddress,

            paymentMethod:"Cash on Delivery",

            products:orderProducts,

            totalItems:cart.length,

            totalAmount:totalAmount,

            status:"Pending",

            date:new Date()

        });

        alert("Order placed successfully!");

        cart=[];

        updateCart();

        updateBill();

        orderForm.reset();

    }

    catch(error){

        console.error(error);

        alert("Failed to place order.");

    }

});
/* ==========================================
   PART E-1
   Print Bill
========================================== */

window.printBill = function(){

    const customerName =
    document.getElementById("customerName").value;

    const customerPhone =
    document.getElementById("customerPhone").value;

    const customerAddress =
    document.getElementById("customerAddress").value;

    let billWindow = window.open("", "_blank");

    let itemsHTML = "";
    let total = 0;

    cart.forEach(item=>{

        const itemTotal = item.price * item.qty;

        total += itemTotal;

        itemsHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₹${item.price}</td>
            <td>₹${itemTotal}</td>
        </tr>
        `;

    });

    billWindow.document.write(`

    <html>

    <head>

    <title>Invoice</title>

    <style>

    body{
        font-family:Arial;
        padding:20px;
    }

    table{
        width:100%;
        border-collapse:collapse;
    }

    table,th,td{
        border:1px solid black;
    }

    th,td{
        padding:10px;
        text-align:center;
    }

    </style>

    </head>

    <body>

    <h2>SURIYA ELECTRICAL</h2>

    <p>679/6 Main Road,<br>
    Vickramasingapuram,<br>
    Tirunelveli.</p>

    <hr>

    <h3>Customer Details</h3>

    <p>Name : ${customerName}</p>

    <p>Phone : ${customerPhone}</p>

    <p>Address : ${customerAddress}</p>

    <hr>

    <table>

    <tr>

    <th>Product</th>

    <th>Qty</th>

    <th>Rate</th>

    <th>Total</th>

    </tr>

    ${itemsHTML}

    </table>

    <h2>Total : ₹${total}</h2>

    <p>Payment : Cash on Delivery</p>

    </body>

    </html>

    `);

    billWindow.document.close();

    billWindow.print();

}
/* ==========================================
   PART E-2
   Language Switch
========================================== */

const language = {

en:{

title:"SURIYA ELECTRICAL",

welcome:"Welcome to SURIYA ELECTRICAL",

products:"Products",

cart:"Shopping Cart",

checkout:"Checkout"

},

ta:{

title:"சூரியா எலக்ட்ரிக்கல்",

welcome:"சூரியா எலக்ட்ரிக்கலுக்கு வரவேற்கிறோம்",

products:"பொருட்கள்",

cart:"வாங்கும் கூடை",

checkout:"பணம் செலுத்துதல்"

}

};

window.setLanguage=function(lang){

document.getElementById("shopTitle").innerText=
language[lang].title;

document.getElementById("welcomeText").innerText=
language[lang].welcome;

document.getElementById("productTitle").innerText=
language[lang].products;

document.getElementById("cartTitle").innerText=
language[lang].cart;

document.getElementById("checkoutTitle").innerText=
language[lang].checkout;

}

loadProducts();
loadOrders();
updateDashboard();
