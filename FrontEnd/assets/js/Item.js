const suppliers = [];
const categories = [];
const types = [];
const colours = [];
const sizes = [];
const items = [];

let item_page_size = 10;
let next_item_code;
let update_item;
let view_item;

function viewItem(item) {
    view_item = item;
    const modalHtml = `
        <div class="modal fade" id="itemModal" tabindex="-1" aria-labelledby="itemModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        ${item.colours.map((color, index) => `<button class="btn btn-outline-custom-black-colour me-2" onmouseenter="showDetails(view_item,'${color.colourName}')" ${index === 0 ? "id='autoClickButton'" : ""}>${color.colourName}</button>`).join('')}
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="itemDetails"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-custom-black-colour" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#itemModal').remove();
    $('body').append(modalHtml);
    $('#itemModal').modal('show');
    $("#autoClickButton").mouseenter();
}

function showDetails(item, colourName) {
    const colour = item.colours.find(c => c.colourName === colourName);

    const detailsHtml = `
        <div>
            <label class="border border-secondary rounded p-2 text-secondary"><span><b>${item.supplierName}</b> </span></label>
            <label class="border border-secondary rounded p-2 ms-2 text-secondary"><span><b>${item.typeName}</b> </span></label>
        </div>
        <div class="mt-2">
            <label class="border border-success rounded p-2 text-success"><span>Profit Margin: <b>${item.profitMargin}%</b> </span></label>
            <label class="border border-success rounded p-2 ms-2 text-success"><span>Expected Profit: <b>$${item.expectedProfit}</b> </span></label>
        </div>
        <div class="mt-2">
            <label class="border border-success rounded p-2 text-success"><span>Sell Price: <b>$${colour.sellPrice}</b> </span></label>
            <label class="border border-success rounded p-2 ms-2 text-success"><span>Buy Price: <b>$${colour.buyPrice}</b> </span></label>
        </div>
        <div class="text-center mt-3">
            <img src="data:image/png;base64,${colour.image}" class="rounded" alt="Color Image" style="width: 370px; height: 400px;">
        </div>
        <div class="mt-3">
            <div class="row">
                ${colour.sizes.map(size => `
                    <div class="col-6 col-md-4 col-lg-3 mt-2">
                        <div class="border border-dark rounded">
                            <div class="text-white bg-dark p-2 text-center rounded-top-1">
                                <span> <b>Size: ${size.size}</b> </span>
                            </div>
                            <div class="p-2 text-center">
                                <span>Qty: <b>${size.quantity}</b> </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    $('#itemDetails').html(detailsHtml);
}

async function updateItem(event) {

    const item = {
        "itemCode": update_item.itemCode,
        "itemName": $('#updateItemName').val(),
        "categoryName": $('#updateItemCategory').val(),
        "supplierName": $('#updateItemSupplier').val(),
        "typeName": $('#updateItemType').val(),
        "gender": $("input[name='updateGender']:checked").next('label').text().trim(),
        "profitMargin": $('#updateItemProfitMargin').val(),
        "expectedProfit": $('#updateItemExpectedProfit').val(),
        "colours": []
    };

    function addUpdatedColorObject(colorSectionId, colourName, imageBase64String, sellPrice, buyPrice, sizes) {
        item.colours.push({
            "colourName": colourName,
            "image": imageBase64String,
            "sellPrice": sellPrice,
            "buyPrice": buyPrice,
            "sizes": sizes
        });
    }

    function readUpdatedImageFile(imageInput) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target.result.split(',')[1]);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(imageInput);
        });
    }

    const promises = $('.mb-3[id^="colorSectionUpdate"]').map(async function () {
        const colorSectionId = $(this).attr('id');
        const colourName = $(`#colourSelect-${colorSectionId}`).val();
        const imageInput = $(`#colourImageInput-${colorSectionId}`)[0].files[0];
        const hiddenImage = $(`#hiddenColourImage-${colorSectionId}`).val();
        const sellPrice = $(`#sellPriceInput-${colorSectionId}`).val();
        const buyPrice = $(`#buyPriceInput-${colorSectionId}`).val();
        const sizes = [];

        const imageBase64String = imageInput ? await readUpdatedImageFile(imageInput) : hiddenImage;

        addUpdatedColorObject(colorSectionId, colourName, imageBase64String, sellPrice, buyPrice, sizes);

        $(`#sizeInputsRow-${colorSectionId} input[type='text']`).each(function () {
            sizes.push({
                "size": $(this).prev().text(),
                "quantity": $(this).val()
            });
        });
    }).get();

    try {
        await Promise.all(promises);

        console.log(item);

        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/item/' + update_item.itemCode,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(item),
            success: function (data) {
                console.log('item updated successfully:', data);
                Swal.fire({
                    icon: "success",
                    title: "Your Item has been updated",
                    showConfirmButton: false,
                    timer: 1000
                });
                event.preventDefault();
                getDataToItemTable(0, item_page_size);
                ITEM_UPDATE_FORM.css("display", "none");
                ITEM_SECTION.css("display", "block");
            },
            error: function (xhr, status, error) {
                console.error('Error updating item:', error);
                Swal.fire({
                    icon: "error",
                    title: status,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });

    } catch (error) {
        console.error('Error reading image file:', error);
    }
}

function getNextItemCode() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/item/next-code',
        type: 'GET',
        success: function (data) {
            next_item_code = data;
        },
        error: function () {
            console.error("Error fetching next item code")
        }
    });
}

