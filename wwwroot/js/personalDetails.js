function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function changePassword() {
    alert("Change Password clicked");
}

function logout() {
    alert("Logout clicked");
}
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

document.getElementById('browseButton').addEventListener('click', function () {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; 

    fileInput.click();

    fileInput.addEventListener('change', function () {
        var file = fileInput.files[0]; 
        var reader = new FileReader(); 

        reader.onload = function () {
            document.getElementById('photoLocation').value = file.name;

            var previewContainer = document.getElementById('previewContainer');
            previewContainer.innerHTML = ''; 

            var imgElement = document.createElement('img');
            imgElement.src = reader.result;
            imgElement.width = 200; 
            imgElement.height = 200;
            previewContainer.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    });
});