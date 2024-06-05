let category_page_size = 10;
let current_category_page = 1;
let categoryArray = [];
let next_category_code;

let type_page_size = 10;
let current_type_page = 1;
let typeArray = [];
let next_type_code;

function getDataToCategoryTable() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/category',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
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

function editCategory(category) {
    const editModalHtml = `
        <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editCategoryModalLabel">Edit Category</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCategoryForm">
                            <div class="mb-3">
                                <label for="editCategoryCharacter" class="form-label">Category Character</label>
                                <input type="text" class="form-control" id="editCategoryCharacter" name="categoryCharacter" value="${category.categoryCharacter}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editCategoryName" class="form-label">Category Name</label>
                                <input type="text" class="form-control" id="editCategoryName" name="categoryName" value="${category.categoryName}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-outline-dark" id="saveEditCategoryBtn">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(editModalHtml);
    $('#editCategoryModal').modal('show');

    $('#saveEditCategoryBtn').off('click').on('click', function () {
        let updatedCategory = {
            categoryCode: category.categoryCode,
            categoryName: $('#editCategoryName').val(),
            categoryCharacter: $('#editCategoryCharacter').val()
        };

        $.ajax({
            url: `http://localhost:8080/spring-boot/api/v1/category/${category.categoryCode}`,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            contentType: 'application/json',
            data: JSON.stringify(updatedCategory),
            success: function () {
                $('#editCategoryModal').modal('hide').remove();
                getDataToCategoryTable();
                Swal.fire({
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1000
                });
            },
            error: function (xhr, status, error) {
                console.error('Error updating category');
                Swal.fire({
                    icon: "error",
                    title: status,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });
    });

    $('#editCategoryModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

function deleteCategory(category) {
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
                url: `http://localhost:8080/spring-boot/api/v1/category/${category.categoryCode}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function () {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Category has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getDataToCategoryTable();
                    });
                },
                error: function () {
                    console.error('Error deleting category');
                }
            });
        }
    });
}

$("#add-new-category").on('click', () => {
    fetchNextCategoryCode()
        .then(nextCode => {
            next_category_code = nextCode;
            showAddCategoryModal();
        })
        .catch(error => {
            console.error("Error fetching next category code", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error,
                showConfirmButton: false,
                timer: 1000
            });
        });
});

function fetchNextCategoryCode() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/category/next-code',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                resolve(data);
            },
            error: function (xhr, status, error) {
                reject(status);
            }
        });
    });
}

function showAddCategoryModal() {
    const addModalHtml = `
        <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="addCategoryModalLabel">Add New Category</h5>
                        <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addCategoryForm">
                            <div class="mb-3">
                                <label for="newCategoryCharacter" class="form-label">Category Character</label>
                                <input type="text" class="form-control" id="newCategoryCharacter" name="categoryCharacter" required>
                            </div>
                            <div class="mb-3">
                                <label for="newCategoryName" class="form-label">Category Name</label>
                                <input type="text" class="form-control" id="newCategoryName" name="categoryName" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-outline-dark" id="saveNewCategoryBtn">Add Category</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(addModalHtml);
    $('#addCategoryModal').modal('show');

    $('#saveNewCategoryBtn').off('click').on('click', saveNewCategory);

    $('#addCategoryModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

function saveNewCategory() {
    let newCategory = {
        categoryCode: next_category_code,
        categoryName: $('#newCategoryName').val(),
        categoryCharacter: $('#newCategoryCharacter').val()
    };

    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/category',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
        data: JSON.stringify(newCategory),
        success: function () {
            $('#addCategoryModal').modal('hide').remove();
            getDataToCategoryTable();
            Swal.fire({
                icon: "success",
                title: "New category added successfully",
                showConfirmButton: false,
                timer: 1000
            });
        },
        error: function (xhr, status, error) {
            console.error('Error adding new category', error);
            Swal.fire({
                icon: "error",
                title: status,
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

function getDataToTypeTable() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/type',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
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

function editType(type) {
    const editModalHtml = `
        <div class="modal fade" id="editTypeModal" tabindex="-1" aria-labelledby="editTypeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editTypeModalLabel">Edit Type</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editTypeForm">
                            <div class="mb-3">
                                <label for="editTypeCharacter" class="form-label">Type Character</label>
                                <input type="text" class="form-control" id="editTypeCharacter" name="typeCharacter" value="${type.typeCharacter}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editTypeName" class="form-label">Type Name</label>
                                <input type="text" class="form-control" id="editTypeName" name="typeName" value="${type.typeName}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-outline-dark" id="saveEditTypeBtn">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(editModalHtml);
    $('#editTypeModal').modal('show');

    $('#saveEditTypeBtn').off('click').on('click', function () {
        let updatedType = {
            typeCode: type.typeCode,
            typeName: $('#editTypeName').val(),
            typeCharacter: $('#editTypeCharacter').val()
        };

        $.ajax({
            url: `http://localhost:8080/spring-boot/api/v1/type/${type.typeCode}`,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            contentType: 'application/json',
            data: JSON.stringify(updatedType),
            success: function () {
                $('#editTypeModal').modal('hide').remove();
                getDataToTypeTable();
                Swal.fire({
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1000
                });
            },
            error: function (xhr, status, error) {
                console.error('Error updating type');
                Swal.fire({
                    icon: "error",
                    title: status,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });
    });

    $('#editTypeModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

function deleteType(type) {
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
                url: `http://localhost:8080/spring-boot/api/v1/type/${type.typeCode}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function () {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Type has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getDataToTypeTable();
                    });
                },
                error: function () {
                    console.error('Error deleting type');
                }
            });
        }
    });
}

$("#add-new-type").on('click', () => {
    fetchNextTypeCode()
        .then(nextCode => {
            next_type_code = nextCode;
            showAddTypeModal();
        })
        .catch(error => {
            console.error("Error fetching next type code", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error,
                showConfirmButton: false,
                timer: 1000
            });
        });
});

function fetchNextTypeCode() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/type/next-code',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                resolve(data);
            },
            error: function (xhr, status, error) {
                reject(status);
            }
        });
    });
}

function showAddTypeModal() {
    const addModalHtml = `
        <div class="modal fade" id="addTypeModal" tabindex="-1" aria-labelledby="addTypeModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title text-center w-100" id="addTypeModalLabel">Add New Type</h5>
                        <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addTypeForm">
                            <div class="mb-3">
                                <label for="newTypeCharacter" class="form-label">Type Character</label>
                                <input type="text" class="form-control" id="newTypeCharacter" name="typeCharacter" required>
                            </div>
                            <div class="mb-3">
                                <label for="newTypeName" class="form-label">Type Name</label>
                                <input type="text" class="form-control" id="newTypeName" name="typeName" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-outline-dark" id="saveNewTypeBtn">Add Type</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(addModalHtml);
    $('#addTypeModal').modal('show');

    $('#saveNewTypeBtn').off('click').on('click', saveNewType);

    $('#addTypeModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

function saveNewType() {
    let newType = {
        typeCode: next_type_code,
        typeName: $('#newTypeName').val(),
        typeCharacter: $('#newTypeCharacter').val()
    };

    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/type',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
        data: JSON.stringify(newType),
        success: function () {
            $('#addTypeModal').modal('hide').remove();
            getDataToTypeTable(); // Refresh the type table
            Swal.fire({
                icon: "success",
                title: "New type added successfully",
                showConfirmButton: false,
                timer: 1000
            });
        },
        error: function (xhr, status, error) {
            console.error('Error adding new type');
            Swal.fire({
                icon: "error",
                title: status,
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}