$("#update-item-button").on('click', updateItem);

function addColourSection(index, color) {
    const colorSectionId = `colorSectionUpdate${index}`;
    const colorSection = $('<div>').addClass('mb-3').attr('id', colorSectionId);

    colorSection.append(`
        <div class="row">
            <hr>
            <div class="col-md-6">
                <label for="colourSelect-${colorSectionId}" class="form-label mt-2">Colour</label>
                <select class="form-select custom-focus" id="colourSelect-${colorSectionId}" required>
                    <option value="" disabled>Select Colour</option>
                </select>
                <div class="invalid-feedback">Please select a colour.</div>
            </div>
            <div class="col-md-6">
                <label for="colourImageInput-${colorSectionId}" class="form-label mt-2">Image</label>
                <input type="file" class="form-control custom-focus" id="colourImageInput-${colorSectionId}" accept="image/*" required>
                <input type="hidden" id="hiddenColourImage-${colorSectionId}" value="${color.image}">
                <img id="imagePreview-${colorSectionId}" src="data:image/jpeg;base64,${color.image}" alt="Image Preview" style="max-width: 100%; height: auto; ${(color.image ? 'display: block;' : 'display: none;')} margin-top: 10px;">
                <div class="invalid-feedback">Please select shoe image.</div>
            </div>
            <div class="col-md-6">
                <label for="sellPriceInput-${colorSectionId}" class="form-label mt-2">Sell Price</label>
                <input type="text" class="form-control custom-focus" id="sellPriceInput-${colorSectionId}" placeholder="Sell Price" value="${color.sellPrice}" required>
                <div class="invalid-feedback">Please enter Sell price.</div>
            </div>
            <div class="col-md-6">
                <label for="buyPriceInput-${colorSectionId}" class="form-label mt-2">Buy Price</label>
                <input type="text" class="form-control custom-focus" id="buyPriceInput-${colorSectionId}" placeholder="Buy Price" value="${color.buyPrice}" required>
                <div class="invalid-feedback">Please enter Buy price.</div>
            </div>
        </div>

        <div class="mb-3 sizes-row">
            <label class="form-label mt-3">Sizes</label>
            <div class="row" id="sizeInputsRow-${colorSectionId}">
                <div class="col-3">
                    <select class="form-select custom-focus" id="sizeSelect-${colorSectionId}" required>
                        <option value="" selected disabled>Select Size</option>
                    </select>
                </div>
                <div class="col-9 d-flex align-items-center justify-content-start">
                    <button class="btn btn-outline-dark add-size-button me-3" data-section="${colorSectionId}">Add Size</button>
                    <button class="btn btn-outline-dark clear-size-button" data-section="${colorSectionId}">Clear Sizes</button>
                    <button class="btn btn-outline-danger clear-color-section-button ms-2" data-section="${colorSectionId}">Remove Colour</button>
                </div>
            </div>
        </div>
    `);

    $('#color-section-update-container').append(colorSection);

    fetchEditColours(colorSectionId, color.colourName);
    fetchEditSizes(colorSectionId, color.sizes);

    $(document).on('click', `.add-size-button[data-section="${colorSectionId}"]`, function (event) {
        event.preventDefault();
        const selectedSize = $(`#sizeSelect-${colorSectionId}`).val();
        if (!selectedSize) {
            $(`#sizeSelect-${colorSectionId}`).addClass('is-invalid');
            return;
        } else {
            $(`#sizeSelect-${colorSectionId}`).removeClass('is-invalid');
        }

        const sizeExists = $(`#sizeInputsRow-${colorSectionId} label`).filter(function () {
            return $(this).text() === selectedSize;
        }).length > 0;

        if (sizeExists) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "This size already added",
                showConfirmButton: false,
                timer: 800
            });
            return;
        }

        const label = $('<label>').addClass('form-label p-4 rounded mt-4 border-black border fs-5 fw-bold').text(selectedSize);
        const inputField = $('<input>').attr('type', 'text').addClass('form-control me-2 mt-3 col-2 custom-focus').attr('placeholder', 'Size').val(50).css('margin-left', '10px');
        $(`#sizeInputsRow-${colorSectionId}`).append($('<div>').addClass('col-1').css('margin-left', `50px`).append(label).append(inputField));
    });

    $(document).on('click', `.clear-size-button[data-section="${colorSectionId}"]`, function (event) {
        event.preventDefault();
        $(`#sizeInputsRow-${colorSectionId} .col-1, #sizeInputsRow-${colorSectionId} label, #sizeInputsRow-${colorSectionId} hr`).remove();
    });

    $(document).on('click', `.clear-color-section-button[data-section="${colorSectionId}"]`, function (event) {
        event.preventDefault();
        $(`#${colorSectionId}`).remove();
    });

    $(`#colourImageInput-${colorSectionId}`).on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $(`#imagePreview-${colorSectionId}`).attr('src', e.target.result);
                $(`#imagePreview-${colorSectionId}`).css("display", "block");
                $(`#hiddenColourImage-${colorSectionId}`).val(e.target.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    });
}

