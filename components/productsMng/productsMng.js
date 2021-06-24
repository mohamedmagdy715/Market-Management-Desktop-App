// import {auth } from '../sales/salesFirebase.js';
// if(localStorage.getItem("loggedin") !== "admin@queenservice.com"){
//     auth.signOut().then(() => {
//         localStorage.removeItem("loggedin");
//         location.href = `../login/login.html`;
//       }).catch((error) => {
//         window.alert(error.code + "\n" + error.message);
//       });
// }

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
// import {GrdProduct} from "../../models/grdProduct.js";
const electron = require("electron");

window.alert("تأكد من أن الماركت متصل بالإنترنت قبل تنزيل الفاتورة وبعدها");

const { ipcRenderer } = electron;

let totalAddedProducts = 0, totalEditProducts = 0, totalDeletedProducts=0;


const jetpack = require('fs-jetpack');

let products= jetpack.read(`products/products.json`,'json');
// let grdProducts = [],today="";
let oldQt = 0,price = 0,buyPrice = 0, isWindowOpen = false;

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

document.getElementById("newSupRet").onclick = () => {
    if (isWindowOpen){
      window.alert("اطبع الفاتورة أولًا");
      return
    }
    isWindowOpen = true;
    //products = jetpack.read(`products/products.json`,'json');
    ipcRenderer.send("newReturnSup",document.getElementById("returnSupName").value);
    document.getElementById("editprdBarcode").focus();
};

document.getElementById("editprdBarcode").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
      let product = products.find((product) => {
        return (
          product.barcode == document.getElementById("editprdBarcode").value
        );
      });
      document.getElementById("editprdBarcode").value = product.barcode;
      document.getElementById("editprdName").value = product.name;
      // document.getElementById("editprdPrice").value = product.price;
      // document.getElementById("editprdQt").value = product.availableQt;
      oldQt = product.availableQt;
      price = product.price;
      buyPrice = product.buyPrice;
    }
    // creating new grd file for today
    // let date = new Date();
    // today = `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()}`;
    // if (!(grdProducts = jetpack.read(`grd/${today}.json`,'json'))){
    //     jetpack.file(`grd/${today}.json`);
    //     grdProducts = [];
    // }
  });

  let date = new Date();
  let month = `${date.getMonth() + 1}-${date.getFullYear()}`;
  let prevMonth;
  if (date.getMonth() == 0) {
    prevMonth = `12-${date.getFullYear() - 1}`;
  } else {
    prevMonth = `${date.getMonth()}-${date.getFullYear()}`;
  }


document.getElementById("addReturnSup").onclick = ()=>{
    // if(grdProducts.findIndex((grdProduct) => grdProduct.name == document.getElementById("editprdName").value) !== -1){
    //     grdProducts[grdProducts.findIndex((grdProduct) => grdProduct.name == document.getElementById("editprdName").value)].availableQt = Number(document.getElementById("editprdQt").value);
    // }else{
    //     let grdProduct = new GrdProduct(document.getElementById("editprdName").value,oldQt,0,0,0,0,Number(document.getElementById("editprdQt").value))
    //     grdProducts.push(grdProduct);
    // }
    if(Number(document.getElementById("editprdQt").value) > oldQt){
      window.alert("الكمية أكبر من المتوفر");
      document.getElementById("editprdQt").value = 0;
      return;
  }

    let name = document.getElementById("editprdName").value;
    let barcode = document.getElementById("editprdBarcode").value;
    let returnedQt = Number(document.getElementById("editprdQt").value);

    let prd = {
        name : name,
        buyPrice : buyPrice,
        price : price,
        quantity : returnedQt
    }
    ipcRenderer.send("newProductReturnSup",prd);

    document.getElementById("editprdName").value = "";
    document.getElementById("editprdBarcode").value = "";
    document.getElementById("editprdQt").value = 0;

    db.collection("products").where("barcode", "==", barcode).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let prevQt = doc.data()[month]? doc.data()[month].prevQt : doc.data()[prevMonth]? doc.data()[prevMonth].availableQt : 0;
            let obj = {
                addedQt : doc.data()[month]? doc.data()[month].addedQt - returnedQt : 0 - returnedQt,
                availableQt : doc.data()[month]? doc.data()[month].availableQt - returnedQt : prevQt - returnedQt,
                buyPrice : buyPrice,
                prevQt : prevQt,
                price : price,
                soldQt : doc.data()[month]? doc.data()[month].soldQt : 0,
              }
            db.collection("products").doc(doc.id).update({
                // name: document.getElementById("editprdName").value,
                // price: Number(document.getElementById("editprdPrice").value),
                availableQt: doc.data().availableQt - returnedQt,
                [month] : obj
            }).then(() => {
                totalEditProducts++;
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
    
    // jetpack.file(`grd/${today}.json`,{content: JSON.stringify(grdProducts)});
}

document.getElementById("printReturnSup").onclick = ()=>{
  isWindowOpen = false;
    ipcRenderer.send("printRetSupFatora");
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
