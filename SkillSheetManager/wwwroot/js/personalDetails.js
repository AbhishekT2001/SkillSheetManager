const storedUsername = localStorage.getItem('username');
const errorMessageContainer = document.getElementById('errorMessageContainer');
const successMessageContainer = document.getElementById('successMessageContainer');
const joiningDateText = document.getElementById('joiningDateText');
const dateOfBirthText = document.getElementById('dateOfBirthText');

// Check if the user is logged in
$(document).ready(function () {
    const dropdownButton = $('#dropdownButton');
    const storedUsername = localStorage.getItem('username');
    const successMessageContainer = $('#successMessageContainer');

    if (storedUsername) {
        dropdownButton.text(storedUsername);
    } else {
        dropdownButton.text('User');
    }

    if (sessionStorage.getItem('loggedIn') === 'true') {
        successMessageContainer.html('Successfully logged in as ' + storedUsername);
        successMessageContainer.removeClass('d-none');
        setTimeout(function () { successMessageContainer.addClass('d-none'); }, 3000);
        sessionStorage.removeItem('loggedIn');
    }
});

// Dropdown menu 
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Date picker for DOB and Joining date
$(document).ready(function () {
    var eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    $("#dateOfBirthText").datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: eighteenYearsAgo,
        minDate: '-100y',
        changeYear: true,
        changeMonth: true,
        onSelect: function (dateText, inst) {
            $(this).val(dateText);
        }
    });

    $("#joiningDateText").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: '-100y',
        changeYear: true,
        changeMonth: true,
        onSelect: function (dateText, inst) {
            $(this).val(dateText);
        }
    });

    $("#calendarIcon1").click(function () {
        $("#dateOfBirthText").datepicker("show");
    });

    $("#calendarIcon2").click(function () {
        $("#joiningDateText").datepicker("show");
    });
});

// Date validation for DOB and Joining date
dateOfBirthText.addEventListener('input', function (event) {
    let value = event.target.value;

    value = value.replace(/\D/g, '');

    if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
    } else if (value.length > 6) {
        value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6);
    } else if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4);
    }

    event.target.value = value;
});

joiningDateText.addEventListener('input', function (event) {
    let value = event.target.value;

    value = value.replace(/\D/g, '');

    if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
    } else if (value.length > 6) {
        value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6);
    } else if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4);
    }

    event.target.value = value;
});

