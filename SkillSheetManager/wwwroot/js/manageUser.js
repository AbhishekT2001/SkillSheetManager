const entriesSelect = document.getElementById('entriesSelect');
const dataGridView = document.getElementById('dataGridView');
const startIndex = document.getElementById('startIndex');
const endIndex = document.getElementById('endIndex');
const totalEntries = document.getElementById('totalEntries');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const formContainer = document.getElementById('addFromContainer');
const showFormButton = document.getElementById('addButton');
const messageContainer = document.getElementById('successMessage');
const errorMessageContainer = document.getElementById('errorMessage');
const editFormContainer = document.getElementById('updateFromContainer');
let entriesPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const hideAddFormButton = document.getElementById('hideAddFrom');
    const formContainer = document.getElementById('addFromContainer');
    const editButton = document.getElementById('editButton');
    const hideUpdateFormButton = document.getElementById('hideUpdateFrom');
    const updateFormContainer = document.getElementById('updateFromContainer');
    const dropdownButton = document.getElementById('dropdownButton');
    const storedUsername = localStorage.getItem('username');
    const addForm = document.querySelector('#addFromContainer form');
    const editForm = document.querySelector('#updateFromContainer form');

    // Set the dropdown button text based on the stored username
    if (storedUsername) {
        dropdownButton.textContent = storedUsername;
    } else {
        dropdownButton.textContent = 'Admin';
    }

    // Check if the user is logged in
    if (sessionStorage.getItem('loggedIn') === 'true') {
        messageContainer.innerHTML = 'Successfully logged in as ' + storedUsername;
        messageContainer.classList.remove('d-none');

        setTimeout(function () { messageContainer.classList.add('d-none'); }, 3000);
        sessionStorage.removeItem('loggedIn');
    } else {

    }

    // Add event listeners for the add and edit buttons
    if (addButton && hideAddFormButton && formContainer && editButton && hideUpdateFormButton && updateFormContainer) {
        addButton.addEventListener('click', function () {
            formContainer.classList.remove('hidden');
        });

        hideAddFormButton.addEventListener('click', function () {
            formContainer.classList.add('hidden');
            resetFormFields(formContainer);
        });

        editButton.addEventListener('click', function () {
            updateFormContainer.classList.remove('hidden');
        });

        hideUpdateFormButton.addEventListener('click', function () {
            updateFormContainer.classList.add('hidden');
            resetFormFields(updateFormContainer);
        });
    } else {
        console.error('One or more elements not found.');
    }

    // Add event listeners for the edit button
    if (editButton && hideUpdateFormButton && updateFormContainer) {
        editButton.addEventListener('click', function () {
            const selectedUserId = getSelectedUserId();
            
            if (!selectedUserId) {
                alert('Please select a user to edit.');
                return;
            }

            editUserDetails(selectedUserId);
            updateFormContainer.classList.remove('hidden');
        });
    } else {
        console.error('One or more elements not found.');
    }

    // Add form submit event listener
    addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const errorMessageContainer = document.getElementById('addErrorMessageContainer');
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const email = document.getElementById('email').value;
        if (validatePassword(password)) {
            if (password !== confirmPassword) {
                console.error('Passwords do not match');
                errorMessageContainer.innerHTML = 'Password do not match with the Confirm Password';
                errorMessageContainer.classList.remove("d-none");
                setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
                return;
            }
        }
        else
        {
            errorMessageContainer.innerHTML = 'Password is not strong enough Use One of the Following: <ul><li>Upper Case</li><li>Lower Case</li><li>Number</li><li>Special Character(!,@,#,$.&,*,+)</li></ul>';
            errorMessageContainer.classList.remove("d-none");
            setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
            return;
        }

        fetch('/api/ManageUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: role,
                username: username,
                password: password,
                email: email,
                delFlg: false,
                regDate: new Date().toISOString(),
                upDate: null
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add user');
                }
                return response.json();
            })
            .then(data => {
                if (data.resultInfo === 1) {
                    console.log('User added successfully');
                    messageContainer.innerHTML = 'User added successfully';
                    messageContainer.classList.remove("d-none");
                    setTimeout(function () { messageContainer.classList.add("d-none"); }, 3000);
                    formContainer.classList.add('hidden');
                    resetForm();
                    renderDataGridView(currentPage);
                } else {
                    console.error('Failed to add user:', data.errorMessage);
                    errorMessageContainer.innerHTML = 'Failed to add user: ' + data.errorMessage;
                    errorMessageContainer.classList.remove("d-none");
                    setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
                }
            })
            .catch(error => {
                console.error('Error adding user:', error);
                alert('Error adding user: ' + error.message);
            });
        function resetForm() {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirm-password').value = '';
            document.getElementById('email').value = '';
        }
    });

    // Get the User Id of the selected user
    function getSelectedUserId() {
        const selectedCheckbox = document.querySelector('tbody input[type="checkbox"]:checked');
        if (selectedCheckbox) {
            const selectedRow = selectedCheckbox.closest('tr');
            return selectedRow.dataset.userId;
        }
        return null;
    }

    // Edit form submit event listener
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const userId = getSelectedUserId();
        updateUser(userId);
    });
});