function fetchEditColours(sectionId, selectedColour) {
    const select = $(`#colourSelect-${sectionId}`);
    colours.forEach(colour => {
        const option = $('<option>').attr('value', colour.colourName).text(colour.colourName);
        select.append(option);
    });

    if (selectedColour) {
        select.val(selectedColour);
    }
}

function fetchEditSizes(sectionId, selectedSizes) {
    const select = $(`#sizeSelect-${sectionId}`);

    sizes.forEach(size => {
        const option = $('<option>').attr('value', size.size).text(size.size);
        select.append(option);
    });

    if (selectedSizes) {
        selectedSizes.forEach(size => {
            const label = $('<label>').addClass('form-label p-4 rounded mt-4 border-black border fs-5 fw-bold').text(size.size);
            const inputField = $('<input>').attr('type', 'text').addClass('form-control me-2 mt-3 col-2 custom-focus').attr('placeholder', 'Size').val(50).css('margin-left', '10px');
            $(`#sizeInputsRow-${sectionId}`).append($('<div>').addClass('col-1').css('margin-left', `50px`).append(label).append(inputField));
        });
    }
}

$('#add-new-colour-update-section').on('click', function (event) {
    event.preventDefault();
    const newIndex = $('#color-section-update-container .mb-3').length + 1;
    const colour = {
        "colourName": "",
        "image": "",
        "sellPrice": "",
        "buyPrice": "",
        "sizes": []
    }
    addColourSection(newIndex, colour);
});

$("#cancel-update-item-button").on('click', () => {
    event.preventDefault();
    ITEM_UPDATE_FORM.css("display", "none");
    ITEM_SECTION.css("display", "block");
});

function editItem(item) {
    ITEM_SECTION.css("display", "none");
    ITEM_UPDATE_FORM.css("display", "block");

    update_item = item;
    $('#updateItemName').val(item.itemName);
    $('#updateItemProfitMargin').val(item.profitMargin);
    $('#updateItemExpectedProfit').val(item.expectedProfit);
    fetchSuppliers();
    fetchCategories();
    fetchTypes();
    $('#updateItemSupplier').val(item.supplierName).change();
    $('#updateItemCategory').val(item.categoryName).change();
    $('#updateItemType').val(item.typeName).change();
    $(`input[name="updateGender"][value="${item.gender.toUpperCase()}"]`).prop('checked', true);
    $('#color-section-update-container').empty();
    item.colours.forEach((colour, index) => {
        addColourSection(index + 1, colour);
    });
}

function deleteItem(item) {
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
                url: 'http://localhost:8080/spring-boot/api/v1/item/' + item.itemCode,
                type: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Item has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getDataToItemTable(0, item_page_size);
                        getItemPageCount();
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting Item:', error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete item.",
                        icon: "error"
                    });
                }
            });
        }
    });
}