// Imgae preview and Validation for Image file
$(document).ready(function () {
    $('#browseButton').click(function () {
        var fileInput = $('<input type="file" accept="image/*" />');

        fileInput.click();

        fileInput.change(function () {
            var file = fileInput[0].files[0];

            if (file) {
                if (file.type.startsWith('image/')) {
                    var fileSizeInMB = file.size / (1024 * 1024);

                    if (fileSizeInMB <= 2) {
                        var reader = new FileReader();                      

                        reader.onload = function () {
                            $('#photoLocation').val(file.name);

                            var previewContainer = $('#previewContainer');
                            previewContainer.empty();

                            var imgElement = $('<img>');
                            imgElement.attr('src', reader.result);
                            imgElement.attr('width', 200);
                            imgElement.attr('height', 200);
                            previewContainer.append(imgElement);

                            var imageDataInByte = reader.result;

                            $('#photoLocation').attr('data-image', imageDataInByte);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        alert('Selected image should be less than or equal to 2 MB.');
                        fileInput.val('');
                    }
                } else {
                    alert('Please select a valid image file.');
                    fileInput.val('');
                }
            }
        });
    });
});

// Get Personal Details from database if already stored
$(document).ready(function () {
    
    const storedUsername = localStorage.getItem('username');

    // Populate form with personal details if exists
    function populateForm(data) {
        $('.personal-detail-textinput').val(data.name);
        const dateOfBirth = new Date(data.dateOfBirth);
        $('#dateOfBirthText').val(dateOfBirth.toISOString().split('T')[0]);
        if (data.gender === 1) {
            $('.personal-detail-select').val('Male');
        }
        if (data.gender === 2) {
            $('.personal-detail-select').val('Female');
        }
        const joiningDate = new Date(data.joiningDate);
        $('#joiningDateText').val(joiningDate.toISOString().split('T')[0]);
        $('.personal-detail-select1').val(data.workedInJapan ? 'Yes' : 'No');
        $('.personal-detail-textarea').val(data.qualification);
        $('.personal-detail-textinput3').val(data.languages);
        $('.personal-detail-textinput4').val(data.databases);

        if (data.photo) {
            $('#photoLocation').val('Photo uploaded');
            $('#photoLocation').attr('data-image', data.photo);
            const imgElement = $('<img>').attr({
                src: `data:image/jpeg;base64,${data.photo}`,
                width: 200,
                height: 200
            });
            $('#previewContainer').empty().append(imgElement);
        } else {
            $('#photoLocation').val('');
            $('#previewContainer').empty();
        }
    }

    if (storedUsername) {
        $.ajax({
            url: `/api/PersonalDetails/${storedUsername}`,
            type: 'GET',
            success: function (response) {
                if (response.resultInfo === 1 && response.data) {
                   
                    populateForm(response.data);
                } else {
                    console.log('No personal details found for the user.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching personal details:', error);
            }
        });
    } else {
        console.error('No stored username found.');
    }
});

// Save Personal Details to database
$(document).ready(function () {
    $('.personal-detail-form').submit(function (event) {
        event.preventDefault();

        var name = $('.personal-detail-textinput').val();
        var dateOfBirth = $('#dateOfBirthText').val();
        var gender = $('.personal-detail-select').val();
        var joiningDate = $('#joiningDateText').val();
        var workedInJapan = $('.personal-detail-select1').val() === 'Yes';
        var qualification = $('.personal-detail-textarea').val();
        var languages = $('.personal-detail-textinput3').val();
        var databases = $('.personal-detail-textinput4').val();

        var imageData = $('#photoLocation').attr('data-image');

        var today = new Date();
        var minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 60);
        var minDateString = minDate.toISOString().slice(0, 10);

        if (joiningDate > today.toISOString().slice(0, 10) || joiningDate < minDateString) {
            errorMessageContainer.innerHTML = 'Please enter a valid joining date.';
            errorMessageContainer.classList.remove("d-none");
            setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
            return;
        }

        var maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() - 18);
        var maxDateString = maxDate.toISOString().slice(0, 10);

        if (dateOfBirth > today.toISOString().slice(0, 10) || dateOfBirth < minDateString || dateOfBirth > maxDateString) {
            errorMessageContainer.innerHTML = 'Please enter a valid date of birth.';
            errorMessageContainer.classList.remove("d-none");
            setTimeout(function () { errorMessageContainer.classList.add("d-none"); }, 5000);
            return;
        }

        var formData = {
            UserName: storedUsername,
            Name: name,
            DateOfBirth: dateOfBirth,
            Gender: gender,
            DateOfJoining: joiningDate,
            WorkedInJapan: workedInJapan,
            Qualification: qualification,
            Languages: languages,
            Databases: databases
        };

        if (imageData) { 

            formData.Photo = addBase64Prefix(imageData);
        }
        else {
            formData.Photo = '';
        }

        $.ajax({
            type: 'POST',
            url: '/api/PersonalDetails',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.resultInfo === 1) {
                    alert('Personal details saved successfully');
                    resetFormFields();
                } else {
                    alert('Error saving personal details: ' + response.errorMessage + response.errorCode);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    // Add base64 prefix if not present in image data
    function addBase64Prefix(imageData) {
        const base64Prefixes = [
            "data:image/jpeg;base64,",
            "data:image/png;base64,",
        ];

        const hasPrefix = base64Prefixes.some(prefix => imageData.startsWith(prefix));

        if (!hasPrefix) {
            imageData = "data:image/jpeg;base64," + imageData;
        }

        return imageData;
    }
});

// Helper function to reset form fields
function resetFormFields() {
    
    $('.personal-detail-form').find('input[type="text"], input[type="password"], input[type="email"]').val('');

   
    $('#dateOfBirthText, #joiningDateText').val('');

  
    $('.personal-detail-form').find('select').each(function () {
        $(this).val('');
    });

    
    $('#photoLocation').val('');
    $('#previewContainer').empty();

    $('.personal-detail-textarea').val('');

    $('.personal-detail-select1').val('No');

    $('#errorMessageContainer').addClass('d-none').html('');
    $('#successMessageContainer').addClass('d-none').html('');
}
