if(localStorage.getItem("loggedin") !== "admin@queenservice.com"){
    location.href = "../login/login.html"
}
// back
document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}

import {db } from '../sales/salesFirebase.js';

document.getElementById("dayIncome").onclick = ()=>{
    let date = new Date(document.getElementById("day").value);
    let incomeDay = `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()}`;

    db.collection("income").doc(incomeDay).get().then((doc) => {
        if (doc.exists) {
            document.getElementById("income").innerHTML = `الأرباح: ${doc.data().income} جم`;
        } else {
            window.alert("لا أرباح لهذا اليوم!!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}