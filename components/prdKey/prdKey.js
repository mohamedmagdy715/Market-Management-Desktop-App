import {db } from '../sales/salesFirebase.js';

document.getElementById("prdKeyForm").onsubmit = (event)=>{
    event.preventDefault();
    db.collection("keys").doc(document.getElementById("inputKey").value).get()
      .then((doc) => {
        if (doc.exists) {
            db.collection("keys").doc(document.getElementById("inputKey").value).delete()
            .then(() => {
                localStorage.setItem("key","ok");
                location.href = "../login/login.html";
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        } else {
            window.alert("product key خاطئ");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        window.alert("product key خاطئ\n"+ error);
      });
}