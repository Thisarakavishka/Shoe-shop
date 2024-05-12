$(document).ready(function () {
    let colorSectionCount = 0; // Track the number of color sections

    $('#add-new-colour-section').click(function () {
        colorSectionCount++; // Increment the color section count
        const colorSectionId = `colorSection${colorSectionCount}`; // Unique identifier for the color section

        const colorSection = $('<div>').addClass('mb-3').attr('id', colorSectionId);
        colorSection.append(`
            <div class="row">
                <div class="col-md-5">
                    <label for="colourSelect-${colorSectionId}" class="form-label mt-2">Colour</label>
                    <select class="form-select custom-focus" id="colourSelect-${colorSectionId}" required>
                        <option value="" selected disabled>Select Colour</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                    </select>
                    <div class="invalid-feedback">Please select a colour.</div>
                </div>
                <div class="col-md-7">
                    <label for="colourImageInput-${colorSectionId}" class="form-label mt-2">Image</label>
                    <input type="file" class="form-control" id="colourImageInput-${colorSectionId}" accept="image/*">
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
                    <div class="col-9 d-flex align-items-center justify-content-start">
                        <button class="btn btn-outline-dark add-size-button me-3" data-section="${colorSectionId}">Add Size</button>
                        <button class="btn btn-outline-dark clear-size-button" data-section="${colorSectionId}">Clear Sizes</button>
                    </div>
                </div>
            </div>
        `);

        $('#add-new-colour-section').before(colorSection);

        $(document).on('click', `.add-size-button[data-section="${colorSectionId}"]`, function () {
            event.preventDefault();
            const selectedSize = $(`#sizeSelect-${colorSectionId}`).val();
            const label = $('<label>').addClass('form-label p-4 rounded mt-4 border-black border fs-5 fw-bold').text(selectedSize);
            const inputField = $('<input>').attr('type', 'text').addClass('form-control me-2 mt-3 col-2').attr('placeholder', 'Size').val(50).css('margin-left', '10px'); // Adding left margin to the input field
            const prevLabelCount = $(`#sizeInputsRow-${colorSectionId}`).find('label').length;
            $(`#sizeInputsRow-${colorSectionId}`).append($('<div>').addClass('col-1').css('margin-left', `50px`).append(label).append(inputField));

            if ($(`#sizeInputsRow-${colorSectionId} .col-2`).length === 1) {
                $(`#sizeInputsRow-${colorSectionId}`).after('<hr>');
            }
        });

        $(document).on('click', `.clear-size-button[data-section="${colorSectionId}"]`, function () {
            $(`#sizeInputsRow-${colorSectionId} .col-2`).remove();
        });
    });
});
