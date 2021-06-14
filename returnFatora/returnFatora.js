const electron = require("electron");

const { ipcRenderer } = electron;

let total = 0;

ipcRenderer.on("newReturnedProductSent", (event, value) => {
  total -= value.boughtQt*value.price;
  document.getElementById("total").innerHTML = total;
  document.getElementById("fatoraTable").innerHTML += addProductToFatora(value);
});

function addProductToFatora(product){
  return `<tr>\
  <td scope="row" style="font-size: small;">${product.name}</td>\
  <td>${product.boughtQt}</td>\
  <td>${product.price}</td>\
  <td>${product.boughtQt*product.price}</td>\
</tr>`
};

ipcRenderer.on("fatoraName", (event, value) => {
  document.getElementById("fatoraName").innerHTML = `${value}`;
});
