

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

// Trong script jQuery của bạn
$(document).ready(function () {
    $('#dayStart').on('change', function () {
      var dayStartValue = new Date($(this).val());
      var dayEndValue = new Date($('#dayEnd').val());
  
      if (isNaN(dayStartValue.getTime())) {
        return;
      }
  
      if (dayEndValue < dayStartValue) {
        $('#dayEnd').val($(this).val());
      }
    });
  
    $('#dayEnd').on('change', function () {
      var dayEndValue = new Date($(this).val());
      var dayStartValue = new Date($('#dayStart').val());
  
      if (isNaN(dayEndValue.getTime())) {
        return;
      }
  
      if (dayEndValue < dayStartValue) {
        $(this).val($('#dayStart').val());
      }
    });
  });
  