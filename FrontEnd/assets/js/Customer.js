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
            console.log("success fetching data")
            $('#customer-table tbody').empty();
            $.each(data, function (index, customer) {
                $('#customer-table tbody').append(`
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td>${customer.customerName}</td>
                            <td>${customer.gender}</td>
                            <td>${splitDateTime(customer.joinedDate)}</td>
                            <td>
                                <label class="bg-success rounded-pill">
                                    <span class="p-2 text-white">${customer.customerLevel}</span>
                                </label>
                            </td>
                            <td>${customer.totalPoints}</td>
                            <td>${splitDateTime(customer.dob)}</td>
                            <td>${customer.addressCity}</td>
                            <td>${customer.postalCode}</td>
                            <td>${customer.email}</td>
                            <td>${splitDateTime(customer.recentPurchaseDateTime)}</td>
                            <td>
                                <button class="btn btn-outline-success edit-customer-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                                <button class="btn btn-outline-success delete-customer-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
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
        $('#pagination').append(`<button class="btn btn-outline-success" onclick="getDataToCustomerTable(${i}, page_size)">${i + 1}</button>`);
    }
}

function editCustomer(customer) {
    console.log(customer);
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
    console.log(customer);
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
    console.log("add new customer")
    clearPage();
    CUSTOMER_SECTION.css("display", "none");
    CUSTOMER_ADD_FORM.css("display", "block");

    getNextCustomerCode();// call backend to get next customer code when form load
});//In customer section

function getNextCustomerCode() {
    console.log("get Next Customer Code");
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

$('#addNewCustomer').on('click', () => {
    if ($('#customerAddForm')[0].checkValidity()) {
        saveCustomer();
    } else {
        $('#customerAddForm').addClass('was-validated');
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
    console.log(customer);
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/customer',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(customer),
        success: function (data) {
            console.log('Customer added successfully:', data);
        },
        error: function (xhr, status, error) {
            console.error('Error adding customer:', error);
        }
    });
}

$('#updateCustomer').on('click', () => {
    console.log("update Customer");

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
        },
        error: function (xhr, status, error) {
            console.error("Error updating customer:", error);
        }
    });

    CUSTOMER_UPDATE_FORM.css("display", "none");
    CUSTOMER_SECTION.css("display", "block");
});//In customer update form

$('#customer-search').on('click', () => {
    const searchText = $('#customer-search-text').val();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/spring-boot/api/v1/customer/search',
        data: {
            pageSize: pageSize,
            page: page,
            searchText: searchText
        },
        success: function(response) {
            // Update the customer table with the returned data
        },
        error: function(xhr, status, error) {
            // Handle errors
        }
    });
});
