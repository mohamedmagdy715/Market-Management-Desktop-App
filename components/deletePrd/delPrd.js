document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}

import { db } from '../sales/salesFirebase.js';

let totalDeletedProducts=0;

document.getElementById("deleteForm").onsubmit = (event)=>{
    event.preventDefault();
    if(window.confirm("هل أنت متأكد؟")){
        db.collection("products").where("name", "==", document.getElementById("deleteprdName").value).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("products").doc(doc.id).delete().then(() => {
                    totalDeletedProducts++;
                    document.getElementById("deleteprdName").value = "";
                    document.getElementById("deleteprdBarcode").value = "";
                    window.alert("تم مسح المنتج \n العدد "+totalDeletedProducts)
                }).catch((error) => {
                    window.alert("Error removing document: ", error)
                    //console.error("Error removing document: ", error);
                });
            });
        })
        .catch((error) => {
            window.alert("Error getting documents: ", error)
            //console.log("Error getting documents: ", error);
        });
    }
}