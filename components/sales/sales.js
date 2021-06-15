import {auth } from '../sales/salesFirebase.js';

if(localStorage.getItem("loggedin") !== "cashier@queenservice.com"){
    auth.signOut().then(() => {
        localStorage.removeItem("loggedin");
        location.href = `../login/login.html`;
      }).catch((error) => {
        window.alert(error.code + "\n" + error.message);
      });
}


import {Product}from "../../models/product.js";
import { db } from './salesFirebase.js'
const electron = require('electron');

const { ipcRenderer } = electron;

const jetpack = require('fs-jetpack');

let products = [];
let total,buyTotal,buyPrice,productAvQt;
//back button

document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}

document.getElementById("prdBarcode").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      let product = products.find((product) => {
        return product.barcode == document.getElementById("prdBarcode").value;
      });
      document.getElementById("prdName").value = product.name;
      document.getElementById("prdPrice").value = product.price;
      document.getElementById("prdQt").value = 1;
      productAvQt = product.availableQt;
      buyPrice = product.buyPrice;

      document.getElementById("prdQt").focus();
    }
  });


document.getElementById("add").onclick = ()=>{
    if(document.getElementById("prdQt").value > 10000){
        if(!window.confirm("الكمية كبيرة، موافق؟")){
            return
        }
    }
    if(document.getElementById("prdQt").value>productAvQt){
        window.alert("الكمية أكبر من المتوفر");
        document.getElementById("prdQt").value = "";
        return;
    }
    console.log(products[products.findIndex((product) => {
        return product.barcode == document.getElementById("prdBarcode").value;
      })])
    products[products.findIndex((product) => {
        return product.barcode == document.getElementById("prdBarcode").value;
      })].availableQt -= Number(document.getElementById("prdQt").value);
      console.log(products[products.findIndex((product) => {
        return product.barcode == document.getElementById("prdBarcode").value;
      })])

    let name = document.getElementById("prdName").value;
    let price = document.getElementById("prdPrice").value;
    let quantity = document.getElementById("prdQt").value;

    document.getElementById("prdName").value = "";
    document.getElementById("prdPrice").value = "";
    document.getElementById("prdQt").value = "";
    document.getElementById("prdBarcode").value = "";

    let myPrd = new Product(name , price , quantity);
    ipcRenderer.send("newProductAdded",myPrd);

    buyTotal += buyPrice * quantity;
    total += price * quantity;
    document.getElementById("tot").innerHTML = total;
    
    // decrease available quantity of this product in firebase

    db.collection("products").where("name", "==", name).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("products").doc(doc.id).update({
                availableQt: doc.data().availableQt - quantity,
                soldQt: doc.data().soldQt + Number(quantity)
            }).then(() => {
                //console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                //console.error("Error updating document: ", error);
                window.alert("Error updating document: ", error);
            });
        });
    })
    .catch((error) => {
        //console.log("Error getting documents: ", error);
        window.alert("Error getting document: ", error);
    });
    document.getElementById("prdBarcode").focus();
}

document.getElementById("print").onclick = ()=>{
    ipcRenderer.send("printFatora");
    let currentdate = new Date();
    let today = `${currentdate.getDate()}-${(currentdate.getMonth()+1)}-${currentdate.getFullYear()}`;
    db.collection("income").doc(today).get().then((doc) => {
        if (doc.exists) {
        db.collection("income").doc(today).update({
            income: doc.data().income+Number(total),
            netIncome: doc.data().netIncome + Number(total) - buyTotal
        }).then(() => {
            //console.log("Document successfully updated!");
            //window.alert("income updated")
        })
        .catch((error) => {
            // The document probably doesn't exist.
            //console.error("Error updating document: ", error);
            window.alert("income Error updating document: ", error);
        });
        } else {
        db.collection("income").doc(today).set({
            income: total,
            netIncome: Number(total) - buyTotal
        })
        .then(() => {
            //console.log("Document successfully written!");
            //window.alert("income set")
        })
        .catch((error) => {
            //console.error("Error writing document: ", error);
            window.alert("income Error setting document: ", error);
        });
        }
    }).catch((error) => {
        //console.log("Error getting document:", error);

        db.collection("income").doc(today).set({
            income: total,
            netIncome: Number(total) - buyTotal
        })
        .then(() => {
            //console.log("Document successfully written!");
            window.alert("تمت إضافة الإيرادات")
        })
        .catch((error) => {
            //console.error("Error writing document: ", error);
            window.alert("خطأ في إضافة الإيرادات: ", error);
        });
    });
}


// new fatora window

document.getElementById("newFatora").onclick = () => {
    total = 0;
    buyTotal = 0;
    products = jetpack.read(`products/products.json`,'json');
    ipcRenderer.send("newFatora");
    document.getElementById("prdBarcode").focus();
};


// press enter when on quantity input to add product

document.getElementById("prdQt").addEventListener("keyup", function(event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
     event.preventDefault();
     document.getElementById("add").click();
    }
  })
