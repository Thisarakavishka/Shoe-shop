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
let ITEM_ADD_FORM = $("#item-add-form");
let ITEM_UPDATE_FORM = $("#item-update-form");

let CART_SECTION = $("#cart-section");

let ATTRIBUTE_SECTION = $("#attribute-content");

let REFUND_SECTION = $("#refund-section");

let HISTORY_SECTION = $("#history-section");

let LOGIN_SECTION = $("#login-section");

let SIDE_BAR_SECTION = $("#side-bar-section");


$(document).ready(async function () {
    initializeSuppliers();
    initializeCategories();
    initializeTypes();
    initializeColours();
    initializeSizes();

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
    ITEM_UPDATE_FORM.css("display", "none");

    CART_SECTION.css("display", "none");

    ATTRIBUTE_SECTION.css("display", "none");

    REFUND_SECTION.css("display", "none");

    HISTORY_SECTION.css("display", "none");

    LOGIN_SECTION.css("display", "none");
}

$("#admin-panel-button").on("click", () => {
    clearPage();
});

$("#cart-button").on("click", () => {
    clearPage();
    loadDataToPOS();
    CART_SECTION.css("display", "block");
});

$("#refund-button").on("click", () => {
    clearPage();
    loadRefundDataToTable();
    REFUND_SECTION.css("display", "block");
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

$("#attributes-button").on("click", () => {
    clearPage();
    getDataToCategoryTable();
    getDataToTypeTable();
    ATTRIBUTE_SECTION.css("display", "block");
});

$("#history-button").on("click", () => {
    clearPage();
    HISTORY_SECTION.css("display", "block");
});

$("#logout-button").on("click", () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#191919",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout!"
    }).then((result) => {
        if (result.isConfirmed) {
            clearPage();
            SIDE_BAR_SECTION.css("display", "none");
            LOGIN_SECTION.css("display", "block");
            Swal.fire({
                title: "Logout",
                text: "Successfully Logout!",
                icon: "success"
            });
        }
    });
});