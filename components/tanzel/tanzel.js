// back
document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}
const electron = require("electron");

window.alert("تأكد من أن الماركت متصل بالإنترنت قبل تنزيل الفاتورة وبعدها");

const { ipcRenderer } = electron;
import { db } from '../sales/salesFirebase.js';
import {Product}from "../../models/product.js";
// import {GrdProduct} from "../../models/grdProduct.js";
const jetpack = require('fs-jetpack');

let totalAddedProducts = 0, oldQuantity=0,isWindowOpen = false;;
let products = [];
//grdProducts=[];

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
          oldQuantity = product.availableQt;
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
          oldQuantity = product.availableQt;
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

    // finding grdproduct
    // if(grdProducts.findIndex((grdProduct) => grdProduct.name == name) !== -1){
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == name)].prevQt = oldQuantity;
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == name)].addedQt = addedAvailableQt;
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == name)].buyPrice = buyPrice;
    // }else{
    //     let grdProduct = new GrdProduct(name,oldQuantity,addedAvailableQt,buyPrice);
    //     grdProducts.push(grdProduct);
    // }

    document.getElementById("prdName").value = "";
    document.getElementById("prdBarcode").value = "";
    document.getElementById("prdPrice").value = 0;
    document.getElementById("prdQt").value = 0;
    document.getElementById("prdBuyPrice").valu = 0;

    let myPrd = new Product(name , price , addedAvailableQt,0,oldQuantity,0,buyPrice);
    ipcRenderer.send("newProductTanzel",myPrd);

    let date = new Date();
    let month = `${(date.getMonth()+1)}-${date.getFullYear()}`;
    let prevMonth;
    if (date.getMonth() == 0 ){
      prevMonth = `12-${date.getFullYear()-1}`;
    }else{
      prevMonth = `${(date.getMonth())}-${date.getFullYear()}`;
    }

    db.collection("products").where("barcode", "==", barcode).get()
    .then((querySnapshot) => {
        if(querySnapshot.docs.length == 0){
            let obj = {
              addedQt : addedAvailableQt,
              availableQt : addedAvailableQt,
              buyPrice : buyPrice,
              prevQt : 0,
              price : price,
              soldQt : 0
            }
            db.collection("products").add({
                name: name,
                barcode: barcode,
                price: price,
                availableQt: addedAvailableQt,
                buyPrice: buyPrice,
                //soldQt: 0,
                [month]: obj
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
              let prevQt = doc.data()[month]? doc.data()[month].prevQt : doc.data()[prevMonth]? doc.data()[prevMonth].availableQt : 0;
                let obj = {
                  addedQt : doc.data()[month]? doc.data()[month].addedQt + addedAvailableQt : addedAvailableQt,
                  availableQt : doc.data()[month]? doc.data()[month].availableQt + addedAvailableQt : prevQt + addedAvailableQt,
                  buyPrice : buyPrice,
                  prevQt : prevQt,
                  price : price,
                  soldQt : doc.data()[month]? doc.data()[month].soldQt : 0,
                }
                db.collection("products").doc(doc.id).update({
                    name: name,
                    barcode: barcode,
                    price: price,
                    availableQt: doc.data().availableQt + addedAvailableQt,
                    buyPrice: buyPrice,
                    [month]: obj
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
  if (isWindowOpen){
    window.alert("اطبع الفاتورة أولًا");
    return
  }
  isWindowOpen = true;
    products = jetpack.read(`products/products.json`,'json');
    ipcRenderer.send("newTanzelFatora",document.getElementById("tanzelFatoraNum").value);
    document.getElementById("prdBarcode").focus();
    // creating new grd file for today
    // let date = new Date();
    // let today = `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()}`;
    // if (!(grdProducts = jetpack.read(`grd/${today}.json`,'json'))){
    //     jetpack.file(`grd/${today}.json`);
    //     grdProducts = [];
    // }
};

document.getElementById("print").onclick = ()=>{
  isWindowOpen = false;
    ipcRenderer.send("printTanzelFatora",totalAddedProducts);
    // let date = new Date();
    // let today = `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()}`;
    // jetpack.file(`grd/${today}.json`,{content: JSON.stringify(grdProducts)});
}