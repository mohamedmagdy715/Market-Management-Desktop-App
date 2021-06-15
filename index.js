const electron = require('electron');
const jetpack = require('fs-jetpack');

const { app, BrowserWindow , ipcMain , Menu } = electron;


let mainWindow, fatoraWindow, returnFatoraWindow, tanzelFatoraWindow ;
let fileName,total ;

app.on('ready',()=>{
    mainWindow =  new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });
    mainWindow.loadURL(`file://${__dirname}/components/login/login.html`);

    // menubar
    const plainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(plainMenu);
});

// menu options
let fullScreen = false;
const menuTemplate = [
    {
        label: 'Queen',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'F5',
                click(){
                    mainWindow.reload()
                }
            },
            {
                label: 'Toggle Full Screen',
                accelerator: 'F11',
                click(){
                    fullScreen = !fullScreen;
                    mainWindow.setFullScreen(fullScreen);
                }
            },
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// fatora

function newFatoraWindow(){
    fatoraWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        width:300,
        title:'عملية بيع جديدة',
        x:10,
        y:10
    });
    let currentdate = new Date();
    fileName = `${currentdate.getDate()}${(currentdate.getMonth()+1)}${currentdate.getFullYear()}${currentdate.getHours()}${currentdate.getMinutes()}${currentdate.getSeconds()}`;
    jetpack.file(`fatora/${fileName}.html`,{});
    jetpack.copyAsync(`fatora/fatora.html`, `fatora/${fileName}.html`, { overwrite: true })
    .then(()=>{
        // development
        // fatoraWindow.loadURL(`file://${__dirname}/fatora/${fileName}.html`);
        // production
        fatoraWindow.loadURL(`file://${__dirname}/../../fatora/${fileName}.html`);
    }).catch((error)=>{
        console.log(error);
    });
    total=0;
    jetpack.append(
      `fatora/${fileName}.txt`,
      `\t\tQueenService\nالجامعة اليابانية\nالتارخ\t${currentdate.getDate()}-${
        currentdate.getMonth() + 1
      }-${currentdate.getFullYear()}\t${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}\n
      رقم الفاتورة\t${fileName}\nالصنف\t\t\tالكمية\tالسعر\tالقيمة`
    );
}

ipcMain.on("newFatora", (event , value)=>{
    newFatoraWindow();
});

ipcMain.on("newProductAdded", (event , value)=>{
    fatoraWindow.webContents.send("newProductSent",value);
    fatoraWindow.webContents.send("fatoraName",fileName);
    total += value.boughtQt*value.price;
    jetpack.append(
        `fatora/${fileName}.txt`,
        `\n${value.name}\t\t\t${value.boughtQt}\t${value.price}\t${value.boughtQt*value.price}`
      );
});

ipcMain.on("printFatora", (event , value)=>{
    fatoraWindow.webContents.print({
        silent: true,
    }, (success, failureReason) => {
        if (!success) alert(failureReason)
        else {
            console.log('Print Initiated');
            fatoraWindow.close();
            mainWindow.reload();
        }
    });
    jetpack.append(
        `fatora/${fileName}.txt`,
        `\nالإجمالي\t\t\t\t\t${total}`
      );
});


// return

function newReturnFatoraWindow(fatoraNumber){
    returnFatoraWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        width:300,
        title:'عملية إرجاع جديدة',
        x:10,
        y:10
    });
    fileName = fatoraNumber;
    jetpack.file(`returnFatora/${fatoraNumber}.html`,{});
    jetpack.copyAsync(`returnFatora/returnFatora.html`, `returnFatora/${fatoraNumber}.html`, { overwrite: true })
    .then(()=>{
        // development
        // returnFatoraWindow.loadURL(`file://${__dirname}/returnFatora/${fatoraNumber}.html`);
        // production
        returnFatoraWindow.loadURL(`file://${__dirname}/../../returnFatora/${fatoraNumber}.html`);
    }).catch((error)=>{
        console.log(error)
    });
    let currentdate = new Date();
    total=0;
    jetpack.append(
      `returnFatora/${fileName}.txt`,
      `\t\tQueenService\nالجامعة اليابانية\nالتارخ\t${currentdate.getDate()}-${
        currentdate.getMonth() + 1
      }-${currentdate.getFullYear()}\t${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}\n
      رقم الفاتورة\t${fileName}\nعملية إرجاع\nالصنف\t\t\tالكمية\tالسعر\tالقيمة`
    );
}

