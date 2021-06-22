const electron = require("electron");

const { ipcRenderer } = electron;

let total = 0, num=0;

ipcRenderer.on("newRetSupProductSent", (event, value) => {
    total += value.quantity*value.buyPrice;
  document.getElementById("total").innerHTML = total;
  document.getElementById("num").innerHTML = ++num;
  document.getElementById("fatoraTable").innerHTML += addProductToFatora(value);
});

function addProductToFatora(product){
  return `<tr>\
  <td style="width: 100px;font-size: x-small;">${product.name}</td>\
  <td style="width: 20px;font-size: small;">${product.quantity}</td>\
  <td style="width: 20px;font-size: small;">${product.price}</td>\
  <td style="width: 20px;font-size: small;">${product.buyPrice}</td>\
  <td style="width: 20px;font-size: small;">${product.quantity*product.buyPrice}</td>\
</tr>`
};

ipcRenderer.on("fatoraName", (event, value) => {
  document.getElementById("fatoraName").innerHTML = `${value}`;
});
