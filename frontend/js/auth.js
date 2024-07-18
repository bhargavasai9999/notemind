
$(document).ready(function () {
    $('#show-signup').on('click', function (e) {
        e.preventDefault();
        $('#login-form').hide();
        $('#signup-form').show();
    });

    $('#show-login').on('click', function (e) {
        e.preventDefault();
        $('#signup-form').hide();
        $('#login-form').show();
    });
}
);
$(document).ready(function () {
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function (response) {
                alert(response.message);
                localStorage.setItem('jwtToken', response.jwtToken); 
                window.location.href = '/index.html';
            },
            error: function (response) {
                alert(response.responseJSON.message);
            }
        });
    });

    $('#signup-form').on('submit', function (e) {
        e.preventDefault();
        const name = $('#signup-name').val();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        $.ajax({
            url: '/api/auth/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name, email, password }),
            success: function (response) {
                alert(response.message);
            },
            error: function (response) {
                alert(response.responseJSON.message);
            }
        });
    });
});