function appendItemToTable(index, item) {
    $('#item-table tbody').append(`
        <tr>
            <th scope="row" class="align-middle">${index + 1}</th>
            <th>
                <img src="data:image/png;base64,${item.colours[0].image}" class="rounded" alt="Profile Pic" style="width: 50px; height: 50px;">
            </th>
            <td class="align-middle">${item.itemName}</td>
            <td class="align-middle">${item.categoryName}</td>
            <td class="align-middle">${item.typeName}</td>
            <td class="align-middle">${item.profitMargin}%</td>
            <td class="align-middle">$${item.expectedProfit}</td>
            <td class="align-middle">
                <button class="btn btn-outline-custom-black-colour view-item-btn btn-sm"><i class="fa fa-eye fa-lg" aria-hidden="true"></i></button>
                <button class="btn btn-outline-custom-black-colour edit-item-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                <button class="btn btn-outline-custom-red-colour delete-item-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);
    $('.view-item-btn').last().click(function () {
        viewItem(item);
    });
    $('.edit-item-btn').last().click(function () {
        editItem(item);
    });
    $('.delete-item-btn').last().click(function () {
        deleteItem(item);
    });
}

function displayItemData(data, page, size) {
    $("#item-table tbody").empty();
    $.each(data, function (index, item) {
        appendItemToTable(index + (page * size), item);
    })
}

function getDataToItemTable(page, size) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/item',
        method: 'GET',
        data: {page: page, size: size},
        success: function (data) {
            displayItemData(data, page, size);
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function itemPaginationButtons(totalPages) {
    $("#itemPagination").empty();
    for (let i = 0; i < totalPages; i++) {
        $('#itemPagination').append(`<button class="btn btn-outline-custom-black-colour me-2" onclick="getDataToItemTable(${i}, item_page_size)">${i + 1}</button>`);
    }
}

function getItemPageCount() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/item/page-size',
        method: 'GET',
        data: {size: item_page_size},
        success: function (data) {
            console.log('success fetching count of item pages');
            itemPaginationButtons(data);
        },
        error: function () {
            console.error('Error fetching item count of pages');
        }
    });
}

function loadItemAddFormData() {
    fetchSuppliers();
    fetchCategories();
    fetchTypes();
    let colorSectionCount = 0;

    $('#add-new-colour-section').click(function () {
        event.preventDefault();
        colorSectionCount++;
        const colorSectionId = `colorSection${colorSectionCount}`;
        const colorSection = $('<div>').addClass('mb-3').attr('id', colorSectionId);

        colorSection.append(`
            <div class="row">
                <hr>
                <div class="col-md-6">
                    <label for="colourSelect-${colorSectionId}" class="form-label mt-2">Colour</label>
                    <select class="form-select custom-focus" id="colourSelect-${colorSectionId}" required>
                        <option value="" selected disabled>Select Colour</option>
                    </select>
                    <div class="invalid-feedback">Please select a colour.</div>
                </div>
                <div class="col-md-6">
                    <label for="colourImageInput-${colorSectionId}" class="form-label mt-2">Image</label>
                    <input type="file" class="form-control custom-focus" id="colourImageInput-${colorSectionId}" accept="image/*">
                    <img id="imagePreview-${colorSectionId}" alt="Image Preview" style="max-width: 100%; height: auto; display: none; margin-top: 10px;">
                    <div class="invalid-feedback">Please select shoe image.</div>
                </div>    
                <div class="col-md-6">
                    <label for="sellPriceInput-${colorSectionId}" class="form-label mt-2">Sell Price</label>
                    <input type="text" class="form-control custom-focus" id="sellPriceInput-${colorSectionId}" placeholder="Sell Price" required>
                    <div class="invalid-feedback">Please enter Sell price.</div>
                </div>
                <div class="col-md-6">
                    <label for="buyPriceInput-${colorSectionId}" class="form-label mt-2">Buy Price</label>
                    <input type="text" class="form-control custom-focus" id="buyPriceInput-${colorSectionId}" placeholder="Buy Price" required>
                    <div class="invalid-feedback">Please enter Buy price.</div>
                </div>
            </div>

            <div class="mb-3 sizes-row">
                <label class="form-label mt-3">Sizes</label>
                <div class="row" id="sizeInputsRow-${colorSectionId}">
                    <div class="col-3">
                        <select class="form-select custom-focus " id="sizeSelect-${colorSectionId}" required>
                            <option value="" selected disabled>Select Size</option>
                        </select>
                    </div>
                    <div class="col-9 d-flex align-items-center justify-content-start">
                        <button class="btn btn-outline-dark add-size-button me-3" data-section="${colorSectionId}">Add Size</button>
                        <button class="btn btn-outline-dark clear-size-button" data-section="${colorSectionId}">Clear Sizes</button>
                        <button class="btn btn-outline-danger clear-color-section-button ms-2" data-section="${colorSectionId}">Remove Colour</button>
                    </div>
                </div>
            </div>
        `);

        $('#add-new-colour-section').before(colorSection);
        fetchColours(colorSectionId);
        fetchSizes(colorSectionId);

        $(document).on('click', `.add-size-button[data-section="${colorSectionId}"]`, function () {
            event.preventDefault();
            const selectedSize = $(`#sizeSelect-${colorSectionId}`).val();
            if (!selectedSize) {
                $(`#sizeSelect-${colorSectionId}`).addClass('is-invalid');
                return;
            } else {
                $(`#sizeSelect-${colorSectionId}`).removeClass('is-invalid');
            }

            const sizeExists = $(`#sizeInputsRow-${colorSectionId} label`).filter(function () {
                return $(this).text() === selectedSize;
            }).length > 0;

            if (sizeExists) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "This size already added",
                    showConfirmButton: false,
                    timer: 800
                });
                return;
            }

            const label = $('<label>').addClass('form-label p-4 rounded mt-4 border-black border fs-5 fw-bold').text(selectedSize);
            const inputField = $('<input>').attr('type', 'text').addClass('form-control me-2 mt-3 col-2 custom-focus').attr('placeholder', 'Size').val(50).css('margin-left', '10px');
            $(`#sizeInputsRow-${colorSectionId}`).append($('<div>').addClass('col-1').css('margin-left', `50px`).append(label).append(inputField));
        });

        $(document).on('click', `.clear-size-button[data-section="${colorSectionId}"]`, function () {
            event.preventDefault();
            $(`#sizeInputsRow-${colorSectionId} .col-2, #sizeInputsRow-${colorSectionId} label, #sizeInputsRow-${colorSectionId} hr`).remove();
        });

        $(document).on('click', `.clear-color-section-button[data-section="${colorSectionId}"]`, function () {
            event.preventDefault();
            $(`#${colorSectionId}`).remove();
        });

        $(document).on('change', 'input[type="file"]', function (event) {
            const colorSectionId = $(this).attr('id').replace('colourImageInput-', '');
            const reader = new FileReader();
            reader.onload = function () {
                const output = document.getElementById(`imagePreview-${colorSectionId}`);
                output.src = reader.result;
                $(output).css("display", "block");
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    });
}

