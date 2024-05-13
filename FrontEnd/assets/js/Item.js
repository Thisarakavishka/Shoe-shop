
$(document).ready(function () {
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
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
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
                            <option value="36">36</option>
                            <option value="37">37</option>
                            <option value="38">38</option>
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
});

function fetchSuppliers() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/supplier/all',
        type: 'GET',
        success: function (data) {
            data.forEach(function (supplier) {
                $("#itemSupplier").append($('<option>', {
                    value: supplier.supplierCode,
                    text: supplier.supplierName
                }));
            });
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
                    value: category.categoryCode,
                    text: category.categoryName
                }));
            });
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
                    value: type.typeCode,
                    text: type.typeName
                }));
            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}