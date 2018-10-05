import $ from 'jquery';

export class ProductService{


     getProductData (url, onSuccess, context) {
        return $.ajax({
            type: "GET",
            url: url,
            async: true,
            success: onSuccess.bind(context)
        });
    };


}