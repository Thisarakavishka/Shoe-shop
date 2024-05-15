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
                        ${item.colours.map((color, index) => `<button class="btn btn-outline-custom-black-colour me-2" onclick="showDetails(view_item,'${color.colourName}')" ${index === 0 ? "id='autoClickButton'" : ""}>${color.colourName}</button>`).join('')}
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
    $("#autoClickButton").click();
}

function showDetails(item, colourName) {
    const colour = item.colours.find(c => c.colourName === colourName);

    const detailsHtml = `
            <label class="border border-success rounded p-2 text-success"><span>Profit Margin: <b>${item.profitMargin}%</b> </span></label>
            <label class="border border-success rounded p-2 ms-2 text-success"><span>Expected Profit: <b>$${item.expectedProfit}</b> </span></label>
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


function editItem(item) {

}

function deleteItem(item) {

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

$(document).ready(function () {
    getDataToItemTable(0, item_page_size);
    getItemPageCount();
    clearPage();
});

function loadItemAddFormData() {
    fetchSuppliers();
    fetchCategories();
    fetchTypes();
    let colorSectionCount = 0; // Initialize a counter to keep track of color sections

    // Listen for click events on the element with the ID 'add-new-colour-section'
    $('#add-new-colour-section').click(function () {
        colorSectionCount++; // Increment the color section count for each click
        const colorSectionId = `colorSection${colorSectionCount}`; // Generate a unique identifier for the color section

        // Create a new div element with the class 'mb-3' and set its ID to the generated colorSectionId
        const colorSection = $('<div>').addClass('mb-3').attr('id', colorSectionId);

        // Append HTML content to the colorSection div using template literals
        colorSection.append(`
            <div class="row">
                <div class="col-md-6">
                    <label for="colourSelect-${colorSectionId}" class="form-label mt-2">Colour</label>
                    <!-- Create a select element for choosing a color -->
                    <select class="form-select custom-focus" id="colourSelect-${colorSectionId}" required>
                        <option value="" selected disabled>Select Colour</option>
                        <option value="new">New Colour</option>
                    </select>
                    <!-- Display an error message if no color is selected -->
                    <div class="invalid-feedback">Please select a colour.</div>
                </div>
                <div class="col-md-6">
                    <label for="colourImageInput-${colorSectionId}" class="form-label mt-2">Image</label>
                    <!-- Create an input element for uploading an image -->
                    <input type="file" class="form-control custom-focus" id="colourImageInput-${colorSectionId}" accept="image/*">
                </div>    
                <div class="col-md-6">
                    <label for="sellPriceInput-${colorSectionId}" class="form-label mt-2">Sell Price</label>
                    <!-- Create an input element for entering the sell price -->
                    <input type="text" class="form-control custom-focus" id="sellPriceInput-${colorSectionId}" placeholder="Sell Price">
                </div>
                <div class="col-md-6">
                    <label for="buyPriceInput-${colorSectionId}" class="form-label mt-2">Buy Price</label>
                    <!-- Create an input element for entering the buy price -->
                    <input type="text" class="form-control custom-focus" id="buyPriceInput-${colorSectionId}" placeholder="Buy Price">
                </div>
            </div>

            <div class="mb-3 sizes-row">
                <label class="form-label mt-3">Sizes</label>
                <div class="row" id="sizeInputsRow-${colorSectionId}"> <!-- Unique identifier for size inputs -->
                    <div class="col-3">
                        <select class="form-select custom-focus " id="sizeSelect-${colorSectionId}" required>
                            <option value="" selected disabled>Select Size</option>
                            <option value="new">New Size</option>
                        </select>
                    </div>
                    <!-- Button group for adding and clearing sizes -->
                    <div class="col-9 d-flex align-items-center justify-content-start">
                        <button class="btn btn-outline-dark add-size-button me-3" data-section="${colorSectionId}">Add Size</button>
                        <button class="btn btn-outline-dark clear-size-button" data-section="${colorSectionId}">Clear Sizes</button>
                    </div>
                </div>
            </div>
        `);

        // Insert the colorSection div before the element with the ID 'add-new-colour-section'
        $('#add-new-colour-section').before(colorSection);
        fetchColours(colorSectionId);
        fetchSizes(colorSectionId);

        // Listen for click events on the add-size-button within the color section
        $(document).on('click', `.add-size-button[data-section="${colorSectionId}"]`, function () {
            event.preventDefault();
            const selectedSize = $(`#sizeSelect-${colorSectionId}`).val();
            const label = $('<label>').addClass('form-label p-4 rounded mt-4 border-black border fs-5 fw-bold').text(selectedSize);
            const inputField = $('<input>').attr('type', 'text').addClass('form-control me-2 mt-3 col-2 custom-focus').attr('placeholder', 'Size').val(50).css('margin-left', '10px'); // Adding left margin to the input field
            const prevLabelCount = $(`#sizeInputsRow-${colorSectionId}`).find('label').length;
            $(`#sizeInputsRow-${colorSectionId}`).append($('<div>').addClass('col-1').css('margin-left', `50px`).append(label).append(inputField));

            if ($(`#sizeInputsRow-${colorSectionId} .col-2`).length === 1) {
                $(`#sizeInputsRow-${colorSectionId}`).after('<hr>');
            }
        });

        // Listen for click events on the clear-size-button within the color section
        $(document).on('click', `.clear-size-button[data-section="${colorSectionId}"]`, function () {
            // Remove input fields, labels, and hr elements from the sizeInputsRow
            $(`#sizeInputsRow-${colorSectionId} .col-2, #sizeInputsRow-${colorSectionId} label, #sizeInputsRow-${colorSectionId} hr`).remove();
        });
    });
}

$("#add-item-button").on('click', () => {
    saveItem();
});

function saveItem() {
    const item = {
        "itemCode": "IC001",
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

    event.preventDefault();
    console.log(JSON.stringify(item));

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

function fetchSuppliers() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier/all',
        type: 'GET',
        success: function (data) {
            data.forEach(function (supplier) {
                $("#itemSupplier").append($('<option>', {
                    value: supplier.supplierName,
                    text: supplier.supplierName
                }));
            });
            console.log("Fetch All Suppliers");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function fetchCategories() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/category',
        type: 'GET',
        success: function (data) {
            data.forEach(function (category) {
                $("#itemCategory").append($('<option>', {
                    value: category.categoryName,
                    text: category.categoryName
                }));
            });
            console.log("Fetch All Categories");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function fetchTypes() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/type',
        type: 'GET',
        success: function (data) {
            data.forEach(function (type) {
                $("#itemType").append($('<option>', {
                    value: type.typeName,
                    text: type.typeName
                }));
            });
            console.log("Fetch All Types");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function fetchColours(colorSectionId) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/colour',
        type: 'GET',
        success: function (data) {
            data.forEach(function (colour) {
                $(`#colourSelect-${colorSectionId}`).append($('<option>', {
                    value: colour.colourName,
                    text: colour.colourName
                }));
            });
            console.log("Fetch All Colours");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function fetchSizes(colorSectionId) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/size',
        type: 'GET',
        success: function (data) {
            data.forEach(function (size) {
                $(`#sizeSelect-${colorSectionId}`).append($('<option>', {
                    value: size.size,
                    text: size.size
                }));
            });
            console.log("Fetch All Sizes");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
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