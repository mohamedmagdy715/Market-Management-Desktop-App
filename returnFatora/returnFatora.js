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
  <td style="width: 100px;font-size: x-small;">${product.name}</td>\
  <td style="width: 20px;font-size: small;">${product.boughtQt}</td>\
  <td style="width: 20px;font-size: small;">${product.price}</td>\
  <td style="width: 20px;font-size: small;">${product.boughtQt*product.price}</td>\
</tr>`
};

ipcRenderer.on("fatoraName", (event, value) => {
  document.getElementById("fatoraName").innerHTML = `${value}`;
});