// Helper function to reset form fields
function resetFormFields(form) {
    const inputs = form.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
    inputs.forEach(input => {
        input.value = '';
    });
}

// Helper function to validate password
function validatePassword(password) {
    const regex = /^(?=.*[!@#$%^&*+=])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,64}$/;
    return regex.test(password);
}

// Toggle password visibility
$(document).ready(function () {
   
    $('#add-togglePassword').hide();
    $('#password').on('input', function () {
        var eyeIcon = $('#add-togglePassword');

        if ($(this).val().length > 0) {
            eyeIcon.show();
        } else {
            eyeIcon.hide();
        }
    });
    $(document).on('click', '#add-togglePassword', function () {
        var passwordInput = $('#password');
        togglePasswordVisibility(passwordInput, $(this));
    });

    $('#add-toggleConfirmPassword').hide();
    $('#confirm-password').on('input', function () {
        var eyeIcon = $('#add-toggleConfirmPassword');

        if ($(this).val().length > 0) {
            eyeIcon.show();
        } else {
            eyeIcon.hide();
        }
    });
    $(document).on('click', '#add-toggleConfirmPassword', function () {
        var confirmPasswordInput = $('#confirm-password');
        togglePasswordVisibility(confirmPasswordInput, $(this));
    });

    $('#edit-togglePassword').hide();
    $('#edit-password').on('input', function () {
        var eyeIcon = $('#edit-togglePassword');

        if ($(this).val().length > 0) {
            eyeIcon.show();
        } else {
            eyeIcon.hide();
        }
    });
    $(document).on('click', '#edit-togglePassword', function () {
        var passwordInput = $('#edit-password');
        togglePasswordVisibility(passwordInput, $(this));
    });

    $('#edit-toggleConfirmPassword').hide();
    $('#edit-confirm-password').on('input', function () {
        var eyeIcon = $('#edit-toggleConfirmPassword');

        if ($(this).val().length > 0) {
            eyeIcon.show();
        } else {
            eyeIcon.hide();
        }
    });
    $(document).on('click', '#edit-toggleConfirmPassword', function () {
        var confirmPasswordInput = $('#edit-confirm-password');
        togglePasswordVisibility(confirmPasswordInput, $(this));
    });
});

// Helper function to toggle password visibility
function togglePasswordVisibility(passwordInput, eyeIcon) {
    if (passwordInput.attr('type') === 'password') {
        passwordInput.attr('type', 'text');
        eyeIcon.removeClass('far fa-eye').addClass('fas fa-eye-slash');
    } else {
        passwordInput.attr('type', 'password');
        eyeIcon.removeClass('fas fa-eye-slash').addClass('far fa-eye');
    }
}

// Helper function to render data grid through the data received
function renderDataGridView(page) {
    const startIndex = (page - 1) * entriesPerPage;

    $.ajax({
        url: '/api/ManageUser',
        type: 'GET',
        data: {
            pageNo: page,
            pageSize: entriesPerPage
        },
        success: function (data) {
            const pageData = data.pageData;
            const totalEntries = data.totalCount;
            const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);

            $('#dataGridView').empty();

            const table = $('<table>').addClass('table');
            const thead = $('<thead>');
            const headerRow = $('<tr>');
            const headerCells = ['', 'Role', 'User Name', 'Email'];

            headerCells.forEach((header, index) => {
                const th = $('<th>');
                if (index === 0) {
                    const headerCheckbox = $('<input>').attr('type', 'checkbox');
                    headerCheckbox.on('change', function () {
                        $('tbody input[type="checkbox"]').prop('checked', $(this).prop('checked'));
                    });
                    th.append(headerCheckbox);
                } else {
                    th.text(header);
                }
                headerRow.append(th);
            });

            thead.append(headerRow);
            table.append(thead);

            const tbody = $('<tbody>');
            pageData.forEach(user => {
                const tr = $('<tr>').attr('data-user-id', user.userId);
                const cells = [
                    $('<td>').html('<input type="checkbox">'),
                    $('<td>').text(user.roleName),
                    $('<td>').text(user.userName),
                    $('<td>').text(user.email)
                ];
                cells.forEach(cell => {
                    tr.append(cell);
                });
                tbody.append(tr);
            });

            table.append(tbody);
            $('#dataGridView').append(table);

            updatePagination(startIndex + 1, endIndex, totalEntries);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Helper function to get Edit User Details
function editUserDetails(userId) {
    $.ajax({
        url: `/api/ManageUser/GetUserById/${userId}`,
        type: 'GET',
        success: function (user) {
            $('#edit-username').val(user.userName);
            $('#edit-email').val(user.email);
            $('#edit-password').val(user.password);
            $('#edit-confirm-password').val(user.password);
            const roleDropdown = $('#edit-role');
            const roleId = user.role_Id;
            const optionValue = roleId === 1 ? 'admin' : 'user';

            roleDropdown.find('option').each(function () {
                if ($(this).val() === optionValue) {
                    $(this).prop('selected', true);
                    return false; 
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching user data:', error);
        }
    });
}

// Function to validate and perform Update
function updateUser(userId) {
    const confirmPassword = $('#edit-confirm-password').val();
    const errorMessageContainer = $('#updateErrorMessageContainer');
    const messageContainer = $('#successMessage');

    if (userId === 0) {
        errorMessageContainer.html('Please select a user to update');
        errorMessageContainer.removeClass("d-none");
        setTimeout(function () { errorMessageContainer.addClass("d-none"); }, 5000);
        return;
    }

    const updatedUserData = {
        UserName: $('#edit-username').val(),
        Email: $('#edit-email').val(),
        Password: $('#edit-password').val(),
        Role: $('#edit-role').val(),
    };
    if (!validatePassword(updatedUserData.Password)) {
        console.log('Password is not strong enough');
        errorMessageContainer.html('Password is not strong enough Use One of the Following: <ul><li>Upper Case</li><li>Lower Case</li><li>Number</li><li>Special Character(!,@,#,$.&,*,+)</li></ul>');
        errorMessageContainer.removeClass("d-none");
        setTimeout(function () { errorMessageContainer.addClass("d-none"); }, 5000);
        return;
    }

    if (confirmPassword !== updatedUserData.Password) {
        console.log('Passwords do not match');
        errorMessageContainer.html('Password do not match with the Confirm Password');
        errorMessageContainer.removeClass("d-none");
        setTimeout(function () { errorMessageContainer.addClass("d-none"); }, 5000);
        return;
    }
    const editFormContainer = $('#updateFromContainer');

    // Ajax call to update user
    $.ajax({
        url: `/api/ManageUser/Update/${userId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedUserData),
        success: function (data) {
            if (data.resultInfo === 1) {
                console.log('User updated successfully.');
                messageContainer.html('User updated successfully');
                messageContainer.removeClass("d-none");
                setTimeout(function () {
                    messageContainer.addClass("d-none");
                }, 3000);
                renderDataGridView(currentPage);
                $('#editButton').prop('disabled', true);
                $('#deleteButton').prop('disabled', true);
                $('#updateFromContainer').addClass('hidden');
                resetForm();

            } else {
                console.error('Failed to update user:', data.ErrorMessage);
                errorMessageContainer.html('Failed to update user: ' + data.ErrorMessage);
                errorMessageContainer.removeClass("d-none");
                setTimeout(function () {
                    errorMessageContainer.addClass("d-none");
                }, 5000);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error updating user:', error);
            errorMessageContainer.html('Error updating user: ' + error);
            errorMessageContainer.removeClass("d-none");
            setTimeout(function () { messageContainer.addClass("d-none"); }, 5000);
        }
    });

    function resetForm() {
        $('#edit-username').val('');
        $('#edit-password').val('');
        $('#edit-confirm-password').val('');
        $('#edit-email').val('');
    }
}

// Function to delete selected rows
function deleteSelectedRows() {
    const checkedIds = getCheckedRowIds();
    const messageContainer = $('#successMessage');
    if (checkedIds.length === 0) {
        alert('Please select at least one row to delete.');
        return;
    }

    if (checkedIds.includes(1)) {
        alert('Admin user cannot be deleted.');
        return;
    }

    // Ajax call to delete rows and the data in it
    $.ajax({
        url: '/api/ManageUser',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(checkedIds),
        success: function (response) {
            if (response.resultInfo === 1) {
                messageContainer.html('Selected rows deleted successfully');
                messageContainer.removeClass("d-none");
                setTimeout(function () { messageContainer.addClass("d-none"); }, 3000);
                console.log('Selected rows deleted successfully.');
                renderDataGridView(currentPage);
                $('#deleteButton').prop('disabled', true);
                $('#editButton').prop('disabled', true);
            } else if (response.resultInfo === 2) {
                errorMessageContainer.html('Failed to delete selected rows: ' + response.errorMessage);
                errorMessageContainer.removeClass("d-none");
                setTimeout(function () { messageContainer.addClass("d-none"); }, 5000);
            } else {
                console.log('Unknown error occurred while deleting rows.');
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

//Helper function to get checked row ids
function getCheckedRowIds() {
    const checkedIds = [];
    $('input[type="checkbox"]:checked').each(function () {
        checkedIds.push($(this).closest('tr').data('userId'));
    });
    return checkedIds;
}

// Event listener for delete button
$('#deleteButton').click(function () {
    if (window.confirm('Are you sure you want to delete the selected rows?')) {
        deleteSelectedRows();
    }
    else {
        
    }
});

// Event listener for enable/disable buttons based on selected rows
// and super admin
function toggleButtonsAccessibility() {
    const deleteButton = document.getElementById('deleteButton');
    const editButton = document.getElementById('editButton');
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    let selectedCount = 0;
    let superAdminChecked = false;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCount++;
        }
       
        const row = checkbox.closest('tr');
        if (row && row.dataset.userId === '1' && checkbox.checked) {
            superAdminChecked = true;
        }
    });
  
    if (superAdminChecked) {
        deleteButton.disabled = true;
        editButton.disabled = true;
    } else {
        deleteButton.disabled = selectedCount === 0;
        editButton.disabled = selectedCount !== 1;
    }
}

// Event listener for checkboxes
dataGridView.addEventListener('change', function (event) {
    const target = event.target;
    if (target && target.type === 'checkbox') {
        toggleButtonsAccessibility();
    }
});

toggleButtonsAccessibility();

// Function to export data
$(document).ready(function () {
    function exportData() {
        $('#loading').show();
        $('#overlay').show();

        $.ajax({
            url: '/api/ManageUser/export',
            type: 'GET',
            success: function (response) {
                
                var blob = new Blob([response], { type: 'text/csv' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'PersonalDetails.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                $("#loading").hide();
                $('#ackMessage').html('Export successful');
                $("#ackMessage").show();
                $('#overlay').hide();

                setTimeout(function () {
                    $("#ackMessage").hide();
                }, 3000);
            },
            error: function (xhr, status, error) {
                console.error('Error exporting data:', error);
                $("#loading").hide();
                $('#overlay').hide();
                errorMessageContainer.innerHTML = 'Error exporting data: ' + error;
                errorMessageContainer.classList.remove("d-none");
                setTimeout(function () { messageContainer.classList.add("d-none"); }, 5000);
            }
        });
    }

    $('#exportButton').click(function () {
        exportData();
    });
});

// Function to import data
$(document).ready(function () {
    $('#importButton').click(function () {
        $('#fileInput').trigger('click');
    });

    $('#fileInput').change(function () {
        var file = this.files[0];

        if (file) {
            if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.name.endsWith('.csv')) {
                var formData = new FormData();
                formData.append('file', file);

                $('#overlay').show();
                $('#loading').show();
                
                $.ajax({
                    url: '/api/ManageUser/ImportUser',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        $('#loading').hide();
                        $('#overlay').hide();

                        if (response.resultInfo === 1) {
                          
                            $('#ackMessage').html('Import successful');
                            $('#ackMessage').show();
                            $('#fileInput').val('');

                            setTimeout(function () {
                                $('#ackMessage').hide();
                            }, 5000);

                        } else if (response.resultInfo === 2) {
                            $('#ackMessage').html(response.errorMessage);
                            $('#ackMessage').show();
                            $('#fileInput').val('');
                            function hideAckMessage(event) {
                                
                                if (!$(event.target).closest('#ackMessage').length) {
                                    $('#ackMessage').hide();
                                    
                                    $(document).off('click', hideAckMessage);
                                }
                            }
                         
                            $(document).on('click', hideAckMessage);
                        }                      
                    },
                    error: function (xhr, status, error) {
                        console.error('Import failed:', error);
                        $('#loading').hide();
                        $('#overlay').hide();
                        $('#fileInput').val('');
                    }
                });
            } else {
                console.log('Selected file is not a CSV file.');
                alert('Please select a valid CSV file.');
                $('#fileInput').val('');
            }
        } else {
            console.log('No file selected.');
        }
    });
});

const currentPageSpan = document.getElementById('pageNumber');
const startIndexSpan = document.getElementById('startIndex');
const endIndexSpan = document.getElementById('endIndex');
const totalEntriesSpan = document.getElementById('totalEntries');
let currentPage = 1;

entriesSelect.addEventListener('change', handleEntriesChange);

// Function to handle pagination
function handleEntriesChange(event) {
    const selectedValue = parseInt(event.target.value);

    entriesPerPage = selectedValue;
    currentPage = 1;
    renderDataGridView(currentPage);
}

prevButton.addEventListener('click', handlePrevClick);
nextButton.addEventListener('click', handleNextClick);

// Helper functions to handle previous buttons of pagination
function handlePrevClick() {
    if (currentPage > 1) {
        currentPage--;
        updatePageNumber(currentPage);
        renderDataGridView(currentPage);
    }
}

// Helper functions to handle next buttons of pagination
function handleNextClick() {
    const totalEntriesText = totalEntriesSpan.textContent;
    const totalEntries = parseInt(totalEntriesText);

    if (!isNaN(totalEntries)) {
        const totalPages = Math.ceil(totalEntries / entriesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePageNumber(currentPage);
            renderDataGridView(currentPage);
        }
    } else {
        console.error('Total entries is not a valid number');
    }
}

// Helper function to update the page number
function updatePageNumber(pageNumber) {
    const pageNumberElement = document.getElementById('pageNumber');
    pageNumberElement.textContent = pageNumber;
}

// Helper function to update the pagination
function updatePagination(startIndex, endIndex, totalEntries) {
   
    startIndexSpan.textContent = startIndex;
    endIndexSpan.textContent = endIndex;
    totalEntriesSpan.textContent = totalEntries;

    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const currentPageSpan = document.getElementById('pageNumber');
    currentPageSpan.innerHTML = ''; 

    const paginationContainer = document.createElement('ul');
    paginationContainer.className = 'pagination';

    const pageRange = 3;
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }

    for (let page = startPage; page <= endPage; page++) {
        addPageButton(page);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageButton(totalPages);
    }

    currentPageSpan.appendChild(paginationContainer);

    function addPageButton(page) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';

        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.textContent = page;

        if (page === currentPage) {
            pageItem.classList.add('active');
        } else {
            pageLink.addEventListener('click', () => {
                currentPage = page;
                updatePageNumber(page);
                renderDataGridView(page);
            });
        }

        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }

    function addEllipsis() {
        const ellipsisItem = document.createElement('li');
        ellipsisItem.className = 'page-item disabled';

        const ellipsisLink = document.createElement('a');
        ellipsisLink.className = 'page-link';
        ellipsisLink.textContent = '...';

        ellipsisItem.appendChild(ellipsisLink);
        paginationContainer.appendChild(ellipsisItem);
    }
}

renderDataGridView(currentPage);