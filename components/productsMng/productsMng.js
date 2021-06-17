import {auth } from '../sales/salesFirebase.js';

if(localStorage.getItem("loggedin") !== "admin@queenservice.com"){
    auth.signOut().then(() => {
        localStorage.removeItem("loggedin");
        location.href = `../login/login.html`;
      }).catch((error) => {
        window.alert(error.code + "\n" + error.message);
      });
}

// back
document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}
// tabs 5ara
// document.getElementById("nav-add-tab").onclick = ()=>{
//     document.getElementById("nav-add-tab").classList.add("active")
//     document.getElementById("nav-add").classList.add("show");
//     document.getElementById("nav-add").classList.add("active");
//     document.getElementById("nav-edit-tab").classList.remove("active")
//     document.getElementById("nav-edit").classList.remove("show");
//     document.getElementById("nav-edit").classList.remove("active");
//     document.getElementById("nav-delete-tab").classList.remove("active")
//     document.getElementById("nav-delete").classList.remove("show");
//     document.getElementById("nav-delete").classList.remove("active");
// }

// document.getElementById("nav-edit-tab").onclick = ()=>{
//     document.getElementById("nav-edit-tab").classList.add("active")
//     document.getElementById("nav-edit").classList.add("show");
//     document.getElementById("nav-edit").classList.add("active");
//     document.getElementById("nav-add-tab").classList.remove("active")
//     document.getElementById("nav-add").classList.remove("show");
//     document.getElementById("nav-add").classList.remove("active");
//     document.getElementById("nav-delete-tab").classList.remove("active")
//     document.getElementById("nav-delete").classList.remove("show");
//     document.getElementById("nav-delete").classList.remove("active");
// }

// document.getElementById("nav-delete-tab").onclick = ()=>{
//     document.getElementById("nav-delete-tab").classList.add("active")
//     document.getElementById("nav-delete").classList.add("show");
//     document.getElementById("nav-delete").classList.add("active");
//     document.getElementById("nav-edit-tab").classList.remove("active")
//     document.getElementById("nav-edit").classList.remove("show");
//     document.getElementById("nav-edit").classList.remove("active");
//     document.getElementById("nav-add-tab").classList.remove("active")
//     document.getElementById("nav-add").classList.remove("show");
//     document.getElementById("nav-add").classList.remove("active");
// }

import { db } from '../sales/salesFirebase.js';

let totalAddedProducts = 0, totalEditProducts = 0, totalDeletedProducts=0;


const jetpack = require('fs-jetpack');

let products = jetpack.read(`products/products.json`,'json');

// document.getElementById("addForm").onsubmit = (event)=>{
//     event.preventDefault();
//     db.collection("products").add({
//         name: document.getElementById("prdName").value,
//         barcode: document.getElementById("prdBarcode").value,
//         price: Number(document.getElementById("prdPrice").value),
//         availableQt: Number(document.getElementById("prdQt").value),
//         soldQt: 0
//     })
//     .then(() => {
//         totalAddedProducts++;
//         document.getElementById("prdName").value = "";
//         document.getElementById("prdBarcode").value = "";
//         document.getElementById("prdPrice").value = 0;
//         document.getElementById("prdQt").value = 0;
//         window.alert("تمت إضافة المنتج \n العدد "+totalAddedProducts)
//     })
//     .catch((error) => {
//         console.error("Error writing document: ", error);
//     });
    
// }

document.getElementById("showDataBtn").onclick = ()=>{
    let product = products.find((product)=>{
            return ((product.barcode == document.getElementById("editprdBarcode").value) || (product.name == document.getElementById("editprdName").value))
    });
    document.getElementById("editprdBarcode").value = product.barcode;
    document.getElementById("editprdName").value = product.name;
    // document.getElementById("editprdPrice").value = product.price;
    document.getElementById("editprdQt").value = product.availableQt;
}


document.getElementById("editForm").onsubmit = (event)=>{
    event.preventDefault();

    db.collection("products").where("barcode", "==", document.getElementById("editprdBarcode").value).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("products").doc(doc.id).update({
                // name: document.getElementById("editprdName").value,
                // price: Number(document.getElementById("editprdPrice").value),
                availableQt: Number(document.getElementById("editprdQt").value),
            }).then(() => {
                totalEditProducts++;
                document.getElementById("editprdName").value = "";
                document.getElementById("editprdBarcode").value = "";
                // document.getElementById("editprdPrice").value = 0;
                document.getElementById("editprdQt").value = 0;
                window.alert("تمت تعديل كمية المنتج \n العدد "+totalEditProducts)
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
}


// document.getElementById("deleteprdBarcode").onblur = ()=>{
//     let product = products.find((product)=>{
//             return (product.barcode == document.getElementById("deleteprdBarcode").value)
//     });
//     document.getElementById("deleteprdName").value = product.name;
// }

// document.getElementById("deleteForm").onsubmit = (event)=>{
//     event.preventDefault();
//     if(window.confirm("هل أنت متأكد؟")){
//         db.collection("products").where("name", "==", document.getElementById("deleteprdName").value).get()
//         .then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 db.collection("products").doc(doc.id).delete().then(() => {
//                     totalDeletedProducts++;
//                     document.getElementById("deleteprdName").value = "";
//                     document.getElementById("deleteprdBarcode").value = "";
//                     window.alert("تمت مسح المنتج \n العدد "+totalDeletedProducts)
//                 }).catch((error) => {
//                     console.error("Error removing document: ", error);
//                 });
//             });
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//         });
//     }
    
// }
