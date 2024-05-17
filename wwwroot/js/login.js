document.addEventListener('DOMContentLoaded', function () { 
document.getElementById('togglePassword').addEventListener('click', function () {
    var passwordInput = document.getElementById('password');
    var eyeIcon = document.getElementById('togglePassword');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});

    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                UserName: $('#username').val(),
                Password: $('#password').val()
            }),
            success: function (response) {
                if (response.resultInfo === 1) {
                    // Handle successful login
                    console.log("Login successful. Username: " + response.userName + ", Role: " + response.roleName);
                    if (response.roleName === 'Admin') {
                        window.location.href = '/Home/ManageUser';
                    }
                    else
                    {
                        window.location.href = '/Home/PersonalDetails';
                    }
                } else {
                    console.log("Login failed. Error: " + response.errorCode + " " + response.errorMessage);
                }
            }
        });
    });
});