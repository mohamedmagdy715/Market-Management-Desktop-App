// back
document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}
const electron = require("electron");

const { ipcRenderer } = electron;
import { db } from '../sales/salesFirebase.js';
import {Product}from "../../models/product.js";
const jetpack = require('fs-jetpack');

let totalAddedProducts = 0;
let products = [];

document.getElementById("prdBarcode").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      let product = products.find((product) => {
        return product.barcode == document.getElementById("prdBarcode").value;
      });
      if(product){
          document.getElementById("prdName").value = product.name;
          document.getElementById("prdPrice").value = product.price;
          document.getElementById("prdBuyPrice").value = product.buyPrice;
          document.getElementById("prdQt").value = 0;
      }

      document.getElementById("prdName").focus();
    }
  });

  document.getElementById("prdName").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      let product = products.find((product) => {
        return product.name == document.getElementById("prdName").value;
      });
      if(product){
          document.getElementById("prdBarcode").value = product.barcode;
          document.getElementById("prdPrice").value = product.price;
          document.getElementById("prdBuyPrice").value = product.buyPrice;
          document.getElementById("prdQt").value = 0;
      }

      document.getElementById("prdPrice").focus();
    }
  });
  document.getElementById("prdPrice").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      document.getElementById("prdBuyPrice").focus();
    }
  });
  document.getElementById("prdBuyPrice").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      document.getElementById("prdQt").focus();
    }
  });
  document.getElementById("prdQt").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      document.getElementById("submit").click();
    }
  });


document.getElementById("submit").onclick = ()=>{

    let name = document.getElementById("prdName").value;
    let barcode = document.getElementById("prdBarcode").value;
    let price = Number(document.getElementById("prdPrice").value);
    let addedAvailableQt = Number(document.getElementById("prdQt").value);
    let buyPrice = Number(document.getElementById("prdBuyPrice").value);
    document.getElementById("prdName").value = "";
    document.getElementById("prdBarcode").value = "";
    document.getElementById("prdPrice").value = 0;
    document.getElementById("prdQt").value = 0;
    document.getElementById("prdBuyPrice").valu = 0;

    let myPrd = new Product(name , price , 0,0,addedAvailableQt,0,buyPrice);
    ipcRenderer.send("newProductTanzel",myPrd);

    db.collection("products").where("barcode", "==", barcode).get()
    .then((querySnapshot) => {
        if(querySnapshot.docs.length == 0){
            db.collection("products").add({
                name: name,
                barcode: barcode,
                price: price,
                availableQt: addedAvailableQt,
                buyPrice: buyPrice,
                soldQt: 0,
              })
              .then(() => {
                totalAddedProducts++;
                window.alert("تمت إضافة المنتج \n العدد " + totalAddedProducts);
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });
        }else{
            querySnapshot.forEach((doc) => {
                db.collection("products").doc(doc.id).update({
                    name: name,
                    barcode: barcode,
                    price: price,
                    availableQt: doc.data().availableQt + addedAvailableQt,
                    buyPrice: buyPrice,
                  })
                  .then(() => {
                    totalAddedProducts++;
                    window.alert("تمت تعديل المنتج \n العدد "+totalAddedProducts)
                  })
                  .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                  });
            });
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}


// new tanzel fatora window
document.getElementById("newTanzelFatora").onclick = () => {
    products = jetpack.read(`products/products.json`,'json');
    ipcRenderer.send("newTanzelFatora",document.getElementById("tanzelFatoraNum").value);
    document.getElementById("prdBarcode").focus();
};

document.getElementById("print").onclick = ()=>{
    ipcRenderer.send("printTanzelFatora",totalAddedProducts);
}