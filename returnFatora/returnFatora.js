const electron = require("electron");

const { ipcRenderer } = electron;

// development
// import {db} from '../components/sales/salesFirebase.js';
// production
// let firebaseConfig = {
//   apiKey: "AIzaSyDpiTev2KA_5S6XGFHkJQf584MZ-5wutew",
//   authDomain: "queenservice-65860.firebaseapp.com",
//   projectId: "queenservice-65860",
//   storageBucket: "queenservice-65860.appspot.com",
//   messagingSenderId: "1075481563142",
//   appId: "1:1075481563142:web:6f0fcfc84cb507074db387",
//   measurementId: "G-X1QZZ5V97D"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
// const db = firebase.firestore();



let total = 0;

ipcRenderer.on("newReturnedProductSent", (event, value) => {
  total -= value.boughtQt*value.price;
  document.getElementById("total").innerHTML = total;
  document.getElementById("fatoraTable").innerHTML += addProductToFatora(value);
});

function addProductToFatora(product){
  return `<tr>\
  <td scope="row" style="font-size: small;">${product.name}</td>\
  <td>${product.boughtQt}</td>\
  <td>${product.price}</td>\
  <td>${product.boughtQt*product.price}</td>\
</tr>`
};

ipcRenderer.on("fatoraName", (event, value) => {
  document.getElementById("fatoraName").innerHTML = `\t\t${value}`;
});

// ipcRenderer.on("subIncome", (event, value) => {
//   let currentdate = new Date();
//   let today = `${currentdate.getDate()}-${(currentdate.getMonth()+1)}-${currentdate.getFullYear()}`;
//   db.collection("income").doc(today).get().then((doc) => {
//     if (doc.exists) {
//       db.collection("income").doc(today).update({
//           income: doc.data().income+parseInt(total)
//       }).then(() => {
//           console.log("Document successfully updated!");
//           ipcRenderer.send("doneSubIncome");
//       })
//       .catch((error) => {
//           // The document probably doesn't exist.
//           console.error("Error updating document: ", error);
//       });
//     } else {
//       db.collection("income").doc(today).set({
//           income: total
//       })
//       .then(() => {
//           console.log("Document successfully written!");
//           ipcRenderer.send("doneSubIncome");
//       })
//       .catch((error) => {
//           console.error("Error writing document: ", error);
//       });
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });
// });