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
let EMPLOYEE_UPDATE_FORM = $("#employee-update-form");

let ITEM_CONTENT = $("#item-content");
let ITEM_ADD_FORM = $("#item-add-from");

const clearPage = function () {

    SUPPLIER_CONTENT.css("display", "none");
    CUSTOMER_CONTENT.css("display", "none");
    EMPLOYEE_CONTENT.css("display", "none");
    ITEM_CONTENT.css("display", "none");

    CUSTOMER_SECTION.css("display", "none");
    CUSTOMER_ADD_FORM.css("display", "none");
    CUSTOMER_UPDATE_FORM.css("display", "none");

    EMPLOYEE_SECTION.css("display", "none");
    EMPLOYEE_ADD_FORM.css("display", "none");
    EMPLOYEE_UPDATE_FORM.css("display", "none");

    SUPPLIER_SECTION.css("display", "none");
    SUPPLIER_ADD_FORM.css("display", "none");
    SUPPLIER_UPDATE_FORM.css("display", "none");

    ITEM_CONTENT.css("display", "none");
}

clearPage();