$("#add-item-button").on('click', () => {
    if ($('#itemAddForm')[0].checkValidity()) {
        saveItem();
    } else {
        $('#itemAddForm').addClass('was-validated');
        event.preventDefault();
    }

});

function saveItem() {
    const item = {
        "itemCode": next_item_code,
        "itemName": $('#item-name').val(),
        "categoryName": $('#itemCategory').val(),
        "supplierName": $('#itemSupplier').val(),
        "typeName": $('#itemType').val(),
        "gender": $("input[name='gender']:checked").next('label').text().trim(),
        "profitMargin": $('#item-profit-margin').val(),
        "expectedProfit": $('#item-expected-profit').val(),
        "colours": []
    };

    function addColorObject(colorSectionId, colourName, imageBase64String, sellPrice, buyPrice, sizes) {
        item.colours.push({
            "colourName": colourName,
            "image": imageBase64String,
            "sellPrice": sellPrice,
            "buyPrice": buyPrice,
            "sizes": sizes
        });
    }

    function readImageFile(imageInput) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target.result.split(',')[1]);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(imageInput);
        });
    }

    const promises = $('.mb-3[id^="colorSection"]').map(async function () {
        const colorSectionId = $(this).attr('id');
        const colourName = $(`#colourSelect-${colorSectionId}`).val();
        const imageInput = $(`#colourImageInput-${colorSectionId}`)[0].files[0];
        const sellPrice = $(`#sellPriceInput-${colorSectionId}`).val();
        const buyPrice = $(`#buyPriceInput-${colorSectionId}`).val();
        const sizes = [];

        const imageBase64String = await readImageFile(imageInput);

        addColorObject(colorSectionId, colourName, imageBase64String, sellPrice, buyPrice, sizes);

        $(`#sizeInputsRow-${colorSectionId} input[type='text']`).each(function () {
            sizes.push({
                "size": $(this).prev().text(),
                "quantity": $(this).val()
            });
        });
    }).get();

    Promise.all(promises).then(() => {
        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/item',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(item),
            success: function (data) {
                console.log('item added successfully:', data);
                Swal.fire({
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1000
                });
                event.preventDefault();
                ITEM_ADD_FORM.css("display", "none");
                ITEM_SECTION.css("display", "block");
            },
            error: function (xhr, status, error) {
                console.error('Error adding Item:', error);
                Swal.fire({
                    icon: "error",
                    title: status,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });
    }).catch(error => {
        console.error('Error reading image file:', error);
    });
}

