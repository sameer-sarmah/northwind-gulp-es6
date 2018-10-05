import { ProductService } from "./product.service"
import { pageInit } from './index';
import $ from 'jquery';

export class ProductList {

    growingThreshold ;
    products ;
    productCount;
    svc ;
    serviceUrl ;
    countUrl ;

    constructor(){
    this.growingThreshold = 5;
    this.products = [];
    this.productCount = Number.MAX_VALUE;
    this.svc = new ProductService();
    this.serviceUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/Northwind/Northwind.svc/Products?$format=json&";
    this.countUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/Northwind/Northwind.svc/Products/$count";

    }

    onInit() {
        console.log("ProductList onInit");
        this.getProductCount();
        this.getProducts();

    }

    getProducts() {
        let url = this.serviceUrl + "$skip=" + this.products.length + "&$top=5";
        if ((this.products.length + this.growingThreshold) <= this.productCount) {
            const skip = this.products.length;
            const top = this.growingThreshold;
            this.serviceUrl + "$skip=" + skip + "&$top=" + top;
        }
        else {
            const skip = this.products.length;
            const top = this.count - this.products.length;
            this.serviceUrl + "$skip=" + skip + "&$top=" + top;
        }
        return this.svc.getProductData(url, this.onProductsSuccess, this);
    }

    getProductCount() {
        return this.svc.getProductData(this.countUrl, this.onProductCountSuccess, this);
    }

    onProductsSuccess(data) {
        const products=data.value
        this.products = this.products.concat(products);
        console.log("updated products", this.products);
        let productTableHTML = this.renderHTML();
        console.log(productTableHTML);
        const $main = $('#main');
        $main.html(productTableHTML);
        let that=this;
        $("#show-more").click(that.getProducts.bind(that));
        const btnText=`Show More (${this.products.length} / ${this.productCount})`
        $("#show-more").html(btnText);
    }

    onProductCountSuccess(count) {
        this.productCount = count;
        console.log("count", this.productCount);
    }

    createRows(product) {
        
        const rows=(`<div class="flex-row-container flex-item product-item" style="width:100%;">
            <div class="flex-item cell-element">${product.ProductID}</div>
            <div class="flex-item cell-element">${product.ProductName}</div>
            <div class="flex-item cell-element">${product.UnitPrice}</div>
            <div class="flex-item cell-element">${product.QuantityPerUnit}</div>
        </div>`);
        return rows;
    };



    renderHTML() {
        const table= (
            ` <div class="flex-column-container lightBlueBG scroll-box flex-item" style="width:60%">
                <div class="flex-row-container flex-item product-item header-row" style="width:100%;">
                    <h2 class="flex-item cell-element header-column">Product ID</h2>
                    <h2 class="flex-item cell-element header-column">Product Name</h2>
                    <h2 class="flex-item cell-element header-column">Unit Price</h2>
                    <h2 class="flex-item cell-element header-column">Quantity Per Unit</h2>
                </div>
                <div class="flex-item text-block paleBlackTextColor flex-column-container"
                    style="width:100%;">
                    ${this.products.map(this.createRows)}
                </div>
                <div class="flex-row-container show-more" >

                    <div class="flex-item" >
                        <button type="button" id="show-more" ></button>
                    </div>


                </div>
            </div>`
        );
        return table;
    }
}

const productList=new  ProductList();
pageInit(productList.onInit.bind(productList));
