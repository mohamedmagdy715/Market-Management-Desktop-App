if(localStorage.getItem("loggedin") !== "admin@queenservice.com"){
    location.href = "../login/login.html"
}
// back
document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}

import {db } from '../sales/salesFirebase.js';
const jetpack = require('fs-jetpack');

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
            document.getElementById("table").innerHTML += `<tr>
            <td scope="row">${doc.data().name}</td>
            <td >${doc.data().price}</td>
            <td >${doc.data().soldQt}</td>
            <td >${doc.data().availableQt}</td>
        </tr>`
        });
    });
}

document.getElementById("prdBarcode").addEventListener("keyup", function (event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      document.getElementById("showData").click();
    }
  });