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

import {db } from '../sales/salesFirebase.js';
const jetpack = require('fs-jetpack');

// reading fatora files
// import {GrdProduct} from "../../models/grdProduct.js";
// let requiredMonth = 6;
// let allFiles = jetpack.list('fatora');
// let textFiles = [];
// let grdArray = [];
// allFiles.forEach(file => {
//     if (file.indexOf('.txt') != -1){
//         let fat = jetpack.read(`fatora/${file}`);
//         let tare5 = fat.slice(fat.indexOf('التاريخ')+8, fat.indexOf('\t',fat.indexOf('التاريخ')+8));
//         // let day = tare5.split('-')[0];
//         // let month = tare5.split('-')[1];
//         // let year = tare5.split('-')[2];
//         if (tare5.split('-')[1] == requiredMonth)
//             textFiles.push(file);
//     }
// });
// textFiles.forEach(file => {
//     let fat = jetpack.read(`fatora/${file}`);
//     let name = fat.slice(fat.indexOf('القيمة')+7, fat.indexOf('\t',fat.indexOf('القيمة')+7));
//     if (grdArray.find((grdProduct)=>grdProduct.name == name)){
//         grdProduct.soldQt += Number(fat.slice(fat.indexOf('\t',fat.indexOf('القيمة')+7)+3, fat.indexOf('\t',fat.indexOf('\t',fat.indexOf('القيمة')+7)+3)))
//     }else{
//         grdArray.push(new GrdProduct(name,0,0,0,Number(fat.slice(fat.indexOf('\t',fat.indexOf('القيمة')+7)+3, fat.indexOf('\t',fat.indexOf('\t',fat.indexOf('القيمة')+7)+3)))));
//     }
//     console.log(grdArray);
// });


let products = jetpack.read(`products/products.json`,'json');

document.getElementById("showData").onclick = ()=>{
    let product = products.find((product)=>{
            return ((product.barcode == document.getElementById("prdBarcode").value) || (product.name == document.getElementById("prdName").value))
    });
    db.collection("products").where("barcode", "==", product.barcode).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            document.getElementById("tableName").innerHTML = doc.data().name;
            document.getElementById("tablePrice").innerHTML = doc.data().price;
            document.getElementById("tableBuyPrice").innerHTML = doc.data().buyPrice;
            document.getElementById("tableSoldQt").innerHTML = doc.data().soldQt;
            document.getElementById("tableAvQt").innerHTML = doc.data().availableQt;
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
        window.alert(error);
    });
    document.getElementById("prdBarcode").value = "";
    document.getElementById("prdName").value = "";
}

document.getElementById("showAllData").onclick = ()=>{
    db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data().availableQt == 0){
                document.getElementById("table").innerHTML += `<tr>
                <td scope="row">${doc.data().name}</td>
                <td >${doc.data().price}</td>
                <td >${doc.data().buyPrice}</td>
                <td >${doc.data().soldQt}</td>
                <td style="background-color: #CA0B00;" >${doc.data().availableQt}</td>
            </tr>`
            }else{
                document.getElementById("table").innerHTML += `<tr>
                <td scope="row">${doc.data().name}</td>
                <td >${doc.data().price}</td>
                <td >${doc.data().buyPrice}</td>
                <td >${doc.data().soldQt}</td>
                <td >${doc.data().availableQt}</td>
            </tr>`

            }
        });
    });
}

document.getElementById("prdBarcode").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      document.getElementById("showData").click();
    }
  });