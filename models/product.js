export class Product {
    constructor(name, price, boughtQt ,barcode, availableQt, soldQt) {
        this.name = name;
        this.price = price;
        this.barcode = barcode;
        this.boughtQt = boughtQt;
        this.availableQt = availableQt;
        this.soldQt = soldQt;
    }
}