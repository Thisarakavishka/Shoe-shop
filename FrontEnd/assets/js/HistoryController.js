let sales_history_page_size = 10;

$("#historyPageSize").change(function () {
    sales_history_page_size = $(this).val();
    getDataToSalesHistoryTable(0, supplier_page_size);
    getSalePageCount();
});

function getDataToSalesHistoryTable(page, size) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/sales/by-page',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {page: page, size: size},
        success: function (data) {
            displaySalesHistoryData(data, page, size);
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function getSalePageCount() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/sales/page-size',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {size: sales_history_page_size},
        success: function (data) {
            console.log('success fetching count of sales pages');
            saleHistoryPaginationButtons(data);
        },
        error: function () {
            console.error('Error fetching count of pages');
        }
    });
}

function saleHistoryPaginationButtons(totalPages) {
    $('#historyPagination').empty();
    for (let i = 0; i < totalPages; i++) {
        $('#historyPagination').append(`<button class="btn btn-outline-custom-black-colour me-2" onclick="getDataToSalesHistoryTable(${i}, sales_history_page_size)">${i + 1}</button>`);
    }
}

function displaySalesHistoryData(data, page, size) {
    $('#history-table tbody').empty();
    $.each(data, function (index, sale) {
        appendSalesHistoryToTable(index + (page * size), sale);
    });
}

function appendSalesHistoryToTable(param, sale) {
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
                <button class="btn btn-outline-custom-black-colour view-history-btn btn-sm"><i class="fa fa-eye fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);

    $('.view-history-btn').last().click(function () {
        viewSaleHistory(sale);
    });
}

function viewSaleHistory(sale) {

}
