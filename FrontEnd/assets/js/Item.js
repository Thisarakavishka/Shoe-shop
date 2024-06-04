const suppliers = [];
const categories = [];
const types = [];
const colours = [];
const sizes = [];
const items = [];
let discount = 3;

let next_sale_code;

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
                    <div class="flex-wrap">
                    ${item.colours.map((color, index) => `<button class="btn btn-outline-custom-black-colour me-2 mt-2" onmouseenter="showDetails(view_item,'${color.colourName}')" ${index === 0 ? "id='autoClickButton'" : ""}>${color.colourName}</button>`).join('')}
                    </div>
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
    event.preventDefault();

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

        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/item/' + update_item.itemCode,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
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
                ITEM_UPDATE_FORM.css("display", "none");
                ITEM_SECTION.css("display", "block");
                getDataToItemTable(0, item_page_size);
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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

function appendItemToTable(index, item) {
    const imageSrc = item.colours[0] && item.colours[0].image ? `data:image/png;base64,${item.colours[0].image}` : '';
    const imageHtml = imageSrc ? `<img src="${imageSrc}" class="rounded" alt="Profile Pic" style="width: 50px; height: 50px;">` : '';

    $('#item-table tbody').append(`
        <tr>
            <th scope="row" class="align-middle">${index + 1}</th>
            <th>
                ${imageHtml}
             </th>
            <td class="align-middle">${item.itemName}</td>
            <td class="align-middle">${item.categoryName}</td>
            <td class="align-middle">${item.typeName}</td>
            <td class="align-middle">${item.profitMargin}%</td>
            <td class="align-middle">$${item.expectedProfit}</td>
            <td class="align-middle">
                <button class="btn btn-outline-custom-black-colour view-item-btn btn-sm"><i class="fa fa-eye fa-lg" aria-hidden="true"></i></button>
                <button class="btn btn-outline-custom-black-colour edit-item-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);
    $('.view-item-btn').last().click(function () {
        viewItem(item);
    });
    $('.edit-item-btn').last().click(function () {
        editItem(item);
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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

function createAddColorModal(colorSectionId) {
    let next_colour_code;

    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/colour/next-code',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            next_colour_code = data;
            console.log(next_colour_code);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });

    const addColourmodal = `
        <div class="modal fade" id="addColorModal" tabindex="-1" aria-labelledby="addColorModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addColorModalLabel">Add New Colour</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addColorForm">
                            <div class="mb-3">
                                <label for="colorName" class="form-label">Colour Name</label>
                                <input type="text" class="form-control" id="colorName" required>
                                <div class="invalid-feedback">Please enter a valid colour name.</div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button type="submit" class="btn btn-dark">Add Colour</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(addColourmodal);
    const addColorModal = new bootstrap.Modal(document.getElementById('addColorModal'));
    addColorModal.show();

    $('#addColorForm').off('submit').on('submit', function (event) {
        event.preventDefault();
        const colorName = $('#colorName').val().trim();

        if (!colorName) {
            $('#colorName').addClass('is-invalid');
            return;
        } else {
            $('#colorName').removeClass('is-invalid');
        }

        const newColourData = {
            "colourCode": next_colour_code,
            "colourName": colorName
        };
         console.log(newColourData);

        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/colour',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newColourData),
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                Swal.fire({
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1000
                });
                $(`#colourSelect-${colorSectionId}`).append($('<option>', {
                    value: data.colourCode,
                    text: data.colourName,
                    selected: true
                }));

                colours.push(data);

                $('#addColorModal').modal('hide');
                $('#addColorModal').remove();
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });

    $('#addColorModal').on('hidden.bs.modal', function () {
        $('#addColorModal').remove();
    });
}


let formDataLoaded = false;

function loadItemAddFormData() {
    if (formDataLoaded) {
        return;
    }

    fetchSuppliers();
    fetchCategories();
    fetchTypes();
    let colorSectionCount = $('.mb-3[id^="colorSection"]').length;

    $('#add-new-colour-section').click(function () {
        event.preventDefault();
        colorSectionCount++;

        const colorSectionId = `colorSection${colorSectionCount}`;
        if ($(`#${colorSectionId}`).length > 0) {
            return;
        }
        const colorSection = $('<div>').addClass('mb-3').attr('id', colorSectionId);

        colorSection.append(`
            <div class="row">
                <hr>
                <div class="col-md-6">
                    <label for="colourSelect-${colorSectionId}" class="form-label mt-2">Colour</label>
                    <select class="form-select custom-focus" id="colourSelect-${colorSectionId}" required>
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

        $(`#colourSelect-${colorSectionId}`).change(function () {
            if ($(this).val() === "addNewColour") {
                createAddColorModal(colorSectionId);
                $('#addColorModal').modal('show');
            }
        });

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
    formDataLoaded = true;

}

function clearAddItemForm() {
    // Reset input fields to their initial state
    $('#itemAddForm')[0].reset();

    // Reset radio buttons
    $('input[name="gender"]').prop('checked', false);

    // Remove dynamically added color sections
    $('[id^=colorSection]').remove();

    // Reset image preview
    $('[id^=imagePreview]').hide().removeAttr('src');

    // Remove any error messages
    $('.is-invalid').removeClass('is-invalid');
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
    event.preventDefault();
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
            headers: {
                'Authorization': 'Bearer ' + token
            },
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
                clearAddItemForm();
                ITEM_ADD_FORM.css("display", "none");
                ITEM_SECTION.css("display", "block");
                getDataToItemTable(0, item_page_size);
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
    $(`#colourSelect-${colorSectionId}`).append($('<option>', {
        value: "addNewColour",
        text: "+"
    }));
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
            headers: {
                'Authorization': 'Bearer ' + token
            },
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
    clearAddItemForm();
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

        addToCart(item.itemName, color.image, size.size, selectedColor, color.sellPrice, itemCode);
    });
}