function initializeSuppliers() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier/all',
        type: 'GET',
        success: function (data) {
            suppliers.length = 0;
            data.forEach(function (supplier) {
                suppliers.push(supplier);
            });
            console.log("Initialize Suppliers Array");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function initializeCategories() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/category',
        type: 'GET',
        success: function (data) {
            categories.length = 0;
            data.forEach(function (category) {
                categories.push(category);
            })
            console.log("Initialize Categories Array");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function initializeTypes() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/type',
        type: 'GET',
        success: function (data) {
            types.length = 0;
            data.forEach(function (type) {
                types.push(type);
            });
            console.log("Initialize Types Array");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function initializeColours() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/colour',
        type: 'GET',
        success: function (data) {
            colours.length = 0;
            data.forEach(function (colour) {
                colours.push(colour);
            });
            console.log("Initialize Colours Array");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function initializeSizes() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/size',
        type: 'GET',
        success: function (data) {
            sizes.length = 0;
            data.forEach(function (size) {
                sizes.push(size);
            });
            console.log("Initialize Sizes Array");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function initializeItems() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/item/pos-search',
        type: 'GET',
        success: function (data) {
            items.length = 0;
            data.content.forEach(function (item) {
                items.push(item);
            });
            console.log("Initialized Items Array");
            createItemCards();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function fetchSuppliers() {
    $('#itemSupplier').empty();
    $('#updateItemSupplier').empty();
    $('#itemCartSupplier').empty();

    suppliers.forEach(function (supplier) {
        $('#itemSupplier').append($('<option>', {
            value: supplier.supplierName,
            text: supplier.supplierName
        }));
        $('#updateItemSupplier').append($('<option>', {
            value: supplier.supplierName,
            text: supplier.supplierName
        }));
        $('#itemCartSupplier').append($('<option>', {
            value: supplier.supplierName,
            text: supplier.supplierName
        }));
    });
}

function fetchCategories() {
    $('#itemCategory').empty();
    $('#updateItemCategory').empty();
    $('#itemCartCategory').empty();

    categories.forEach(function (category) {
        $("#itemCategory").append($('<option>', {
            value: category.categoryName,
            text: category.categoryName
        }));
        $("#updateItemCategory").append($('<option>', {
            value: category.categoryName,
            text: category.categoryName
        }));
        $("#itemCartCategory").append($('<option>', {
            value: category.categoryName,
            text: category.categoryName
        }));
    });
}

function fetchTypes() {
    $('#itemType').empty();
    $('#updateItemType').empty();
    $('#itemCartType').empty();

    types.forEach(function (type) {
        $("#itemType").append($('<option>', {
            value: type.typeName,
            text: type.typeName
        }));
        $("#updateItemType").append($('<option>', {
            value: type.typeName,
            text: type.typeName
        }));
        $("#itemCartType").append($('<option>', {
            value: type.typeName,
            text: type.typeName
        }));
    });

}

function fetchColours(colorSectionId) {
    $(`#colourSelect-${colorSectionId}`).empty();

    colours.forEach(function (colour) {
        $(`#colourSelect-${colorSectionId}`).append($('<option>', {
            value: colour.colourName,
            text: colour.colourName
        }));
    });

}

function fetchSizes(colorSectionId) {
    $(`#sizeSelect-${colorSectionId}`).empty();

    sizes.forEach(function (size) {
        $(`#sizeSelect-${colorSectionId}`).append($('<option>', {
            value: size.size,
            text: size.size
        }));
    });
}

function getItemSearchResult() {
    event.preventDefault();
    const searchText = $('#item-search-text').val().trim();
    if (searchText === '') {
        getDataToItemTable(0, item_page_size);
        getItemPageCount();
    } else {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/spring-boot/api/v1/item/search',
            data: {query: searchText},
            success: function (data) {
                displayItemData(data, 0, data.length);
                $('#itemPagination').empty();
            },
            error: function (xhr, status, error) {
                console.log("error fetching Item Search data")
            }
        });
    }
}

$("#item-search-text").on('input', () => {
    getItemSearchResult();
});

$("#item-search").on('click', () => {
    getItemSearchResult();
});

$("#add-new-item").on('click', () => {
    ITEM_SECTION.css("display", "none");
    ITEM_ADD_FORM.css("display", "block");
    getNextItemCode();
    loadItemAddFormData();
});

$("#cancel-add-item-button").on('click', () => {
    event.preventDefault();
    ITEM_ADD_FORM.css("display", "none");
    ITEM_SECTION.css("display", "block");
});

function createItemCards() {
    const container = $("#itemCardRow");
    container.empty();

    items.forEach((item) => {
        const cardTop = `
            <div class="col-md-4 mt-3 card-container">
                <div class="border border-black rounded">
                    <div class="row">
                        <img src="data:image/png;base64,${item.colours[0].image}" style="height: 270px;" alt="Shoe Image" class="rounded item-image" data-item="${item.itemCode}">
                        <span class="mt-2 ms-2">${item.itemName}</span>
                    </div>
                    <div class="p-3">
                        <div class="mt-2">
                            <div class="d-flex flex-wrap justify-content-start color-buttons" data-item="${item.itemCode}">
                                <div class="row">
                                    ${item.colours.map(color => `
                                        <div class="col-auto p-1">
                                            <button class="btn btn-outline-dark btn-sm w-100 color-btn" data-item="${item.itemCode}" data-color="${color.colourName}" data-image="${color.image}" data-price="${color.sellPrice}">${color.colourName}</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="mt-2 itemCardBody${item.itemCode}"></div>
                        <div class="mt-2 d-flex justify-content-center price-container" data-item="${item.itemCode}">
                            <span class="item-price text-success fw-bold">${item.colours[0].sellPrice.toFixed(2)}</span>
                        </div>
                        <div class="mt-2 d-flex justify-content-center">
                            <button class="btn btn-outline-custom-black-colour btn-sm add-to-cart-btn" data-item="${item.itemCode}" style="width: 180px;">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(cardTop);
    });

    $('.color-btn').on('click', function () {
        const selectedColor = $(this).data('color');
        const itemCode = $(this).data('item');
        const itemImage = $(".item-image[data-item='" + itemCode + "']");
        const itemCardBody = $(".itemCardBody" + itemCode);
        const priceContainer = $(`.price-container[data-item='${itemCode}'] .item-price`);

        const imageSrc = $(this).data('image');
        const price = $(this).data('price');

        itemImage.attr('src', "data:image/png;base64," + imageSrc);
        priceContainer.text(price.toFixed(2));

        $(`.color-btn[data-item='${itemCode}']`).removeClass('btn-dark').addClass('btn-outline-dark');
        $(this).removeClass('btn-outline-dark').addClass('btn-dark');

        const item = items.find(item => item.itemCode === itemCode);
        const color = item.colours.find(color => color.colourName === selectedColor);

        itemCardBody.empty();
        const updatedBody = `
            <div class="flex-wrap justify-content-start">
                <div class="row">
                    ${color.sizes.map(size => `
                        <div class="col-3 p-1">
                            <button class="btn ${size.quantity < 10 ? 'btn-outline-danger' : 'btn-outline-dark'} btn-sm w-100 size-btn"
                                data-item="${item.itemCode}" data-quantity="${size.quantity}" data-size="${size.size}"
                                ${size.quantity <= 0 ? 'disabled' : ''}>
                                ${size.size}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        itemCardBody.append(updatedBody);

        attachSizeButtonListeners(itemCode);
    });

    $('.add-to-cart-btn').on('click', function () {
        const itemCode = $(this).data('item');
        const item = items.find(item => item.itemCode === itemCode);
        const selectedColor = $(`.color-btn[data-item='${itemCode}'].btn-dark`).data('color');
        const selectedSize = $(`.size-btn[data-item='${itemCode}'].btn-dark`).data('size');

        if (!selectedColor || !selectedSize) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Please select a color and size.",
                showConfirmButton: false,
                timer: 800
            });
            return;
        }

        const color = item.colours.find(color => color.colourName === selectedColor);
        const size = color.sizes.find(size => size.size === selectedSize);

        addToCart(item.itemName, color.image, size.size, selectedColor, color.sellPrice);
    });
}

function attachSizeButtonListeners(itemCode) {
    $(`.size-btn[data-item='${itemCode}']`).on('click', function () {
        $(`.size-btn[data-item='${itemCode}']`).removeClass('btn-dark').addClass('btn-outline-dark');
        $(this).addClass('btn-dark').removeClass('btn-outline-dark');
    });
}

function addToCart(name, image, size, color, price) {
    const cartContainer = $("#order-items-list");
    const existingCartItem = cartContainer.find(`.order-item[data-name='${name}'][data-size='${size}'][data-color='${color}']`);

    if (existingCartItem.length > 0) {
        const quantityElement = existingCartItem.find(".item-quantity");
        let quantity = parseInt(quantityElement.text());
        quantity++;
        quantityElement.text(quantity);
    } else {
        // Add new item to cart
        const cartItem = `
            <div class="border border-secondary-subtle rounded mt-3 order-item" data-name="${name}" data-size="${size}" data-color="${color}">
                <div class="row">
                    <div class="col-3">
                        <img src="data:image/png;base64,${image}" class="rounded" alt="Shoe Image" style="width: 100px; height: 100px">
                    </div>
                    <div class="col-6">
                        <span class="mt-2">${name}</span>
                        <label>${size}</label>
                        <label>${color}</label>
                        <h6 class="text-success item-price">${price.toFixed(2)}</h6>
                    </div>
                    <div class="col-3">
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn-close" aria-label="Close"></button>
                        </div>
                        <div class="mt-2 d-flex justify-content-end">
                            <button class="rounded btn btn-danger me-2 decrease-quantity">-</button>
                            <span class="me-2 mt-2 item-quantity">1</span>
                            <button class="rounded btn btn-success increase-quantity">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cartContainer.append(cartItem);
    }

    attachQuantityButtonListeners();
    updatePaymentSummary();
}

function attachQuantityButtonListeners() {
    $(".increase-quantity").off("click").on("click", function () {
        const quantityElement = $(this).siblings(".item-quantity");
        let quantity = parseInt(quantityElement.text());
        quantity++;
        quantityElement.text(quantity);
        updatePaymentSummary();
    });

    $(".decrease-quantity").off("click").on("click", function () {
        const quantityElement = $(this).siblings(".item-quantity");
        let quantity = parseInt(quantityElement.text());
        if (quantity > 1) {
            quantity--;
            quantityElement.text(quantity);
            updatePaymentSummary();
        }
    });

    $(".btn-close").off("click").on("click", function () {
        $(this).closest(".order-item").remove();
        updatePaymentSummary();
    });
}

function updatePaymentSummary() {
    let subtotal = 0;

    $(".order-item").each(function () {
        const priceText = $(this).find(".item-price").text().trim();
        const quantityText = $(this).find(".item-quantity").text().trim();

        const price = parseFloat(priceText);
        const quantity = parseInt(quantityText);

        subtotal += price * quantity;
    });

    const discount = 3;
    const discountedTotal = subtotal - (subtotal * (discount / 100));

    $("#subTotalCart").text(subtotal.toFixed(2));
    $("#discountCart").text(discount.toFixed(2));
    $("#totalAmountCart").text(discountedTotal.toFixed(2));
}

function loadDataToPOS() {
    fetchSuppliers();
    fetchTypes();
    fetchCategories();
    initializeItems();
}

function openAddSupplierModal() {
    const modalAddSupplier = `
        <div class="modal fade" id="addSupplierModal" tabindex="-1" aria-labelledby="addSupplierModalLabel" aria-hidden="true" >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add New Supplier</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="supplierModalAddForm" class="row g-3 needs-validation" novalidate>
                            <div class="p-3">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="modalSupplierName" class="form-label">Supplier Name</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierName" name="supplierName" required>
                                        <div class="invalid-feedback">Please provide a valid supplier name.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="modalSupplierCategory" class="form-label">Supplier Category</label>
                                        <select class="form-select custom-focus" id="modalSupplierCategory" name="supplierCategory" required>
                                            <option value="" selected disabled>Select Supplier Category</option>
                                            <option value="LOCAL">LOCAL</option>
                                            <option value="INTERNATIONAL">INTERNATIONAL</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a supplier category.</div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-6">
                                        <label for="modalSupplierAddressNo" class="form-label">Address No</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierAddressNo" name="address" required>
                                        <div class="invalid-feedback">Please provide a valid address.</div>
                                    </div>
                                    <div class="col-6">
                                        <label for="modalSupplierAddressLane" class="form-label">Address Lane</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierAddressLane" name="address" required>
                                        <div class="invalid-feedback">Please provide a valid address.</div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-6">
                                        <label for="modalSupplierAddressCity" class="form-label">Address City</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierAddressCity" name="address" required>
                                        <div class="invalid-feedback">Please provide a valid address.</div>
                                    </div>
                                    <div class="col-6">
                                        <label for="modalSupplierAddressState" class="form-label">Address State</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierAddressState" name="address" required>
                                        <div class="invalid-feedback">Please provide a valid address.</div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-6">
                                        <label for="modalSupplierPostalCode" class="form-label">Postal Code</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierPostalCode" name="postalCode" required>
                                        <div class="invalid-feedback">Please provide a valid postal code.</div>
                                    </div>
                                    <div class="col-6">
                                        <label for="modalSupplierCountry" class="form-label">Country</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierCountry" name="country" required>
                                        <div class="invalid-feedback">Please provide a valid country.</div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-6">
                                        <label for="modalSupplierMobileNumber" class="form-label">Mobile Number</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierMobileNumber" name="mobileNumber" required>
                                        <div class="invalid-feedback">Please provide a valid mobile number.</div>
                                    </div>
                                    <div class="col-6">
                                        <label for="modalSupplierLandNumber" class="form-label">Land Number</label>
                                        <input type="text" class="form-control custom-focus" id="modalSupplierLandNumber" name="landNumber" required>
                                        <div class="invalid-feedback">Please provide a valid land number.</div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-8">
                                        <label for="modalSupplierEmail" class="form-label">Email</label>
                                        <input type="email" class="form-control custom-focus" id="modalSupplierEmail" name="email" required>
                                        <div class="invalid-feedback">Please provide a valid email address.</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="modalAddNewSupplier" class="btn btn-outline-custom-black-colour" data-bs-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>    
    `;

    // Append modal to body
    $('body').append(modalAddSupplier);

    // Show the modal
    $('#addSupplierModal').modal('show');
}