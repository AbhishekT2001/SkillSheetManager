const entriesSelect = document.getElementById('entriesSelect');
const dataGridView = document.getElementById('dataGridView');
const startIndex = document.getElementById('startIndex');
const endIndex = document.getElementById('endIndex');
const totalEntries = document.getElementById('totalEntries');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const formContainer = document.getElementById('addFromContainer');
const showFormButton = document.getElementById('addButton');

document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const hideAddFormButton = document.getElementById('hideAddFrom');
    const formContainer = document.getElementById('addFromContainer');

    const editButton = document.getElementById('editButton');
    const hideUpdateFormButton = document.getElementById('hideUpdateFrom');
    const updateFormContainer = document.getElementById('updateFromContainer');

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

    const addForm = document.querySelector('#addFromContainer form');
    addForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const email = document.getElementById('email').value;

        // Perform validation if needed

        // Send the data to your backend API
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
                delFlg: 'N',
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
                console.log('User added successfully:', data);
                // Optionally, display a success message or perform other actions
                formContainer.classList.add('hidden');
                resetForm();
            })
            .catch(error => {
                console.error('Error adding user:', error);
                // Optionally, display an error message or perform other actions
            });
    });
});

    function resetFormFields(form) {
        const inputs = form.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
        inputs.forEach(input => {
            input.value = '';
        });
    }

entriesSelect.addEventListener('change', handleEntriesChange);
prevButton.addEventListener('click', handlePrevClick);
nextButton.addEventListener('click', handleNextClick);

function handleEntriesChange(event) {
    entriesPerPage = parseInt(event.target.value);
    totalPages = Math.ceil(users.length / entriesPerPage);
    currentPage = 1;
    renderDataGridView(currentPage);
}

function handlePrevClick() {
    if (currentPage > 1) {
        currentPage--;
        renderDataGridView(currentPage);
    }
}

function handleNextClick() {
    if (currentPage < totalPages) {
        currentPage++;
        renderDataGridView(currentPage);
    }
}

// Sample data
const users = [];



let currentPage = 1;
let entriesPerPage = 10;
let totalPages = Math.ceil(users.length / entriesPerPage);

function renderDataGridView(page) {
    const startIndex = (page - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;

    $.ajax({
        url: '/api/ManageUser',
        type: 'GET',
        success: function (response) {
            dataGridView.innerHTML = '';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            const headerCells = ['', 'Role', 'User Name', 'Email'];
            headerCells.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            response.forEach(user => {
                const tr = document.createElement('tr');
                tr.dataset.userId = user.id; // Set data attribute for user ID

                const cells = [
                    `<td><input type="checkbox"></td>`,
                    `<td>${user.roleName}</td>`,
                    `<td>${user.userName}</td>`,
                    `<td>${user.email}</td>`
                ];

                cells.forEach(cell => {
                    const td = document.createElement('td');
                    td.innerHTML = cell;
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            dataGridView.appendChild(table);

            updatePagination(page);
        },
        error: function (xhr, status, error) {
            console.error(error); // Handle error
        }
    });
}

// Function to get the IDs of checked rows
function deleteSelectedRows() {
    const checkedIds = getCheckedRowIds();
    if (checkedIds.length === 0) {
        alert('Please select at least one row to delete.');
        return;
    }

    $.ajax({
        url: '/api/ManageUser/Delete',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(checkedIds),
        success: function (response) {
            // Optionally, update the UI or perform other actions upon successful deletion
            console.log('Selected rows deleted successfully.');
            renderDataGridView(currentPage); // Refresh the data grid after deletion
        },
        error: function (xhr, status, error) {
            console.error(error); // Handle error
        }
    });
}

function getCheckedRowIds() {
    const checkedIds = [];
    $('input[type="checkbox"]:checked').each(function () {
        checkedIds.push($(this).closest('tr').data('userId'));
    });
    return checkedIds;
}

// Attach an event listener to the delete button
$('#deleteButton').click(function () {
    if (window.confirm('Are you sure you want to delete the selected rows?')) {
        deleteSelectedRows();
    }
    else {

    }
});

function updatePagination(page) {
    const startIndex = (page - 1) * entriesPerPage + 1;
    const endIndex = startIndex + entriesPerPage - 1;
    const totalEntries = users.length;

    document.getElementById('startIndex').textContent = startIndex;
    document.getElementById('endIndex').textContent = endIndex > totalEntries ? totalEntries : endIndex;
    document.getElementById('totalEntries').textContent = totalEntries;

    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
}

renderDataGridView(currentPage);