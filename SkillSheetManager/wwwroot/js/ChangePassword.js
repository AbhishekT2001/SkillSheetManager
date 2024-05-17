const form = document.querySelector('form');
const oldPasswordInput = document.getElementById('old-password');
const newPasswordInput = document.getElementById('new-password');
const reEnterPasswordInput = document.getElementById('re-enter-password');
const dropdownButton = document.getElementById('dropdownButton');
const storedUsername = localStorage.getItem('username');
const userRole = localStorage.getItem('role');
const errorMessageContainer = document.getElementById('errorMessageContainer');

// Set the dropdown button text based on the stored username
if (storedUsername) {
    dropdownButton.textContent = storedUsername;
} else {
    dropdownButton.textContent = 'Admin';
}

// Check if the user is logged in 
// and set the dropdown content based on the user role
$(document).ready(function () {
    const dropdownContent = $('#dropdownContent');

    if (dropdownContent.length) {
        if (userRole === 'Admin') {
            dropdownContent.html(`<a href="/Home/ManageUser">Manage User</a>
                <a href="/Home/Login">Logout</a>`);
        } else if (userRole === 'User') {
            dropdownContent.html(`
                <a href="/Home/PersonalDetails">Personal Details</a>
                <a href="/Home/Login">Logout</a>`);
        } else {
            console.error('Invalid user role');
        }
    } else {
        console.error('Dropdown content element not found');
    }
});

// Function to validate the password
$(document).ready(function () {

    $('#change-password-form').submit(function (event) {
        event.preventDefault(); 

        const oldPassword = $('#old-password').val();
        const newPassword = $('#new-password').val();
        const reenteredPassword = $('#re-enter-password').val();

        if (newPassword !== reenteredPassword) {
            errorMessageContainer.innerHTML = 'New password and re-entered password do not match';
            errorMessageContainer.classList.remove("d-none");
            setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
            return;
        }

        if (oldPassword === newPassword) {
            errorMessageContainer.innerHTML = 'Old password and new password cannot be the same';
            errorMessageContainer.classList.remove("d-none");
            setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
            return;
        }

        if (validatePassword(newPassword) === false) {
            errorMessageContainer.innerHTML = 'Password is not strong enough. Use One of the Following: <ul><li>Upper Case</li><li>Lower Case</li><li>Number</li><li>Special Character(!,@,#,$.&,*,+)</li></ul>';
            errorMessageContainer.classList.remove("d-none");
            setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
        }

        // Ajax request to Send the form data to the server
        $.ajax({
            url: '/api/ChangePassword',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                CurrentPassword: oldPassword,
                NewPassword: newPassword,
                UserName: storedUsername
            }),
            success: function (data) {
                if (data.resultInfo === 1 ) {
                    alert('Password changed successfully');
                    window.location.href = '/Home/Login';
                    $('#change-password-form')[0].reset();
                } else {
                    alert('Error ' + data.ErrorCode + ': ' + data.ErrorMessage);
                    errorMessageContainer.innerHTML = 'Error ' + data.ErrorCode + ': ' + data.ErrorMessage;
                    errorMessageContainer.classList.remove("d-none");
                    setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
                }
            },
            error: function (xhr, status, error) {
                console.error('An error occurred:', error);
                errorMessageContainer.innerHTML = 'An error occurred: ' + error;
                errorMessageContainer.classList.remove("d-none");
                setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
            }
        });
    });

    // Function to validate the password
    function validatePassword(password) {
        const regex = /^(?=.*[!@#$%^&*+=])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,64}$/;
        return regex.test(password);
    }
});