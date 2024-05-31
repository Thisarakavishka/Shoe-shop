function loadRefundDataToTable() {
    getRefundData(3);
}

$("#refundDateRange").change(function () {
    const range = $(this).val();
    getRefundData(range);
});

function getRefundData(range) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/sales/within-days',
        method: 'GET',
        data: {days: range},
        success: function (data) {
            displayRefundData(data);
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function displayRefundData(data) {
    $('#refund-table tbody').empty();
    $.each(data, function (index, sale) {
        appendSaleToTable(index, sale);
    });
}

function appendSaleToTable(index, sale) {
    let customerDisplay = sale.customerCode ? sale.customerCode : 'Not a loyalty customer';

    $('#refund-table tbody').append(`
        <tr>
            <th scope="row">${index + 1}</th>
            <th scope="row">${sale.saleCode}</th>
            <td>${splitDateTime(sale.date)}</td>
            <td>${customerDisplay}</td>
            <td>${sale.employeeCode}</td>
            <td>${sale.totalPrice}</td>
            <td>${sale.paymentMethod}</td>
            <td>${sale.addedPoints}</td>
            <td>
                <button class="btn btn-outline-custom-black-colour edit-sale-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);

    $('.edit-sale-btn').last().click(function () {
        editSale(sale);
    });
}

function editSale(sale) {
    $('#editSaleModal').remove();

    const refundModal = `
        <div class="modal fade" id="editSaleModal" tabindex="-1" aria-labelledby="editSaleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editSaleModalLabel">Edit Sale</h5>
                        <button type="button" class="btn-close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <div id="refund-order-items-list" class="container-fluid"></div>
                        
                    </div>
                    <div class="modal-footer">
                        <div class="row mb-3">
                            <div class="col">
                                <label for="refundDescription" class="form-label">Reason for Refund</label>
                                <input type="text" class="form-control" id="refundDescription" required>
                                <div class="invalid-feedback">Please provide why you are refunding this item.</div>
                            </div>
                        </div>
                        <div class="me-auto">Total Refund: $<span id="totalRefund">0.00</span></div>
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal" id="closeModalBtn">Close</button>
                        <button type="button" class="btn btn-outline-dark" id="updateSaleBtn">Update Sale</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(refundModal);

    const cartContainer = $("#refund-order-items-list");

    sale.items.forEach(item => {
        item.colours.forEach(colour => {
            colour.sizes.forEach(size => {
                const cartItem = `
                    <div class="border border-secondary-subtle rounded mt-3 order-item" data-item-code="${item.itemCode}" data-color="${colour.colourName}" data-size="${size.size}" data-price="${colour.sellPrice || 0}" data-discount="${colour.discount || 0}">
                        <div class="row">
                            <div class="col-4">
                                <img src="${colour.image ? `data:image/png;base64,${colour.image}` : 'default_image.png'}" class="rounded" alt="Item Image" style="width: 125px; height: 125px">
                            </div>
                            <div class="col-6">
                                <span class="mt-2 item-name">${item.itemName || 'Item Name'}</span>
                                <label>Size: <span class="item-size">${size.size}</span></label>
                                <label class="ms-3">Color: <span class="item-color">${colour.colourName}</span></label>
                                <h6 class="text-success item-price">${colour.sellPrice ? colour.sellPrice.toFixed(2) : '0.00'}</h6>
                                <div class="mt-2 p-1">
                                    <button class="rounded btn btn-danger me-2 decrease-quantity">-</button>
                                    <span class="me-2 mt-2 item-quantity" data-max-quantity="${size.quantity}">${size.quantity}</span>
                                    <button class="rounded btn btn-success increase-quantity">+</button>
                                </div>
                            </div>
                            <div class="col-2">
                                <div class="d-flex justify-content-end p-1">
                                    <button type="button" class="btn-close remove-item-btn" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cartContainer.append(cartItem);
            });
        });
    });

    let totalRefund = 0;
    const removedItems = [];

    function updateTotalRefund() {
        $('#totalRefund').text(totalRefund.toFixed(2));
    }

    $(document).on('click', '.remove-item-btn', function () {
        const itemElement = $(this).closest('.order-item');
        const itemCode = itemElement.data('item-code');
        const itemName = itemElement.find('.item-name').text().trim();
        const selectedColor = itemElement.data('color');
        const selectedSize = itemElement.data('size');
        const quantity = parseInt(itemElement.find('.item-quantity').text());
        const sellPrice = parseFloat(itemElement.data('price'));
        const discount = parseFloat(itemElement.data('discount'));

        let sizes = [{
            size: selectedSize,
            quantity: quantity
        }];

        let colours = [{
            colourName: selectedColor,
            image: '',
            sellPrice: sellPrice,
            buyPrice: 0.0,
            sizes: sizes
        }];

        removedItems.push({
            itemCode: itemCode,
            itemName: itemName,
            categoryName: '',
            supplierName: '',
            typeName: '',
            gender: 'UNISEX',
            profitMargin: 0.0,
            expectedProfit: 0.0,
            colours: colours
        });

        totalRefund += (sellPrice - (sellPrice * discount / 100)) * quantity;
        itemElement.remove();
        updateTotalRefund();
    });

    $(document).on('click', '.decrease-quantity', function () {
        const quantityElement = $(this).siblings('.item-quantity');
        let quantity = parseInt(quantityElement.text());
        const itemElement = $(this).closest('.order-item');
        const price = parseFloat(itemElement.data('price'));
        const discount = parseFloat(itemElement.data('discount'));

        if (quantity > 1) {
            quantity--;
            quantityElement.text(quantity);
            totalRefund += (price - (price * discount / 100));
        } else {
            const itemCode = itemElement.data('item-code');
            const itemName = itemElement.find('.item-name').text().trim();
            const selectedColor = itemElement.data('color');
            const selectedSize = itemElement.data('size');

            let sizes = [{
                size: selectedSize,
                quantity: quantity
            }];

            let colours = [{
                colourName: selectedColor,
                image: '',
                sellPrice: price,
                buyPrice: 0.0,
                sizes: sizes
            }];

            removedItems.push({
                itemCode: itemCode,
                itemName: itemName,
                categoryName: '',
                supplierName: '',
                typeName: '',
                gender: 'UNISEX',
                profitMargin: 0.0,
                expectedProfit: 0.0,
                colours: colours
            });

            totalRefund += (price - (price * discount / 100));
            itemElement.remove();
        }
        updateTotalRefund();
    });

    $(document).on('click', '.increase-quantity', function () {
        const quantityElement = $(this).siblings('.item-quantity');
        const maxQuantity = parseInt(quantityElement.data('max-quantity'));
        let quantity = parseInt(quantityElement.text());
        const itemElement = $(this).closest('.order-item');
        const price = parseFloat(itemElement.data('price'));
        const discount = parseFloat(itemElement.data('discount'));

        if (quantity < maxQuantity) {
            quantity++;
            quantityElement.text(quantity);
            totalRefund += (price - (price * discount / 100));
        }
        updateTotalRefund();
    });

    $('#editSaleModal').modal('show');

    $('#closeModalBtn').on('click', function () {
        $('#editSaleModal').modal('hide');
    });

    $('.btn-close-modal').on('click', function () {
        $('#editSaleModal').modal('hide');
    });

    updateTotalRefund();

    $('#updateSaleBtn').on('click', function () {
        const description = $('#refundDescription').val().trim();

        if (!description) {
            $('#refundDescription').addClass('is-invalid');
            return;
        } else {
            $('#refundDescription').removeClass('is-invalid');
        }

        const refundDescription = $('#refundDescription').val().trim();
        const updateData = {
            saleCode: sale.saleCode,
            totalRefund: totalRefund,
            date: new Date().toISOString(),
            addedPoints: 2, // Assuming you have logic to calculate this correctly
            employeeCode: 'EMP002', // Assuming this is the logged-in employee
            refundDescription: refundDescription,
            items: removedItems
        };

        console.log(updateData);

        // check credential

        $('#credentialsModal').remove();

        const credentialsModal = `
            <div class="modal bg-light" id="credentialsModal" tabindex="-1" aria-labelledby="credentialsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="credentialsModalLabel">Enter Credentials</h5>
                            <button type="button" class="btn-close credentialsModalCloseBtn" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="credentialsForm" class="needs-validation" novalidate>
                                <div class="mb-3">
                                    <label for="employeeUsername" class="form-label">Username</label>
                                    <input type="text" class="form-control" id="employeeUsername" required>
                                    <div class="invalid-feedback">Please enter your username.</div>
                                </div>
                                <div class="mb-3">
                                    <label for="employeePassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="employeePassword" required>
                                    <div class="invalid-feedback">Please enter your password.</div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-dark credentialsModalCloseBtn2" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-dark" id="confirmUpdateBtn">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(credentialsModal);

        function validateForm() {
            const form = document.querySelector('#credentialsForm');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return false;
            }
            return true;
        }

        $('#confirmUpdateBtn').on('click', function () {
            if (validateForm()) {
                const username = $('#employeeUsername').val().trim();
                const password = $('#employeePassword').val().trim();

                checkAdminCredentials(username, password, function (isValid) {
                    if (isValid) {
                        onConfirm();
                        $('#credentialsModal').modal('hide');
                        $('#credentialsModal').remove();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Invalid Credentials",
                            text: "Please check your credentials and try again.",
                            showConfirmButton: true
                        });
                    }
                });
            }
        });

        function checkAdminCredentials(username, password, callback) {
            $.ajax({
                url: 'http://localhost:8080/spring-boot/api/v1/employee/check-credentials',
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded',
                data: $.param({
                    email: username,
                    password: password
                }),
                success: function (response) {
                    callback(true);
                },
                error: function (error) {
                    console.error('Error validating credentials:', error);
                    callback(false);
                }
            });
        }

        $('#credentialsModal').on('hidden.bs.modal', function () {
            $('#credentialsModal').remove();
            $('.modal-backdrop').last().remove();
        });

        $('#credentialsModal').modal('show');

        $('.credentialsModalCloseBtn ').on('click', function () {
            $('#credentialsModal').modal('hide');
        });
        $('.credentialsModalCloseBtn2').on('click', function () {
            $('#credentialsModal').modal('hide');
        });

        function onConfirm() {

            console.log(updateData);

            $.ajax({
                url: `http://localhost:8080/spring-boot/api/v1/sales/${sale.saleCode}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updateData), // Send updateData directly
                success: function (response) {
                    console.log('Sale updated successfully:', response);
                    Swal.fire({
                        icon: "success",
                        title: "Refund successfully",
                        text: "Refund amount " + totalRefund,
                        showConfirmButton: true
                    });
                    $('#editSaleModal').modal('hide');
                    loadRefundDataToTable();
                },
                error: function (error) {
                    console.error('Error updating sale:', error);
                    Swal.fire({
                        icon: "error",
                        title: "Error while Refund",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
        }
    });
}