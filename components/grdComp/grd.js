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
// import { storage } from '../sales/salesFirebase.js';
// const jetpack = require('fs-jetpack');
// let allFiles = jetpack.list('grd');
// let dateFiles = [];
let grdProducts = [];
let totCost = 0, totSold = 0, totRest = 0;

document.getElementById("show").onclick = ()=>{
  let choosenMonth = new Date(document.getElementById("choosenMonth").value);
  let month = `${choosenMonth.getMonth()+1}-${choosenMonth.getFullYear()}`;

  db.collection("products").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          grdProducts.push(doc);
          totCost += (doc.data()[month].addedQt + doc.data()[month].prevQt) * doc.data()[month].buyPrice;
          totSold += doc.data()[month].soldQt * doc.data()[month].price;
          totRest += doc.data()[month].availableQt * doc.data()[month].price;
      });
      grdProducts.sort(compare);
      grdProducts.forEach(doc => {
        document.getElementById("table").innerHTML +=`<tr>
            <td scope="row" >${doc.data().name}</td>
            <td >${doc.data()[month].prevQt}</td>
            <td >${doc.data()[month].addedQt}</td>
            <td >${doc.data()[month].buyPrice}</td>
            <td >${(doc.data()[month].addedQt + doc.data()[month].prevQt) * doc.data()[month].buyPrice}</td>
            <td >${doc.data()[month].soldQt}</td>
            <td >${doc.data()[month].price}</td>
            <td >${doc.data()[month].soldQt * doc.data()[month].price}</td>
            <td >${doc.data()[month].availableQt}</td>
            <td >${doc.data()[month].availableQt * doc.data()[month].price}</td>
          </tr>`
      });
      document.getElementById("table").innerHTML +=`<tr>
      <td scope="row" >الإجمالي</td>
      <td ></td>
      <td ></td>
      <td ></td>
      <td >${totCost}</td>
      <td ></td>
      <td ></td>
      <td >${totSold}</td>
      <td ></td>
      <td >${totRest}</td>
    </tr>`
  });
//   let date1 = new Date(document.getElementById("day1").value);
//   let date2 = new Date(document.getElementById("day2").value);

//   allFiles.forEach(file => {
//       let day = Number(file.split('-')[0]);
//       let month = Number(file.split('-')[1]);
//       let year = Number(file.split('-')[2].split(".")[0]);
//       let newDate = new Date(year,month-1,day, 2);
//       if((newDate >= date1) && (newDate <= date2)){
//         dateFiles.push(file);
//       }
//   });
//   grd();

//   // rest products
//   let restProducts = jetpack.read(`products/products.json`,'json');
//   restProducts.sort(compare);
//   restProducts.forEach((prd)=>{
//     if(! grdProducts.find((grdaya)=> grdaya.name==prd.name)){
//       document.getElementById("table").innerHTML +=`<tr>
//       <td scope="row" >${prd.name}</td>
//       <td >${prd.availableQt}</td>
//       <td >${0}</td>
//       <td >${prd.buyPrice}</td>
//       <td >${prd.buyPrice * prd.availableQt}</td>
//       <td >${0}</td>
//       <td >${prd.price}</td>
//       <td >${0}</td>
//       <td >${prd.availableQt}</td>
//       <td >${prd.availableQt * prd.price}</td>
//   </tr>`

//       totCost += prd.buyPrice * prd.availableQt;
//       totRest += prd.availableQt * prd.price;
//     }
//   })

}

function compare( a, b ) {
  if ( a.data().name < b.data().name ){
    return -1;
  }
  if ( a.data().name > b.data().name ){
    return 1;
  }
  return 0;
}

// function grd(){
//   grdProducts = jetpack.read(`grd/${dateFiles[0]}`,'json');
//   grdProducts.sort(compare);
//   for (let i = 1; i < dateFiles.length; i++) {
//     let tempArray = jetpack.read(`grd/${dateFiles[i]}`,'json');
//     tempArray.sort(compare);
//     tempArray.forEach(grdProduct =>{
//       if(grdProducts.findIndex((prd) => prd.name == grdProduct.name)  !== -1){
//         grdProducts[grdProducts.findIndex((prd) => prd.name == grdProduct.name)].addedQt += grdProduct.addedQt;
//         grdProducts[grdProducts.findIndex((prd) => prd.name == grdProduct.name)].soldQt += grdProduct.soldQt;
//         if(grdProduct.price > 0)
//           grdProducts[grdProducts.findIndex((prd) => prd.name == grdProduct.name)].price = grdProduct.price;
//         grdProducts[grdProducts.findIndex((prd) => prd.name == grdProduct.name)].availableQt = grdProduct.availableQt;
//       }else{
//         grdProducts.push(grdProduct);
//       }
//     })
//   }

//   grdProducts.forEach(product => {
//     document.getElementById("table").innerHTML +=`<tr>
//       <td scope="row" >${product.name}</td>
//       <td >${product.prevQt}</td>
//       <td >${product.addedQt}</td>
//       <td >${product.buyPrice}</td>
//       <td >${(product.addedQt + product.prevQt) * product.buyPrice}</td>
//       <td >${product.soldQt}</td>
//       <td >${product.price}</td>
//       <td >${product.soldQt * product.price}</td>
//       <td >${product.availableQt}</td>
//       <td >${product.availableQt * product.price}</td>
//   </tr>`

//   totCost += (product.addedQt + product.prevQt) * product.buyPrice;
//   totSold += product.soldQt * product.price;
//   totRest += product.availableQt * product.price;
//   });

// }

document.getElementById("download").onclick = ()=>{
  exportTableToExcel("grdTable");
  // document.getElementById("send").hidden = false;
  // document.getElementById("download").hidden = true;
}

function exportTableToExcel(tableID){
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  var filename = 'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
}

// document.getElementById("send").onclick = ()=>{
//   document.getElementById("file").click();
// }

// document.getElementById("file").onchange = ()=>{
//   let storageRef = storage.ref();
//   let excelRef = storageRef.child('excel-report/report.xls');
//   excelRef.put(document.getElementById("file").files[0]).then((snapshot) => {
//     window.alert("تم إرسال التقرير")
//   });
// }

// document.getElementById("downAdmin").onclick = ()=>{
//   let storageRef = storage.ref();
//   storageRef.child('excel-report/report.xls').getDownloadURL()
//   .then((url) => {
//     location.href = url;
//   })
//   .catch((error) => {
//     window.alert(error)
//   });

// }