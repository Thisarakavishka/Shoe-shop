let token;

$("#loginForm").on('submit', function(event) {
    event.preventDefault();

    $("#emailError").text('');
    $("#passwordError").text('');

    if (this.checkValidity()) {
        const signIn = {
            "email": $('#inputEmail').val(),
            "password": $('#inputPassword').val()
        }
        $.ajax({
            url: 'http://localhost:8080/spring-boot/api/v1/auth',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(signIn),
            success: function (data) {
                token = data.token;
                console.log(token);
                Swal.fire({
                    icon: "success",
                    title: "Successfully Login",
                    showConfirmButton: false,
                    timer: 1000
                });
                clearPage();
                SIDE_BAR_SECTION.css("display", "block");
                $('#inputEmail').val("");
                $('#inputPassword').val("");
            },
            error: function (xhr, status, error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Enter valid credentials",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });
    } else {
        $(':invalid').each(function() {
            $(this).next('.invalid-feedback').text($(this).data('error-message'));
        });
    }
});

$('#inputEmail').on('input', function() {
    if (!this.validity.valid) {
        $(this).next('.invalid-feedback').text('Please enter a valid email address.');
    } else {
        $(this).next('.invalid-feedback').text('');
    }
});

$('#inputPassword').on('input', function() {
    if (!this.validity.valid) {
        $(this).next('.invalid-feedback').text('Password is required.');
    } else {
        $(this).next('.invalid-feedback').text('');
    }
});