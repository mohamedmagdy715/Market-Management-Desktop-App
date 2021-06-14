if(localStorage.getItem("key") !== "ok"){
  location.href = "../prdKey/prdKey.html";
}

if(localStorage.getItem("loggedin")){
  location.href = "../landing/landing.html";
}

import { auth } from "../sales/salesFirebase.js";

document.getElementById("loginForm").onsubmit = (event) => {
  let email = `${document.getElementById("inputEmail").value}@queenservice.com`
  event.preventDefault();
  auth
    .signInWithEmailAndPassword(
      email,
      document.getElementById("inputPassword").value
    )
    .then(() => {
      localStorage.setItem("loggedin", email);
      location.href = "../landing/landing.html"
    })
    .catch((error) => {
      window.alert(error.code + "\n" + error.message);
    });
};
