
function setCookie(name,value) {
    var expires = "";
    var date = new Date();
    //  Expires in 50 years
    date.setTime(date.getTime() + (18250*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return '';
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

var refreshOnLoad = false;

function goToSettings() {
  if (refreshOnLoad) {
    location.reload();
    return;
  }
  $('#GoToApp').fadeIn();
  $('#settings').fadeIn();
  $('#apps').hide();
  $('#GoToSettings').hide();
  $('#add_category').focus();
}

function goToApp() {
  if (refreshOnLoad) {
    location.reload();
    return;
  }
  $('#GoToApp').hide();
  $('#settings').hide();
  $('#apps').fadeIn();
  $('#GoToSettings').fadeIn();
  $('#global_filter').focus();
}

$(document).ready(function () {

  //  Category table
  var category_table = $('#category_table').DataTable({
    searching: false,
    info: false,
    paging: false,
  });

  //  App Table
  var app_table = $('#app_table').DataTable({
    searching: true,
    info: false,
    lengthChange: false,
    columnDefs: [
      {
         targets: [2],
         render: function(data, type, full, meta){
            if(type === 'filter' || type === 'sort'){
               var api = new $.fn.dataTable.Api(meta.settings);
               var td = api.cell({row: meta.row, column: meta.col}).node();
               data = $('select, input', td).val();
            }

            return data;
         }
      },
      {
        targets: [0],
        render: function(data, type, full, meta){
           if(type === 'filter' || type === 'sort'){
              var api = new $.fn.dataTable.Api(meta.settings);
              var td = api.cell({row: meta.row, column: meta.col}).node();
              data = $('i', td).hasClass('fa-star-o');
           }

           return data;
        }
      }
    ],
  });

  //  Hide tabs
  $('#settings').hide();
  $('#GoToApp').hide();

  //  Nav button to settings
  $('#GoToSettings').click(function() {
    goToSettings();
  });

  //  Nav button to home
  $('#GoToApp').click(function() {
    goToApp();
  });

  document.onkeyup = PressTab;

  function PressTab(e)
  {
    var keycode = (window.event) ? event.keyCode : e.keyCode;
    if (keycode == 9 && $('#settings').is(":visible")) {
      goToApp();
    } else if (keycode == 9 && $('#apps').is(":visible")) {
      goToSettings();
    }

    if (keycode == 13 && $('#settings').is(":visible")) {
      refreshOnLoad = true;
      category_table.row.add({
        0: $('#add_category').val(),
        1: "<a href='#' class='remove-category'>Remove</a>"
      }).draw();
      var categories = [];
      if (getCookie('categories') !== '') {
        categories = JSON.parse(getCookie('categories'));
      }
      categories.push($('#add_category').val());
      setCookie('categories', JSON.stringify(categories));
      $('#add_category').val('');
    } else if (keycode == 13 && $('#apps').is(":visible")) {
      if ($('.open-app-link:first').length != 0) {
        window.open($('.open-app-link:first').attr('href'), '_newtab');
      }
    }
  }

  //  Focus on search
  $('#global_filter').focus();

  //  Queue user that search is ready
  $('#global_filter').removeClass('bg-primary');

  //  Search
  $('#global_filter').keyup(function() {
    $('#app_table').DataTable().search($('#global_filter').val()).draw();
  });

  //  Update category
  $( "#app_table tbody" ).on('change', '.category-class', function() {
    $('#app_table').DataTable().row($(this).closest('tr')).invalidate();
    setCookie($('.file-name-class:first', $(this).closest('tr')).text(), $(this).val());
  });

  //  Update star (add)
  $( "#app_table tbody" ).on('click', '.fa-star-o', function() {
    $(this).removeClass('fa-star-o').addClass('fa-star');
    $('#app_table').DataTable().row($(this).closest('tr')).invalidate();
    setCookie($('.file-name-class:first', $(this).closest('tr')).text() + '_app_is_starred', true);
  });

  //  Update star (remove)
  $( "#app_table tbody" ).on('click', '.fa-star', function() {
    $(this).removeClass('fa-star').addClass('fa-star-o');
    $('#app_table').DataTable().row($(this).closest('tr')).invalidate();
    eraseCookie($('.file-name-class:first', $(this).closest('tr')).text() + '_app_is_starred');
  });

  //  Remove category
  $( "#category_table tbody").on('click', '.remove-category', function(e) {
    e.preventDefault();
    refreshOnLoad = true;
    var name = $('.category-name:first', $(this).closest('tr')).text()
    category_table.row( $(this).parents('tr') ).remove().draw();
    var categories = JSON.parse(getCookie('categories'));
    categories[categories.indexOf(name)] = categories[0];
    categories.shift();
    eraseCookie('categories');
    setCookie('categories', JSON.stringify(categories));
  });
});
