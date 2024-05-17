const messageContainer = document.getElementById('messageContainer');

$(document).ready(function () {

    // Add event listener for toggle password icon through character input
    $('#togglePassword').hide();
    $('#password').on('input', function () {
        var eyeIcon = $('#togglePassword');

        if ($(this).val().length > 0) {
            eyeIcon.show();
        } else {
            eyeIcon.hide();
        }
    });

    // Add event listener for toggle password
    $(document).ready(function () {
        $('#togglePassword').click(function () {
            var passwordInput = $('#password');

            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
    });

    // Check if the remember me is checked and set the username
    $(document).ready(function () {
        var remembered = sessionStorage.getItem('rememberMeChecked') === 'true';

        $('#rememberme').prop('checked', remembered);

        if (remembered) {
            $('#username').val(sessionStorage.getItem('rememberedUsername'));
        } else {
            $('#username').val('');
        }
    });

    // Add event listener for remember me
    $('#rememberme').change(function () {
        var isChecked = $(this).is(':checked');
        sessionStorage.setItem('rememberMeChecked', isChecked);
    });

    // Ajax call for logging in the user
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();
        var rememberMe = $('#rememberme').is(':checked');

        $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                UserName: username,
                Password: password,
                RememberMe: rememberMe
            }),
            success: function (response) {
                if (response.resultInfo === 1) {
                    var role = response.roleName === 'Admin' ? 'Admin' : 'User';
                    localStorage.setItem('username', username);
                    localStorage.setItem('role', role);
                    sessionStorage.setItem('rememberedUsername', username);
                    sessionStorage.setItem('loggedIn', true);

                    var redirectUrl = role === 'Admin' ? '/Home/ManageUser' : '/Home/PersonalDetails';
                    window.location.href = redirectUrl;
                } else {
                    var errorMessage = "Login failed. Error: " + response.errorCode + " " + response.errorMessage;

                    messageContainer.innerHTML = errorMessage;
                    messageContainer.classList.remove("d-none");
                    setTimeout(function () {
                        messageContainer.classList.add("d-none");
                    }, 5000);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
                $('#errorMessage').text("An error occurred while processing your request. Please try again.");
            }
        });
    });
});