const electron = require("electron");

const { ipcRenderer } = electron;

let total = 0, num=0;

ipcRenderer.on("newTanzelProductSent", (event, value) => {
    total += value.availableQt*value.buyPrice;
  document.getElementById("total").innerHTML = total;
  document.getElementById("num").innerHTML = ++num;
  document.getElementById("fatoraTable").innerHTML += addProductToFatora(value);
});

function addProductToFatora(product){
  return `<tr>\
  <td scope="row" style="font-size: small;">${product.name}</td>\
  <td>${product.availableQt}</td>\
  <td>${product.price}</td>\
  <td>${product.buyPrice}</td>\
  <td>${product.availableQt*product.buyPrice}</td>\
</tr>`
};

ipcRenderer.on("fatoraName", (event, value) => {
  document.getElementById("fatoraName").innerHTML = `${value}`;
});
