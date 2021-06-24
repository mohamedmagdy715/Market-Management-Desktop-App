// import {auth } from '../sales/salesFirebase.js';
// if(localStorage.getItem("loggedin") !== "cashier@queenservice.com"){
//     auth.signOut().then(() => {
//         localStorage.removeItem("loggedin");
//         location.href = `../login/login.html`;
//       }).catch((error) => {
//         window.alert(error.code + "\n" + error.message);
//       });
// }


import {Product}from "../../models/product.js";
// import {GrdProduct} from "../../models/grdProduct.js";
import { db } from './salesFirebase.js'
const electron = require('electron');

const { ipcRenderer } = electron;

const jetpack = require('fs-jetpack');

let products = [];
//grdProducts;
let total,buyTotal,buyPrice,productAvQt,isWindowOpen = false;;
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

let date = new Date();
let month = `${(date.getMonth()+1)}-${date.getFullYear()}`;
let prevMonth;
   if (date.getMonth() == 0 ){
      prevMonth = `12-${date.getFullYear()-1}`;
    }else{
      prevMonth = `${(date.getMonth())}-${date.getFullYear()}`;
    }


document.getElementById("add").onclick = ()=>{
    if(document.getElementById("prdQt").value > 10000){
        if(!window.confirm("الكمية كبيرة، موافق؟")){
            return
        }
    }
    if(document.getElementById("prdQt").value>productAvQt){
        window.alert("الكمية أكبر من المتوفر");
        document.getElementById("prdQt").value = 0;
        return;
    }

    // let oldQt = products[products.findIndex((product) => {
    //     return product.barcode == document.getElementById("prdBarcode").value;
    //   })].availableQt;
    products[products.findIndex((product) => {
        return product.barcode == document.getElementById("prdBarcode").value;
      })].availableQt -= Number(document.getElementById("prdQt").value);

    let name = document.getElementById("prdName").value;
    let price = Number(document.getElementById("prdPrice").value);
    let quantity = Number(document.getElementById("prdQt").value);

    // finding grdproduct
    // if(grdProducts.findIndex((grdProduct) => grdProduct.name == name) !== -1){
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == name)].soldQt += Number(document.getElementById("prdQt").value);
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == name)].price = Number(document.getElementById("prdPrice").value);
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == name)].availableQt = products[products.findIndex((product) =>product.barcode == document.getElementById("prdBarcode").value)].availableQt;
    // }else{
    //     let grdProduct = new GrdProduct(name,oldQt,0,products[products.findIndex((product) =>product.barcode == document.getElementById("prdBarcode").value)].buyPrice,Number(document.getElementById("prdQt").value),Number(document.getElementById("prdPrice").value),products[products.findIndex((product) =>product.barcode == document.getElementById("prdBarcode").value)].availableQt)
    //     grdProducts.push(grdProduct);
    // }

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
            let prevQt = doc.data()[month]? doc.data()[month].prevQt : doc.data()[prevMonth]? doc.data()[prevMonth].availableQt : 0;
            let obj = {
                addedQt : doc.data()[month]? doc.data()[month].addedQt : 0,
                availableQt : doc.data()[month]? doc.data()[month].availableQt - quantity : prevQt - quantity,
                buyPrice : buyPrice,
                prevQt : prevQt,
                price : price,
                soldQt : doc.data()[month]? doc.data()[month].soldQt + quantity : quantity,
              }
            db.collection("products").doc(doc.id).update({
                availableQt: doc.data().availableQt - quantity,
                //soldQt: doc.data().soldQt + Number(quantity),
                [month]: obj

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
    isWindowOpen = false;
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

    //jetpack.file(`grd/${today}.json`,{content: JSON.stringify(grdProducts)});
}


// new fatora window

document.getElementById("newFatora").onclick = () => {
    if (isWindowOpen){
        window.alert("اطبع الفاتورة أولًا");
        return
      }
      isWindowOpen = true;
    total = 0;
    buyTotal = 0;
    products = jetpack.read(`products/products.json`,'json');
    ipcRenderer.send("newFatora");
    document.getElementById("prdBarcode").focus();

    // creating new grd file for today
    // let date = new Date();
    // let today = `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()}`;
    // if (!(grdProducts = jetpack.read(`grd/${today}.json`,'json'))){
    //     jetpack.file(`grd/${today}.json`);
    //     grdProducts = [];
    // }
};


// press enter when on quantity input to add product

document.getElementById("prdQt").addEventListener("keyup", function(event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
     event.preventDefault();
     document.getElementById("add").click();
    }
  })
