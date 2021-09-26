import {auth } from '../sales/salesFirebase.js';

document.getElementById("sales").onclick = () =>{
  location.href = `../sales/sales.html`;
}
document.getElementById("return").onclick = () =>{
  location.href = `../return/return.html`;
}
document.getElementById("products").onclick = () =>{
  location.href = `../productsMng/productsMng.html`;
}
document.getElementById("income").onclick = () =>{
  location.href = `../income/income.html`;
}
// document.getElementById("analysis").onclick = () =>{
//   location.href = `../analysis/analysis.html`;
// }
document.getElementById("grd").onclick = () =>{
  location.href = `../grdComp/grd.html`;
}
document.getElementById("tanzel").onclick = () =>{
  location.href = `../tanzel/tanzel.html`;
}
// document.getElementById("delete").onclick = () =>{
//   location.href = `../deletePrd/delPrd.html`;
// }

document.getElementById("logout").onclick = () =>{
  auth.signOut().then(() => {
    localStorage.removeItem("loggedin");
    location.href = `../login/login.html`;
  }).catch((error) => {
    window.alert(error.code + "\n" + error.message);
  });
}
