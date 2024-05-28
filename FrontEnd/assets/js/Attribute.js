let category_page_size = 10;
let current_category_page = 1;
let categoryArray = [];
let next_category_code;
let update_category;

let type_page_size = 10;
let current_type_page = 1;
let typeArray = [];
let next_type_code;
let update_type;

function getDataToCategoryTable() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/category',
        method: 'GET',
        success: function (data) {
            categoryArray.length = 0;
            data.forEach(function (category) {
                categoryArray.push(category);
            });
            displayCategoryData();
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function displayCategoryData() {
    let totalItems = categoryArray.length;
    let totalPages = Math.ceil(totalItems / category_page_size);
    let startIndex = (current_category_page - 1) * category_page_size;
    let endIndex = Math.min(startIndex + category_page_size, totalItems);

    $('#category-table tbody').empty();
    for (let i = startIndex; i < endIndex; i++) {
        appendCategoryToTable(i, categoryArray[i]);
    }
    displayCategoryPagination(totalPages);
}

function appendCategoryToTable(index, category) {
    $('#category-table tbody').append(`
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${category.categoryCharacter}</td>
            <td>${category.categoryName}</td>
            <td>
                <button class="btn btn-outline-custom-black-colour edit-category-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                <button class="btn btn-outline-custom-red-colour delete-category-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);

    $('.edit-category-btn').last().click(function () {
        editCategory(category);
    });

    $('.delete-category-btn').last().click(function () {
        deleteCategory(category);
    });
}

function displayCategoryPagination(totalPages) {
    $('#categoryPagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        $('#categoryPagination').append(`
            <button class="btn btn-outline-custom-black-colour me-2 pagination-btn" data-page="${i}">${i}</button>
        `);
    }

    $('.pagination-btn').click(function () {
        current_category_page = $(this).data('page');
        displayCategoryData();
    });
}

$('#categoryPageSize').change(function () {
    category_page_size = parseInt($(this).val());
    current_category_page = 1;
    displayCategoryData();
});

function getDataToTypeTable() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/type',
        method: 'GET',
        success: function (data) {
            typeArray.length = 0;
            data.forEach(function (type) {
                typeArray.push(type);
            });
            displayTypeData();
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function displayTypeData() {
    let totalItems = typeArray.length;
    let totalPages = Math.ceil(totalItems / type_page_size);
    let startIndex = (current_type_page - 1) * type_page_size;
    let endIndex = Math.min(startIndex + type_page_size, totalItems);

    $('#type-table tbody').empty();
    for (let i = startIndex; i < endIndex; i++) {
        appendTypeToTable(i, typeArray[i]);
    }
    displayTypePagination(totalPages);
}

function appendTypeToTable(index, type) {
    $('#type-table tbody').append(`
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${type.typeCharacter}</td>
            <td>${type.typeName}</td>
            <td>
                <button class="btn btn-outline-custom-black-colour edit-type-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                <button class="btn btn-outline-custom-red-colour delete-type-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);

    $('.edit-type-btn').last().click(function () {
        editType(type);
    });

    $('.delete-type-btn').last().click(function () {
        deleteType(type);
    });
}

function displayTypePagination(totalPages) {
    $('#typePagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        $('#typePagination').append(`
            <button class="btn btn-outline-custom-black-colour me-2 pagination-btn" data-page="${i}">${i}</button>
        `);
    }

    $('.pagination-btn').click(function () {
        current_type_page = $(this).data('page');
        displayTypeData();
    });
}

$('#typePageSize').change(function () {
    type_page_size = parseInt($(this).val());
    current_type_page = 1;
    displayTypeData();
});