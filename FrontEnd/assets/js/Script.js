let add_shoe = $("#item-add-new-from");

let CUSTOMER_CONTENT = $('#customer-content');
let CUSTOMER_SECTION = $('#customer-section');
let CUSTOMER_ADD_FORM = $('#customer-add-form');
let CUSTOMER_UPDATE_FORM = $('#customer-update-form');

let SUPPLIER_CONTENT = $('#supplier-content');
let SUPPLIER_SECTION = $('#supplier-section');
let SUPPLIER_ADD_FORM = $('#supplier-add-form');
let SUPPLIER_UPDATE_FORM = $('#supplier-update-form');

let EMPLOYEE_CONTENT = $('#employee-content');
let EMPLOYEE_SECTION = $("#employee-section");
let EMPLOYEE_ADD_FORM = $("#employee-add-form");

const clearPage = function () {
    add_shoe.css("display", "none");

    SUPPLIER_CONTENT.css("display", "none");
    CUSTOMER_CONTENT.css("display", "block");
    EMPLOYEE_CONTENT.css("display", "none");

    CUSTOMER_ADD_FORM.css("display", "none");
    CUSTOMER_UPDATE_FORM.css("display", "none");
}

clearPage();