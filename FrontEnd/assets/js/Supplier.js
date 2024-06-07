let supplier_page_size = 10;
let next_supplier_code;
let update_supplier;

$("#supplierPageSize").change(function () {
    supplier_page_size = $(this).val();
    getDataToSupplierTable(0, supplier_page_size);
    getSupplierPageCount();
});

function getDataToSupplierTable(page, size) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {page: page, size: size},
        success: function (data) {
            displaySupplierData(data, page, size);
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function displaySupplierData(data, page, size) {
    $('#supplier-table tbody').empty();
    $.each(data, function (index, supplier) {
        appendSupplierToTable(index + (page * size), supplier);
    });
}

function appendSupplierToTable(index, supplier) {
    let categoryColour = getSupplierCategoryColour(supplier.category);

    let isUSer = logged_user.role === 'USER';
    let hideClass = isUSer ? 'd-none' : '';

    $('#supplier-table tbody').append(`
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${supplier.supplierName}</td>
            <td>
                <label class="pill ${categoryColour} rounded">
                    <span class="p-2 text-white fw-bold">${supplier.category}</span>
                </label>
            </td>
            <td>${supplier.country}</td>
            <td>${supplier.email}</td>
            <td>${supplier.contactMobile}</td>
            <td>${supplier.contactLandline}</td>
            <td>${supplier.email}</td>
            <td>
                <button class="btn btn-outline-custom-black-colour view-supplier-btn btn-sm"><i class="fa fa-eye fa-lg" aria-hidden="true"></i></button>
                <button class="admin-only ${hideClass} btn btn-outline-custom-black-colour edit-supplier-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                <button class="admin-only ${hideClass} btn btn-outline-custom-red-colour delete-supplier-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);

    $('.edit-supplier-btn').last().click(function () {
        editSupplier(supplier);
    });

    $('.delete-supplier-btn').last().click(function () {
        deleteSupplier(supplier);
    });

    $('.view-supplier-btn').last().click(function () {
        viewSupplier(supplier);
    });
}

function generateSupplierModalContent(supplier) {
    let categoryColour = getSupplierCategoryColour(supplier.category);

    let modalContent = `
        <div class="modal fade" id="supplierModal" tabindex="-1" role="dialog" aria-labelledby="supplierModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-light">
                        <h5 class="modal-title" id="supplierModalLabel">Supplier Details</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-6 border-end">
                                    <h5 class="text-uppercase text-muted mb-3">Supplier Information</h5>
                                    <div class="mb-2">
                                        <span class="fw-bold">Name:</span>
                                        <span class="text-secondary">${supplier.supplierName}</span>
                                    </div>
                                    <div class="mb-2">
                                        <span class="fw-bold">Category:</span>
                                        <span class="badge ${categoryColour}">${supplier.category}</span>
                                    </div>
                                    <div class="mb-2">
                                        <span class="fw-bold">Country:</span>
                                        <span class="text-secondary">${supplier.country}</span>
                                    </div>
                                    <div class="mb-2">
                                        <span class="fw-bold">Email:</span>
                                        <span class="text-secondary">${supplier.email}</span>
                                    </div>
                                    <div class="mb-2">
                                        <span class="fw-bold">Mobile:</span>
                                        <span class="text-secondary">${supplier.contactMobile}</span>
                                    </div>
                                    <div class="mb-2">
                                        <span class="fw-bold">Landline:</span>
                                        <span class="text-secondary">${supplier.contactLandline}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h5 class="text-uppercase text-muted mb-3">Address Details</h5>
                                    <div class="mb-2">
                                        <span class="fw-bold">Address:</span>
                                        <span class="text-secondary">
                                            ${supplier.addressNo}, ${supplier.addressLane},<br>
                                            ${supplier.addressCity}, ${supplier.addressState},<br>
                                            ${supplier.postalCode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return modalContent;
}

function viewSupplier(supplier) {
    $('#supplierModal').remove();
    const supplierModalContent = generateSupplierModalContent(supplier);
    $('body').append(supplierModalContent);
    $('#supplierModal').modal('show');
}

function getSupplierCategoryColour(category) {
    switch (category) {
        case "LOCAL":
            return "bg-custom-green";
        case "INTERNATIONAL":
            return "bg-custom-silver";
        default:
            return "";
    }
}

function getSupplierPageCount()     {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier/page-size',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {size: supplier_page_size},
        success: function (data) {
            console.log('success fetching count of supplier pages');
            supplierPaginationButtons(data);
        },
        error: function () {
            console.error('Error fetching count of pages');
        }
    });
}

function supplierPaginationButtons(totalPages) {
    $('#supplierPagination').empty();
    for (let i = 0; i < totalPages; i++) {
        $('#supplierPagination').append(`<button class="btn btn-outline-custom-black-colour me-2" onclick="getDataToSupplierTable(${i}, supplier_page_size)">${i + 1}</button>`);
    }
}

function editSupplier(supplier) {
    SUPPLIER_SECTION.css("display", "none");
    SUPPLIER_UPDATE_FORM.css("display", "block");

    update_supplier = supplier;
    $("#updateSupplierName").val(supplier.supplierName);
    $("#updateSupplierCategory").val(supplier.category);
    $("#updateSupplierAddressNo").val(supplier.addressNo);
    $("#updateSupplierAddressLane").val(supplier.addressCity);
    $("#updateSupplierAddressCity").val(supplier.addressCity);
    $("#updateSupplierAddressState").val(supplier.addressState);
    $("#updateSupplierPostalCode").val(supplier.postalCode);
    $("#updateSupplierCountry").val(supplier.country);
    $("#updateSupplierMobileNumber").val(supplier.contactMobile);
    $("#updateSupplierLandNumber").val(supplier.contactLandline);
    $("#updateSupplierEmail").val(supplier.email);
}

function deleteSupplier(supplier) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'http://localhost:8080/spring-boot/api/v1/supplier/' + supplier.supplierCode,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (response) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your supplier has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getDataToSupplierTable(0, supplier_page_size);
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting supplier:', error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete supplier.",
                        icon: "error"
                    });
                }
            });
        }
    });
}