ipcMain.on("newReturnFatora", (event , value)=>{
    newReturnFatoraWindow(value);
});

ipcMain.on("newProductReturned", (event , value)=>{
    returnFatoraWindow.webContents.send("newReturnedProductSent",value);
    returnFatoraWindow.webContents.send("fatoraName",fileName);
    total -= value.boughtQt*value.price;
    jetpack.append(
        `returnFatora/${fileName}.txt`,
        `\n${value.name}\t\t\t${value.boughtQt}\t${value.price}\t${value.boughtQt*value.price}`
      );
});

ipcMain.on("printReturnFatora", (event , value)=>{
    returnFatoraWindow.webContents.print({
        silent: true,
    }, (success, failureReason) => {
        if (!success) alert(failureReason)
        else {
            console.log('Print Initiated');
            returnFatoraWindow.close();
        }
    });
    jetpack.append(
        `returnFatora/${fileName}.txt`,
        `\nالإجمالي\t\t\t\t\t${total}`
      );
});

// tanzel

function newTanzelFatoraWindow(fatoraNumber){
    tanzelFatoraWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        width:300,
        title:'عملية تنزيل فاتورة',
        x:10,
        y:10
    });
    fileName = fatoraNumber;
    jetpack.file(`tanzel/${fatoraNumber}.html`,{});
    jetpack.copyAsync(`tanzel/tanzelFatora.html`, `tanzel/${fatoraNumber}.html`, { overwrite: true })
    .then(()=>{
        // development
        // tanzelFatoraWindow.loadURL(`file://${__dirname}/tanzel/${fatoraNumber}.html`);
        // production
        tanzelFatoraWindow.loadURL(`file://${__dirname}/../../tanzel/${fatoraNumber}.html`);
    }).catch((error)=>{
        console.log(error)
    });
    let currentdate = new Date();
    total=0;
    jetpack.append(
      `tanzel/${fileName}.txt`,
      `\t\tQueenService\nالجامعة اليابانية\nالتارخ\t${currentdate.getDate()}-${
        currentdate.getMonth() + 1
      }-${currentdate.getFullYear()}\t${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}\n
      رقم الفاتورة\t${fileName}\nتنزيل فاتورة\nالصنف\t\t\tالكمية\tسعر البيع\tسعر الشراء\tالقيمة`
    );
}

ipcMain.on("newTanzelFatora", (event , value)=>{
    newTanzelFatoraWindow(value);
});

ipcMain.on("newProductTanzel", (event , value)=>{
    tanzelFatoraWindow.webContents.send("newTanzelProductSent",value);
    tanzelFatoraWindow.webContents.send("fatoraName",fileName);
    total += value.availableQt*value.price;
    jetpack.append(
        `tanzel/${fileName}.txt`,
        `\n${value.name}\t\t\t${value.availableQt}\t${value.price}\t${value.buyPrice}\t${value.availableQt*value.buyPrice}`
        );
    });
    

ipcMain.on("printTanzelFatora", (event , value)=>{
    tanzelFatoraWindow.webContents.print({
        silent: true,
    }, (success, failureReason) => {
        if (!success) alert(failureReason)
        else {
            console.log('Print Initiated');
            tanzelFatoraWindow.close();
        }
    });
    jetpack.append(
        `tanzel/${fileName}.txt`,
        `\nالإجمالي\t\t\t\t\t${total}\nالعدد\t\t\t\t\t${value}`
      );
});




