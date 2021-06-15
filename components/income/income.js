import {auth } from '../sales/salesFirebase.js';
if(localStorage.getItem("loggedin") !== "admin@queenservice.com"){
    auth.signOut().then(() => {
        localStorage.removeItem("loggedin");
        location.href = `../login/login.html`;
      }).catch((error) => {
        window.alert(error.code + "\n" + error.message);
      });
}
// back
document.getElementById("back").onclick = ()=>{
    location.href = "../landing/landing.html"
}

import {db } from '../sales/salesFirebase.js';

document.getElementById("dayIncome").onclick = ()=>{
    let date = new Date(document.getElementById("day").value);
    let date2 = new Date(document.getElementById("day2").value);
    let datex = new Date();
    let income=0, netIncome=0;
    datex.setDate(date.getDate());
    while(datex.getDate() <= date2.getDate()){
        let incomeDay = `${datex.getDate()}-${(datex.getMonth()+1)}-${datex.getFullYear()}`;
        db.collection("income").doc(incomeDay).get().then((doc) => {
            if (doc.exists) {
                income += doc.data().income;
                netIncome += doc.data().netIncome;
                document.getElementById("inc").innerHTML = income;
                document.getElementById("net").innerHTML = netIncome;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        datex.setDate(datex.getDate() + 1);
    }
    document.getElementById("income").innerHTML = `الإيرادات: <i id="inc"></i> جم`;
    document.getElementById("netIncome").innerHTML = `الأرباح: <i id="net"></i> جم`;
}