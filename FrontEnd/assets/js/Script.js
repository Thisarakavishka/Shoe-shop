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
    initializeSuppliers();
    initializeCategories();
    initializeTypes();
    initializeColours();
    initializeSizes();
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

$("#profile-menu").on('click', () => {
    createAndShowModal(logged_user);
});

function formatDateString(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format date to yyyy-MM-dd
}

function generateModalHTML(user) {
    const formattedDob = formatDateString(user.dob);
    const formattedJoinedDate = formatDateString(user.joinedDate);

    return `
      <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="profileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="profileModalLabel">User Profile</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <img id="profilePic" src="data:image/png;base64,${user.profilePic}" class="rounded-3" alt="Profile Picture" style="width: 200px; height: 150px;">
                <input type="file" class="form-control custom-focus mt-2" id="profilePicInput">
              </div>
              <form id="profileForm" novalidate>
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="employeeName">Employee Name</label>
                    <input type="text" class="form-control" id="profileEmployeeName" value="${user.employeeName}" required>
                    <div class="invalid-feedback">
                      Please provide a valid employee name.
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="profileEmail" value="${user.email}" required>
                    <div class="invalid-feedback">
                      Please provide a valid email.
                    </div>
                  </div>
                  
                </div>
                <div class="row mt-3">
                  <div class="form-group col-md-6">
                    <label for="emergencyContactNumber">Emergency Contact Number</label>
                    <input type="text" class="form-control" id="profileEmergencyContactNumber" value="${user.emergencyContactNumber}" required>
                    <div class="invalid-feedback">
                      Please provide a valid emergency contact number.
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="contactNumber">Contact Number</label>
                    <input type="text" class="form-control" id="profileContactNumber" value="${user.contactNumber}" required>
                    <div class="invalid-feedback">
                      Please provide a valid contact number.
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="form-group col-md-6">
                    <label for="dob">Date of Birth</label>
                    <input type="date" class="form-control" id="profileDob" value="${formattedDob}" required>
                    <div class="invalid-feedback">
                      Please provide a valid date of birth.
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="joinedDate">Joined Date</label>
                    <input type="date" class="form-control" id="profileJoinedDate" value="${formattedJoinedDate}" required>
                    <div class="invalid-feedback">
                      Please provide a valid joined date.
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="form-group col-md-6">
                    <label for="addressNo">Address No</label>
                    <input type="text" class="form-control" id="profileAddressNo" value="${user.addressNo}" required>
                    <div class="invalid-feedback">
                      Please provide a valid address number.
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="addressLane">Address Lane</label>
                    <input type="text" class="form-control" id="profileAddressLane" value="${user.addressLane}" required>
                    <div class="invalid-feedback">
                      Please provide a valid address lane.
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="form-group col-md-6">
                    <label for="addressCity">Address City</label>
                    <input type="text" class="form-control" id="profileAddressCity" value="${user.addressCity}" required>
                    <div class="invalid-feedback">
                      Please provide a valid address city.
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="addressState">Address State</label>
                    <input type="text" class="form-control" id="profileAddressState" value="${user.addressState}" required>
                    <div class="invalid-feedback">
                      Please provide a valid address state.
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="form-group col-md-6">
                    <label for="postalCode">Postal Code</label>
                    <input type="text" class="form-control" id="profilePostalCode" value="${user.postalCode}" required>
                    <div class="invalid-feedback">
                      Please provide a valid postal code.
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="emergencyContactPerson">Emergency Contact Person</label>
                    <input type="text" class="form-control" id="profileEmergencyContactPerson" value="${user.emergencyContactPerson}" required>
                    <div class="invalid-feedback">
                      Please provide a valid emergency contact person.
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-outline-dark" id="saveProfile">Save changes</button>
            </div>
          </div>
        </div>
      </div>`;
}

function createAndShowModal(user) {
    const modalHTML = generateModalHTML(user);

    $('body').append(modalHTML);

    $('#profileModal').modal('show');

    $('#profilePicInput').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#profilePic').attr('src', e.target.result);
                user.profilePic = e.target.result.split(',')[1];
            };
            reader.readAsDataURL(file);
        }
    });

    $('#saveProfile').on('click', function () {
        let form = $('#profileForm')[0];
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        } else {
            let updatedProfile = {
                employeeCode: user.employeeCode,
                employeeName: $('#profileEmployeeName').val(),
                profilePic: user.profilePic,
                gender: user.gender,
                status: user.status,
                designation: user.designation,
                role: user.role,
                dob: $('#profileDob').val(),
                joinedDate: $('#profileJoinedDate').val(),
                branch: user.branch,
                addressNo: $('#profileAddressNo').val(),
                addressLane: $('#profileAddressLane').val(),
                addressCity: $('#profileAddressCity').val(),
                addressState: $('#profileAddressState').val(),
                postalCode: $('#profilePostalCode').val(),
                contactNumber: $('#profileContactNumber').val(),
                email: $('#profileEmail').val(),
                password: user.password,
                emergencyContactPerson: $('#profileEmergencyContactPerson').val(),
                emergencyContactNumber: $('#profileEmergencyContactNumber').val()
            };

            $.ajax({
                url: "http://localhost:8080/spring-boot/api/v1/employee/" + user.employeeCode,
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                contentType: "application/json",
                data: JSON.stringify(updatedProfile),
                success: function (response) {
                    console.log("Profile updated successfully");
                    Swal.fire({
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 250
                    });
                    logged_user = response;
                    $('#userProfileNameMenu').text(logged_user.employeeName);
                    $('#userProfilePicMenu').attr('src', `data:image/png;base64,${logged_user.profilePic}`);

                    $('#profileModal').modal('hide');
                },
                error: function (xhr, status, error) {
                    console.error("Error updating employee:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Something wrong",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });

        }
    });

    $('#profileModal').on('hidden.bs.modal', function () {
        $('#profileModal').remove();
    });
}
