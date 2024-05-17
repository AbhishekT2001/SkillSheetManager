// To not store the history
$(document).ready(function () {
   
    window.addEventListener('popstate', function (event) {
        if (event.state) {
           
            history.pushState(null, null, window.location.href);
        }
    });
    
    history.pushState(null, null, window.location.href);

    window.addEventListener('popstate', function (event) {
        if (event.state) {
            history.pushState(null, null, window.location.href);
        }
    });
});
