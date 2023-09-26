$(document).ready(function () {
  // Charger la liste des éléments existants
  function loadItems() {
    $('button').prop('disabled', true);
    /*$.ajax({
      url: "http://localhost/crudjquery/api/items.php",
      timeout: 3000,
      beforeSend: function () {
        $("#item-list").empty();
        $("#item-list").append(
          '<tr><td><div class="d-flex justify-content-center"> <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div></td></tr>'
        );
      },
    }).done(function (data) {
      $("#item-list").empty();
      const names = [];
      $(data).each(function (index, element) {
        names.push(element.name);
      });
      for (let i = names.length - 1; i >= 0; i--) {
        $("#item-list").append("<tr><td>" + names[i] + "</td></tr>");
      }
    });*/
  }
  loadItems();
  // Ajouter un nouvel élément
  $("#add-item-form").on("submit", function (eventAddItem) {
    $("#error-message").empty();
    eventAddItem.preventDefault();
    // Récupérez les données du formulaire
    var formData = $(this).serialize();
    var newItem = $("#new-item").val();
    console.log(newItem);
    // Vérifier si la valeur a moins de 3 caractères
    if (newItem.length < 3) {
      // Afficher le message d'erreur
      $("#error-message").append(
        '<i class="bi bi-exclamation-circle"></i> Le champ doit contenir au moins 3 caractères'
      );
      // Empêcher l'envoi du formulaire
      eventAddItem.preventDefault();
    } else {
      // Effacer le message d'erreur s'il y en a un
      $("#error-message").empty();
    }
    var dataInput = { newItem: newItem };
    /*$.post("http://localhost/api/items", dataName, function () {
      loadItems();
      $("#new-item").val("");
    });*/
    $.ajax({
      url: "http://localhost/crudjquery/api/items.php",
      method: "post",
      dataType: "json",
      data: JSON.stringify(dataInput),
      contentType: "application/json; charset=utf-8",
      beforeSend: function (xhr) {
        /*setTimeout(() => {
          console.log("Delayed for 1 second.");
        }, "1000");*/
        $("#item-list").append(
          '<tr><td><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>'
        );
      },
    })
      .done(function (data, textStatus, jqXHR) {
        loadItems();
      })
      .fail(function (error) {
        console.log("error");
      })
      .always(function () {
        $("#new-item").val("");
        console.log("complete ajax post items");
      });
  });
  $("input").on("keyup", function (eventKeyEditItem) {
    var inputItem = $(this).val();
    var inputItemTrim = inputItem.trim();
    var parentInput = $(this).parent();
    var childrenButton = parentInput.children("button");
    if(inputItemTrim.length<3){
      $(this).toggleClass("red-border");
      childrenButton.prop('disabled', true);
      $(this).val(inputItemTrim);
    }else{
      $(this).toggleClass("blue-border");
      childrenButton.prop('disabled', false);
      $(this).val(inputItemTrim);
    }
  });
  // Modifier un élément existant
  /*$("#edit-item").on("keyup", function (eventKeyEditItem) {
    var editItem = $("#edit-item").val();
    var editIemTrim = editItem.trim();
    if(editIemTrim.length<3){
      $("#edit-item").toggleClass("red-border");
      $('#update-item').prop('disabled', true);
      $(this).val(editIemTrim);
    }else{
      $("#edit-item").toggleClass("blue-border");
      $('#update-item').prop('disabled', false);
      $(this).val(editIemTrim);
    }
  });*/
  $("#update-item-form").on("submit", function (eventEditItem) {
    $("#error-message-update").empty();
    eventEditItem.preventDefault();
    var choicedItem = $("#choice-item").val();
    var editItem = $("#edit-item").val();
    var selectedValue = $("#update-select-item").val();
    $("#update-select-item").on("change", function () {
      selectedValue = $(this).val();
    });
    console.log(selectedValue);
    if (editItem.length < 3) {
      // Afficher le message d'erreur
      $("#error-message-update").append(
        '<i class="bi bi-exclamation-circle"></i> Le champ doit contenir au moins 3 caractères'
      );
      $("#edit-item").toggleClass("red-border");
      // Empêcher l'envoi du formulaire
      eventEditItem.preventDefault();
    } else {
      // Effacer le message d'erreur s'il y en a un
      $("#error-message-update").empty();
      $("#edit-item").toggleClass("blue-border");
    }
    var dataInput = { editItem: editItem, choicedItem: selectedValue };
    $.ajax({
      url: "http://localhost/crudjquery/api/items.php",
      method: "post",
      dataType: "json",
      data: JSON.stringify(dataInput),
      contentType: "application/json; charset=utf-8",
    })
      .done(function (data, textStatus, jqXHR) {
        loadItems();
        $("#edit-item").val("");
        $("#update-select-item").val(null).trigger("change");
      })
      .fail(function (error) {
        console.log("error");
      })
      .always(function () {
        $("#new-item").val("");
        console.log("complete ajax update items");
      });
  });

  // Supprimer un élément
  $("#remove-item-form").on("submit", function (deleteEvent) {
    deleteEvent.preventDefault();
    var deletedItem = $("#delete-item").val();
    var dataInput = { deletedItem: deletedItem };
    $.ajax({
      url: "http://localhost/crudjquery/api/items.php",
      method: "post",
      dataType: "json",
      data: JSON.stringify(dataInput),
      contentType: "application/json; charset=utf-8",
    })
      .done(function (data, textStatus, jqXHR) {
        loadItems();
      })
      .fail(function (error) {
        console.log("error");
      })
      .always(function () {
        $("#delete-item").val("");
        console.log("complete ajax delete items");
      });
  });

  // Fonction de recherche
  $("#search-item-form").on("submit", function (searchEvent) {
    searchEvent.preventDefault();
    var searchItem = $("#search-item").val();

    // Effectuez une requête GET pour récupérer les éléments correspondant à la recherche
    var dataInput = { searchItem: searchItem };
    $.ajax({
      url: "http://localhost/crudjquery/api/items.php",
      method: "post",
      dataType: "json",
      data: JSON.stringify(dataInput),
      contentType: "application/json; charset=utf-8",
      timeout: 3000,
      beforeSend: function () {
        $("#item-list").empty();
        $("#item-list").append(
          '<tr><td><div class="d-flex justify-content-center"> <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div></td></tr>'
        );
      },
    })
      .done(function (data) {
        $("#item-list").empty();
        const names = [];
        $(data).each(function (index, element) {
          names.push(element.name);
        });
        for (let i = names.length - 1; i >= 0; i--) {
          $("#item-list").append("<tr><td>" + names[i] + "</td></tr>");
        }
        if (names.length === 0) {
          $("#item-list").append("<tr><td>no result</td></tr>");
        }
      })
      .fail(function (error) {
        console.log("error");
      })
      .always(function () {
        $("#search-item").val("");
        console.log("complete ajax search items");
      });
  });

  // Configuration de SELECT2.JS
  $(".selectItem").select2({
    width: "100%",
    language: "fr",
    theme: "bootstrap-5",
    placeholder: "Entrer votre élément",
    minimumInputLength: 3,
    ajax: {
      url: "http://localhost/crudjquery/api/select2ajax.php",
      dataType: "json",
      type: "GET",
      delay: 250,
      data: function (params) {
        var queryParameters = {
          q: params.term,
        };
        return queryParameters;
      },
      processResults: function (data) {
        /*const names = [];
        $(data).each(function (index, element) {
          names.push(element.name);
        });*/
        return {
          results: data.map(function (item) {
            return { id: item.name, text: item.name };
          }),
        };
      },
      cache: false,
    },
    placeholder: "Saisir votre élément",
    minimumInputLength: 2,
  }); 
  $('#table-item').DataTable({
    "searching": false, // Désactive la fonction de recherche
    "ordering": false, // Désactive la fonction de tri
    "language": {
      "url": "/library/DataTables/Plugins/i18n/French.json" // URL to the language file 
    },
    "lengthMenu": [5, 10, 25, 50], // Specify the available options
    "pageLength": 5, // Set the default number of entries per page
    "ajax": {
      "url": 'http://localhost/crudjquery/api/items.php'  
    },
    "columns": [ 
      { data: 'name' }
    ]
  });
});  