let CUSTOMER_SECTION = $('#customer-section');
let CUSTOMER_ADD_FORM = $('#customer-add-form');
let CUSTOMER_UPDATE_FORM = $('#customer-update-form');
let page_size = 10;
let next_customer_code;
let update_customer;

$(document).ready(function () {
    getDataToCustomerTable(0, page_size);//First time load 10 customers
    getPageCount();
    clearPage();
});

$("#customerPageSize").change(function () {
    page_size = $(this).val();
    getDataToCustomerTable(0, page_size);
    getPageCount();
});

function getDataToCustomerTable(page, size) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/customer',
        method: 'GET',
        data: {page: page, size: size},
        success: function (data) {
            $('#customer-table tbody').empty();
            $.each(data, function (index, customer) {
                let levelColor;
                switch (customer.customerLevel) {
                    case "NEW":
                        levelColor = "bg-custom-green";
                        break;
                    case "SILVER":
                        levelColor = "bg-custom-silver";
                        break;
                    case "BRONZE":
                        levelColor = "bg-custom-bronze";
                        break;
                    case "GOLD":
                        levelColor = "bg-custom-gold";
                        break;
                }

                let genderColor;
                switch (customer.gender) {
                    case "MALE":
                        genderColor = "bg-custom-male";
                        break;
                    case "FEMALE":
                        genderColor = "bg-custom-female";
                        break;
                }

                $('#customer-table tbody').append(`
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td class="text-start">${customer.customerName}</td>
                            <td>
                            <label class="pill ${genderColor} rounded-pill">
                                    <span class="p-2 text-white fw-bold">${customer.gender}</span>
                                </label>
                            </td>
                            <td>${splitDateTime(customer.joinedDate)}</td>
                            <td>
                                <label class="pill ${levelColor} rounded-pill">
                                    <span class="p-2 text-white fw-bold">${customer.customerLevel}</span>
                                </label>
                            </td>
                            <td>${customer.totalPoints}</td>
                            <td>${splitDateTime(customer.dob)}</td>
                            <td>${customer.addressCity}</td>
                            <td>${customer.postalCode}</td>
                            <td>${customer.email}</td>
                            <td>${splitDateTime(customer.recentPurchaseDateTime)}</td>
                            <td>
                                <button class="btn btn-outline-custom-black-colour edit-customer-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                                <button class="btn btn-outline-custom-red-colour delete-customer-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
                            </td>
                        </tr>
                    `);
                $('.edit-customer-btn').last().click(function () {
                    editCustomer(customer);
                });
                $('.delete-customer-btn').last().click(function () {
                    deleteCustomer(customer);
                });
            });
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function getPageCount() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/customer/page-size',
        method: 'GET',
        data: {size: page_size},
        success: function (data) {
            console.error('success fetching count of pages');
            paginationButtons(data);
        },
        error: function () {
            console.error('Error fetching count of pages');
        }
    });
}

function paginationButtons(totalPages) {
    $('#pagination').empty();
    for (let i = 0; i < totalPages; i++) {
        $('#pagination').append(`<button class="btn btn-outline-custom-black-colour me-2" onclick="getDataToCustomerTable(${i}, page_size)">${i + 1}</button>`);
    }
}

function editCustomer(customer) {
    CUSTOMER_SECTION.css("display", "none");
    CUSTOMER_UPDATE_FORM.css("display", "block");

    update_customer = customer;
    $("#updateCustomerName").val(customer.customerName);
    $("#updateGender").val(customer.gender);
    const joinedDate = new Date(customer.joinedDate);
    const formattedJoinedDate = joinedDate.toISOString().split('T')[0];
    $("#updateJoinedDate").val(formattedJoinedDate);
    $("#updateCustomerLevel").val(customer.customerLevel);
    $("#updateTotalPoints").val(customer.totalPoints);
    const dobDate = new Date(customer.dob);
    const formattedDob = dobDate.toISOString().split('T')[0];
    $("#updateDob").val(formattedDob);
    $("#updateAddressNo").val(customer.addressNo);
    $("#updateAddressLane").val(customer.addressLane);
    $("#updateAddressCity").val(customer.addressCity);
    $("#updateAddressState").val(customer.addressState);
    $("#updatePostalCode").val(customer.postalCode);
    $("#updateContactNumber").val(customer.contactNumber);
    $("#updateEmail").val(customer.email);
}

function deleteCustomer(customer) {
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
                url: 'http://localhost:8080/spring-boot/api/v1/customer/' + customer.customerCode,
                type: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your customer has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getDataToCustomerTable(0, page_size);
                        getPageCount();
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting customer:', error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete customer.",
                        icon: "error"
                    });
                }
            });
        }
    });

}

function splitDateTime(dateTimeString) {
    return dateTimeString.split('T')[0];
}

$('#add-new-customer').on('click', () => {
    clearPage();
    CUSTOMER_SECTION.css("display", "none");
    CUSTOMER_ADD_FORM.css("display", "block");
    getNextCustomerCode();// call backend to get next customer code when form load
});//In customer section

function getNextCustomerCode() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/customer/next-code',
        type: 'GET',
        success: function (data) {
            next_customer_code = data;
        },
        error: function () {
            console.log("Error fetching next customer code")
        }
    });
}

$('#backNewCustomer').on('click', () => {
    CUSTOMER_ADD_FORM.css("display", "none");
    CUSTOMER_SECTION.css("display", "block");
});