function getNextSupplierCode() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier/next-code',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            next_supplier_code = data;
        },
        error: function () {
            console.log("Error fetching next supplier code")
        }
    });
}

$('#add-new-supplier').on('click', () => {
    clearPage();
    SUPPLIER_SECTION.css("display", "none");
    SUPPLIER_ADD_FORM.css("display", "block");
    getNextSupplierCode();
});//In Supplier Section

$('#backNewSupplier').on('click', () => {
    SUPPLIER_ADD_FORM("display", "none");
    SUPPLIER_SECTION("display", "block");
});

function saveSupplier() {
    event.preventDefault();
    const supplier = {
        "supplierCode": next_supplier_code,
        "supplierName": $("#supplierName").val(),
        "category": $("#supplierCategory").val(),
        "addressNo": $("#supplierAddressNo").val(),
        "addressLane": $("#supplierAddressLane").val(),
        "addressCity": $("#supplierAddressCity").val(),
        "addressState": $("#supplierAddressState").val(),
        "postalCode": $("#supplierPostalCode").val(),
        "country": $("#supplierCountry").val(),
        "contactMobile": $("#supplierMobileNumber").val(),
        "contactLandline": $("#supplierLandNumber").val(),
        "email": $("#supplierEmail").val()
    }
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
        data: JSON.stringify(supplier),
        success: function (data) {
            console.log('supplier added successfully:', data);
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1000
            });
            SUPPLIER_ADD_FORM.css("display", "none");
            SUPPLIER_SECTION.css("display", "block");
            getSupplierPageCount();
        },
        error: function (xhr, status, error) {
            console.error('Error adding supplier:', error);
            Swal.fire({
                icon: "error",
                title: status,
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

$('#addNewSupplier').on('click', () => {
    if ($('#supplierAddForm')[0].checkValidity()) {
        saveSupplier();
        getDataToSupplierTable(0, supplier_page_size);
    } else {
        $('#supplierAddForm').addClass('was-validated');
        event.preventDefault();
    }
});

$('#updateSupplier').on('click', () => {
    event.preventDefault();
    const supplier = {
        "supplierCode": update_supplier.supplierCode,
        "supplierName": $("#updateSupplierName").val(),
        "category": $("#updateSupplierCategory").val(),
        "addressNo": $("#updateSupplierAddressNo").val(),
        "addressLane": $("#updateSupplierAddressLane").val(),
        "addressCity": $("#updateSupplierAddressCity").val(),
        "addressState": $("#updateSupplierAddressState").val(),
        "postalCode": $("#updateSupplierPostalCode").val(),
        "country": $("#updateSupplierCountry").val(),
        "contactMobile": $("#updateSupplierMobileNumber").val(),
        "contactLandline": $("#updateSupplierLandNumber").val(),
        "email": $("#updateSupplierEmail").val()
    };

    $.ajax({
        url: "http://localhost:8080/spring-boot/api/v1/supplier/" + update_supplier.supplierCode,
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: "application/json",
        data: JSON.stringify(supplier),
        success: function (response) {
            console.log("Supplier updated successfully");
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1000
            });
            SUPPLIER_UPDATE_FORM.css("display", "none");
            SUPPLIER_SECTION.css("display", "block");
            getDataToSupplierTable(0, supplier_page_size);

        },
        error: function (xhr, status, error) {
            console.error("Error updating supplier:", error);
            Swal.fire({
                icon: "error",
                title: "Something wrong",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
});

$('#backUpdateSupplier').on('click', () => {
    SUPPLIER_UPDATE_FORM.css("display", "none");
    SUPPLIER_SECTION.css("display", "block");
});

$('#supplier-search-text').on('input', () => {
    getSupplierSearchResult();
});

$('#supplier-search').on('click', () => {
    getSupplierSearchResult();
});

function getSupplierSearchResult() {
    event.preventDefault();
    const searchText = $('#supplier-search-text').val().trim();
    if (searchText === '') {
        getDataToSupplierTable(0, supplier_page_size);
        getSupplierPageCount();
    } else {
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            url: 'http://localhost:8080/spring-boot/api/v1/supplier/search',
            data: {query: searchText},
            success: function (data) {
                displaySupplierData(data, 0, data.length);
                $('#supplierPagination').empty();
            },
            error: function (xhr, status, error) {
                console.log("error fetching data")
            }
        });
    }
}