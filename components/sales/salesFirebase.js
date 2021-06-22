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

  // offline settings
  firebase.firestore().enablePersistence()
  .then(()=>{
    //window.alert("done")
  })
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          window.alert(err.code);
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          window.alert(err.code);
      }
  });
// Subsequent queries will use persistence, if it was enabled successfully
// firebase.firestore().settings({
//   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
// });

  export const db = firebase.firestore();
  export const auth = firebase.auth();
  export const storage = firebase.storage();


  let productsArray = [];

  // let date = new Date();
  // let month = `${(date.getMonth()+1)}-${date.getFullYear()}`;
  
  db.collection("products").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.data().name} => ${doc.data()[month].addedQt}`);
        let product = {
            name: doc.data().name,
            price: doc.data().price,
            barcode: doc.data().barcode,
            availableQt: doc.data().availableQt,
            buyPrice: doc.data().buyPrice,
            //? doc.data().buyPrice:undefined // to be removed
        }
        productsArray.push(product);
        jetpack.file(`products/products.json`,{content: JSON.stringify(productsArray)});
    });
});
db.collection("income").get();