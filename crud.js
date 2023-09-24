$(document).ready(function () {
  // Charger la liste des éléments existants
  function loadItems() {
    $.ajax({
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
    });
  }
  loadItems();
  // Ajouter un nouvel élément
  $("#add-item-form").on("submit", function (eventAddItem) {
    eventAddItem.preventDefault();
    // Récupérez les données du formulaire
    var formData = $(this).serialize();
    var newItem = $("#new-item").val();
    console.log(newItem);
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

  // Modifier un élément existant
  $("#update-item-form").on("submit", function (eventEditItem) {
    eventEditItem.preventDefault();
    var choicedItem = $("#choice-item").val();
    var editItem = $("#edit-item").val();
    var dataInput = { editItem: editItem, choicedItem: choicedItem };
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
        $("#choice-item").val("");
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
        if(names.length===0){
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
});
