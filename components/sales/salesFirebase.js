const jetpack = require('fs-jetpack');


// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  let firebaseConfig = {
    apiKey: "AIzaSyDpiTev2KA_5S6XGFHkJQf584MZ-5wutew",
    authDomain: "queenservice-65860.firebaseapp.com",
    projectId: "queenservice-65860",
    storageBucket: "queenservice-65860.appspot.com",
    messagingSenderId: "1075481563142",
    appId: "1:1075481563142:web:6f0fcfc84cb507074db387",
    measurementId: "G-X1QZZ5V97D"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  export const db = firebase.firestore();
  export const auth = firebase.auth();

  let productsArray = [];

  
  db.collection("products").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().name}`);
        let product = {
            name: doc.data().name,
            price: doc.data().price,
            barcode: doc.data().barcode,
            availableQt: doc.data().availableQt
        }
        productsArray.push(product);
        jetpack.file(`products/products.json`,{content: JSON.stringify(productsArray)});
    });
});