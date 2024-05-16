let CUSTOMER_SECTION = $('#customer-section');
let CUSTOMER_ADD_FORM = $('#customer-add-form');
let CUSTOMER_UPDATE_FORM = $('#customer-update-form');

let SUPPLIER_SECTION = $('#supplier-section');
let SUPPLIER_ADD_FORM = $('#supplier-add-form');
let SUPPLIER_UPDATE_FORM = $('#supplier-update-form');

let EMPLOYEE_SECTION = $("#employee-section");
let EMPLOYEE_ADD_FORM = $("#employee-add-form");
let EMPLOYEE_UPDATE_FORM = $("#employee-update-form");

let ITEM_SECTION = $("#item-section");
let ITEM_ADD_FORM = $("#item-add-from");

$(document).ready(function () {
    clearPage();
});

const clearPage = function () {
    CUSTOMER_SECTION.css("display", "none");
    CUSTOMER_ADD_FORM.css("display", "none");
    CUSTOMER_UPDATE_FORM.css("display", "none");

    EMPLOYEE_SECTION.css("display", "none");
    EMPLOYEE_ADD_FORM.css("display", "none");
    EMPLOYEE_UPDATE_FORM.css("display", "none");

    SUPPLIER_SECTION.css("display", "none");
    SUPPLIER_ADD_FORM.css("display", "none");
    SUPPLIER_UPDATE_FORM.css("display", "none");

    ITEM_SECTION.css("display", "none");
    ITEM_ADD_FORM.css("display", "none");
}

$("#admin-panel-button").on("click", () => {
    clearPage();
});
$("#items-button").on("click", () => {
    clearPage();
    getDataToItemTable(0, item_page_size);
    getItemPageCount();
    ITEM_SECTION.css("display", "block");
});

$("#customers-button").on("click", () => {
    clearPage();
    getDataToCustomerTable(0, customer_page_size);
    getPageCount();
    CUSTOMER_SECTION.css("display", "block");
});

$("#employees-button").on("click", () => {
    clearPage();
    getDataToEmployeeTable(0, employee_page_size);
    getEmployeePageCount();
    EMPLOYEE_SECTION.css("display", "block");
});

$("#suppliers-button").on("click", () => {
    clearPage();
    getDataToSupplierTable(0, supplier_page_size);
    getSupplierPageCount();
    SUPPLIER_SECTION.css("display", "block");
});

$("#categories-button").on("click", () => {
    clearPage();
});

$("#logout-button").on("click", () => {
    clearPage();
});