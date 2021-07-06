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

document.getElementById("dayIncome").onclick = ()=>{
    let date = new Date(document.getElementById("day").value);
    let date2 = new Date(document.getElementById("day2").value);
    let datex = new Date();
    let income=0, netIncome=0;
    datex.setDate(date.getDate());
    datex.setHours(date2.getHours());
    datex.setMinutes(date2.getMinutes());
    datex.setSeconds(date2.getSeconds());
    datex.setMilliseconds(date2.getMilliseconds());
    while(datex <= date2){
        let incomeDay = `${datex.getDate()}-${(datex.getMonth()+1)}-${datex.getFullYear()}`;
        db.collection("income").doc(incomeDay).get().then((doc) => {
            if (doc.exists) {
                income += doc.data().income;
                netIncome += doc.data().netIncome;
                document.getElementById("inc").innerHTML = income;
                document.getElementById("net").innerHTML = netIncome;
                document.getElementById("cos").innerHTML = (income - netIncome).toFixed(2);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        datex.setDate(datex.getDate() + 1);
    }
    document.getElementById("income").innerHTML = `الإيرادات: <i id="inc"></i> جم`;
    document.getElementById("netIncome").innerHTML = `الأرباح: <i id="net"></i> جم`;
    document.getElementById("cost").innerHTML = `التكلفة: <i id="cos"></i> جم`;
}