$('#addNewCustomer').on('click', () => {
    if ($('#customerAddForm')[0].checkValidity()) {
        saveCustomer();
    } else {
        $('#customerAddForm').addClass('was-validated');
        event.preventDefault();
    }
});//In customer add form

function saveCustomer() {
    const customer = {
        customerCode: next_customer_code,
        customerName: $('#customerName').val(),
        gender: $('#gender').val(),
        joinedDate: $('#joinedDate').val(),
        customerLevel: $('#customerLevel').val(),
        totalPoints: $('#totalPoints').val(),
        dob: $('#dob').val(),
        addressNo: $('#addressNo').val(),
        addressLane: $('#addressLane').val(),
        addressCity: $('#addressCity').val(),
        addressState: $('#addressState').val(),
        postalCode: $('#postalCode').val(),
        contactNumber: $('#contactNumber').val(),
        email: $('#email').val(),
        recentPurchaseDateTime: new Date().toISOString()
    };
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/customer',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(customer),
        success: function (data) {
            console.log('Customer added successfully:', data);
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1000
            });
            setTimeout(function () {
                CUSTOMER_ADD_FORM.css("display", "none");
                CUSTOMER_SECTION.css("display", "block");
                getPageCount();
            }, 1000);
        },
        error: function (xhr, status, error) {
            console.error('Error adding customer:', error);
            Swal.fire({
                icon: "error",
                title: status,
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

$('#updateCustomer').on('click', () => {
    const customer = {
        "customerCode": update_customer.customerCode,
        "customerName": $("#updateCustomerName").val(),
        "gender": $("#updateGender").val(),
        "joinedDate": $("#updateJoinedDate").val(),
        "customerLevel": $("#updateCustomerLevel").val(),
        "totalPoints": $("#updateTotalPoints").val(),
        "dob": $("#updateDob").val(),
        "addressNo": $("#updateAddressNo").val(),
        "addressLane": $("#updateAddressLane").val(),
        "addressCity": $("#updateAddressCity").val(),
        "addressState": $("#updateAddressState").val(),
        "postalCode": $("#updatePostalCode").val(),
        "contactNumber": $("#updateContactNumber").val(),
        "email": $("#updateEmail").val(),
        "recentPurchaseDateTime": update_customer.recentPurchaseDateTime
    };

    $.ajax({
        url: "http://localhost:8080/spring-boot/api/v1/customer/" + update_customer.customerCode,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(customer),
        success: function (response) {
            console.log("Customer updated successfully");
            CUSTOMER_UPDATE_FORM.css("display", "none");
            CUSTOMER_SECTION.css("display", "block");
        },
        error: function (xhr, status, error) {
            console.error("Error updating customer:", error);
        }
    });
});//In customer update form

$('#backUpdateCustomer').on('click', () => {
    CUSTOMER_UPDATE_FORM.css("display", "none");
    CUSTOMER_SECTION.css("display", "block");
});
$('#customer-search-text').on('input', () => {
    getSearchResult();
});

$('#customer-search').on('click', () => {
    getSearchResult()
});

function getSearchResult() {
    event.preventDefault();
    const searchText = $('#customer-search-text').val().trim();
    if (searchText === '') {
        getDataToCustomerTable(0, page_size);
        getPageCount();
    } else {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/spring-boot/api/v1/customer/search',
            data: {query: searchText},
            success: function (data) {
                $('#customer-table tbody').empty();
                $.each(data, function (index, customer) {
                    let levelColor;
                    switch (customer.customerLevel) {
                        case "NEW":
                            levelColor = "bg-custom-green";
                            break;
                        case "SILVER":
                            levelColor = "bg-custom-silver";
                            break;
                        case "BRONZE":
                            levelColor = "bg-custom-bronze";
                            break;
                        case "GOLD":
                            levelColor = "bg-custom-gold";
                            break;
                    }

                    let genderColor;
                    switch (customer.gender) {
                        case "MALE":
                            genderColor = "bg-custom-male";
                            break;
                        case "FEMALE":
                            genderColor = "bg-custom-female";
                            break;
                    }
                    $('#customer-table tbody').append(`
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td class="text-start">${customer.customerName}</td>
                            <td>
                                <label class="pill ${genderColor} rounded-pill">
                                    <span class="p-2 text-white fw-bold">${customer.gender}</span>
                                </label>
                            </td>                            
                            <td>${splitDateTime(customer.joinedDate)}</td>
                            <td>
                                <label class="pill ${levelColor} rounded-pill">
                                    <span class="p-2 text-white fw-bold">${customer.customerLevel}</span>
                                </label>
                            </td>
                            <td>${customer.totalPoints}</td>
                            <td>${splitDateTime(customer.dob)}</td>
                            <td>${customer.addressCity}</td>
                            <td>${customer.postalCode}</td>
                            <td>${customer.email}</td>
                            <td>${splitDateTime(customer.recentPurchaseDateTime)}</td>
                            <td>
                                <button class="btn btn-outline-custom-black-colour edit-customer-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                                <button class="btn btn-outline-custom-red-colour delete-customer-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
                            </td>
                        </tr>
                    `);
                    $('.edit-customer-btn').last().click(function () {
                        editCustomer(customer);
                    });
                    $('.delete-customer-btn').last().click(function () {
                        deleteCustomer(customer);
                    });
                    $('#pagination').empty();
                });
            },
            error: function (xhr, status, error) {
                console.log("error fetching data");
            }
        });
    }
}