function attachSizeButtonListeners(itemCode) {
    $(`.size-btn[data-item='${itemCode}']`).on('click', function () {
        $(`.size-btn[data-item='${itemCode}']`).removeClass('btn-dark').addClass('btn-outline-dark');
        $(this).addClass('btn-dark').removeClass('btn-outline-dark');
    });
}

function addToCart(name, image, size, color, price, itemCode) {
    const cartContainer = $("#order-items-list");
    const existingCartItem = cartContainer.find(`.order-item[data-item-code='${itemCode}'][data-size='${size}'][data-color='${color}']`);

    if (existingCartItem.length > 0) {
        const quantityElement = existingCartItem.find(".item-quantity");
        let quantity = parseInt(quantityElement.text());
        quantity++;
        quantityElement.text(quantity);
    } else {
        // Add new item to cart
        const cartItem = `
            <div class="border border-secondary-subtle rounded mt-3 order-item" data-item-code="${itemCode}" data-color="${color}" data-size="${size}">
                <div class="row">
                    <div class="col-3">
                        <img src="data:image/png;base64,${image}" class="rounded" alt="Shoe Image" style="width: 100px; height: 100px">
                    </div>
                    <div class="col-6">
                        <span class="mt-2 item-name">${name}</span>
                        <label>Size: <span class="item-size">${size}</span></label>
                        <label>Color: <span class="item-color">${color}</span></label>
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


    const discountedTotal = subtotal - (subtotal * (discount / 100));

    $("#subTotalCart").text(subtotal.toFixed(2));
    $("#discountCart").text(discount.toFixed(2));
    $("#totalAmountCart").text(discountedTotal.toFixed(2));
}

function loadDataToPOS() {
    getNextSaleCode();
    fetchSuppliers();
    fetchTypes();
    fetchCategories();
    initializeItems();
}

function getNextSaleCode() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/sales/next-code',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            next_sale_code = data;
        },
        error: function () {
            console.log("Error fetching next sale code")
        }
    });
}

$("#placeOrderBtn").on('click', () => {
    event.preventDefault();
    const saleCode = next_sale_code
    const totalPrice = parseFloat($("#totalAmountCart").text());
    const paymentMethod = 'CARD'; // Assuming you have a select dropdown for payment method
    const addedPoints = 35; // You can implement this function based on your logic
    const date = new Date().toISOString();
    const employeeCode = 'EMP001'; // Implement this based on your logic
    const customerCode = 'CUS001'; // Implement this based on your logic

    let items = [];

    $(".order-item").each(function () {
        const itemCode = $(this).data("item-code"); // Access the data-item-code attribute
        const itemName = $(this).find('.item-name').text().trim(); // Access the item name
        const selectedColor = $(this).data("color"); // Access the selected color
        const selectedSize = $(this).data("size"); // Access the selected size
        const quantity = parseInt($(this).find('.item-quantity').text().trim()); // Access the quantity

        let sizes = [{
            size: selectedSize,
            quantity: quantity
        }];

        let colours = [{
            colourName: selectedColor,
            image: '', // If available, set the image URL
            sellPrice: 0.0, // If available, set the sell price
            buyPrice: 0.0, // If available, set the buy price
            sizes: sizes
        }];

        items.push({
            itemCode: itemCode,
            itemName: itemName,
            categoryName: '', // Set category name if available
            supplierName: '', // Set supplier name if available
            typeName: '', // Set type name if available
            gender: 'UNISEX', // Set gender if available, e.g., 'MALE', 'FEMALE', 'UNISEX'
            profitMargin: 0.0, // Set profit margin if available
            expectedProfit: 0.0, // Set expected profit if available
            colours: colours
        });
    });

    const orderData = {
        saleCode: saleCode,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        addedPoints: addedPoints,
        date: date,
        employeeCode: employeeCode,
        customerCode: customerCode,
        items: items
    };

    console.log(orderData); // For debugging

    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/sales',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function (response) {
            console.log('Order placed successfully:', response);
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1000
            });
            const cartContainer = $("#order-items-list");
            cartContainer.empty();
            loadDataToPOS();
        },
        error: function (error) {
            console.error('Error placing order:', error);
            Swal.fire({
                icon: "error",
                title: status,
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
});

$("#itemPageSize").change(function () {
    item_page_size = $(this).val();
    getDataToItemTable(0, item_page_size);
    getItemPageCount();
});