if(localStorage.getItem("key") !== "ok"){
  location.href = "../prdKey/prdKey.html";
}

import { auth } from "../sales/salesFirebase.js";

document.getElementById("loginForm").onsubmit = (event) => {
  event.preventDefault();
  auth
    .signInWithEmailAndPassword(
      document.getElementById("inputEmail").value,
      document.getElementById("inputPassword").value
    )
    .then(() => {
      localStorage.setItem("loggedin", document.getElementById("inputEmail").value);
      location.href = "../landing/landing.html"
    })
    .catch((error) => {
      window.alert(error.code + "\n" + error.message);
    });
};
