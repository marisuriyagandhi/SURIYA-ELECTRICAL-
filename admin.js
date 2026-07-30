/* ===========================================
   SURIYA ELECTRICAL
   admin.js - Part 5A
=========================================== */

import { db, auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let adminProducts = [];

// ===========================
// Admin Login
// ===========================

window.adminLogin = async function(){

    const email =
    document.getElementById("adminName").value.trim();

    const password =
    document.getElementById("adminPassword").value;

    if(email==="" || password===""){

        alert("Enter Email and Password");

        return;

    }

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        document.getElementById("loginPage").style.display="none";

        document.getElementById("dashboard").style.display="block";

        loadProducts();

        loadOrders();

        updateDashboard();

    }

    catch(error){

        alert(error.message);

    }

};


// ===========================
// Logout
// ===========================

window.logout = async function(){

    await signOut(auth);

    document.getElementById("dashboard").style.display="none";

    document.getElementById("loginPage").style.display="block";

};
/* ===========================================
   SURIYA ELECTRICAL
   admin.js - Part 5B
   Load & Display Products
=========================================== */

// Load Products from Firestore
async function loadProducts(){

    adminProducts = [];

    try{

        const snapshot = await getDocs(
            collection(db,"products")
        );

        snapshot.forEach((docSnap)=>{

            adminProducts.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });

        displayProducts();

    }

    catch(error){

        console.log(error);

        alert("Unable to load products.");

    }

}


// Display Products
function displayProducts(){

    const box =
    document.getElementById("adminProducts");

    box.innerHTML = "";

    if(adminProducts.length===0){

        box.innerHTML="<h3>No Products Found</h3>";

        return;

    }

    adminProducts.forEach(product=>{

        box.innerHTML += `

        <div class="product">

            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="price">₹${product.price}</p>

                <p>

                    ${product.stock ? "✅ In Stock" : "❌ Out of Stock"}

                </p>

                <button
                onclick="editProduct('${product.id}')">

                Edit

                </button>

                <button
                onclick="deleteProduct('${product.id}')">

                Delete

                </button>

            </div>

        </div>

        `;

    });

}


// Search Products
document.getElementById("adminSearch")
.addEventListener("input",function(){

    const text =
    this.value.toLowerCase();

    const filtered =
    adminProducts.filter(product=>

        product.name
        .toLowerCase()
        .includes(text)

    );

    const temp = adminProducts;

    adminProducts = filtered;

    displayProducts();

    adminProducts = temp;

});
/* ===========================================
   SURIYA ELECTRICAL
   admin.js - Part 5C
   Add Product
=========================================== */

window.addProduct = async function(){

    const name =
    document.getElementById("productName").value.trim();

    const price =
    Number(document.getElementById("productPrice").value);

    const image =
    document.getElementById("productImage").value.trim();

    const stock =
    document.getElementById("productStock").value === "true";

    if(name==="" || image==="" || price<=0){

        alert("Please fill all product details.");

        return;

    }

    try{

        await addDoc(collection(db,"products"),{

            name:name,

            price:price,

            image:image,

            stock:stock

        });

        alert("Product Added Successfully.");

        document.getElementById("productName").value="";

        document.getElementById("productPrice").value="";

        document.getElementById("productImage").value="";

        document.getElementById("productStock").value="true";

        loadProducts();

        updateDashboard();

    }

    catch(error){

        console.log(error);

        alert("Failed to add product.");

    }

};
/* ===========================================
   SURIYA ELECTRICAL
   admin.js - Part 5D
   Edit & Delete Product
=========================================== */

// Edit Product
window.editProduct = async function(id){

    const product = adminProducts.find(p => p.id === id);

    if(!product) return;

    const newName = prompt("Product Name", product.name);

    if(newName === null) return;

    const newPrice = prompt("Product Price", product.price);

    if(newPrice === null) return;

    const newImage = prompt("Product Image URL", product.image);

    if(newImage === null) return;

    const newStock = confirm(
        "Press OK = In Stock\nPress Cancel = Out of Stock"
    );

    try{

        await updateDoc(doc(db,"products",id),{

            name:newName.trim(),

            price:Number(newPrice),

            image:newImage.trim(),

            stock:newStock

        });

        alert("Product Updated Successfully.");

        loadProducts();

        updateDashboard();

    }

    catch(error){

        console.log(error);

        alert("Failed to update product.");

    }

};


// Delete Product
window.deleteProduct = async function(id){

    const ok = confirm("Delete this product?");

    if(!ok) return;

    try{

        await deleteDoc(doc(db,"products",id));

        alert("Product Deleted Successfully.");

        loadProducts();

        updateDashboard();

    }

    catch(error){

        console.log(error);

        alert("Failed to delete product.");

    }

};
/* ===========================================
   SURIYA ELECTRICAL
   admin.js - Part 5E
   Load Customer Orders
=========================================== */

async function loadOrders(){

    const ordersBox =
    document.getElementById("orders");

    ordersBox.innerHTML = "";

    try{

        const snapshot =
        await getDocs(collection(db,"orders"));

        if(snapshot.empty){

            ordersBox.innerHTML =
            "<h3>No Orders Available</h3>";

            return;

        }

        snapshot.forEach((docSnap)=>{

            const order = docSnap.data();

            let productsHTML = "";

            if(order.products){

                order.products.forEach(item=>{

                    productsHTML += `

                    <li>

                    ${item.name}

                    × ${item.quantity}

                    = ₹${item.total}

                    </li>

                    `;

                });

            }

            ordersBox.innerHTML += `

            <div class="product">

                <div class="product-info">

                    <h3>

                    Customer :
                    ${order.customerName}

                    </h3>

                    <p>

                    📞 ${order.mobile}

                    </p>

                    <p>

                    📍 ${order.address}

                    </p>

                    <p>

                    💳 ${order.paymentMethod}

                    </p>

                    <p>

                    📦 Status :
                    ${order.status}

                    </p>

                    <p>

                    💰 Total :
                    ₹${order.totalAmount}

                    </p>

                    <h4>

                    Products

                    </h4>

                    <ul>

                    ${productsHTML}

                    </ul>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

        alert("Unable to load orders.");

    }

}
/* ===========================================
   SURIYA ELECTRICAL
   admin.js - Part 5F
   Dashboard & Initialization
=========================================== */

// Dashboard Counters
async function updateDashboard(){

    try{

        const productSnapshot =
        await getDocs(collection(db,"products"));

        const orderSnapshot =
        await getDocs(collection(db,"orders"));

        document.getElementById("productCount").innerText =
        productSnapshot.size;

        document.getElementById("orderCount").innerText =
        orderSnapshot.size;

    }

    catch(error){

        console.log(error);

    }

}


// Auto Refresh Every 30 Seconds
setInterval(()=>{

    if(document.getElementById("dashboard").style.display==="block"){

        loadProducts();

        loadOrders();

        updateDashboard();

    }

},30000);


// Check Login Status
auth.onAuthStateChanged(user=>{

    if(user){

        document.getElementById("loginPage").style.display="none";

        document.getElementById("dashboard").style.display="block";

        loadProducts();

        loadOrders();

        updateDashboard();

    }

    else{

        document.getElementById("loginPage").style.display="block";

        document.getElementById("dashboard").style.display="none";

    }

});
