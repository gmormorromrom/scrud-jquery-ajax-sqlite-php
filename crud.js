$(document).ready(function () {
  /* $('.basic-select2').select2({
    width: "100%"
  }); */
  function loadSelectChoiceLang()
  { 
    let langSelect2 = $("html").attr("lang");
    let placeholderSelect2 = "Enter your item";
    if (langSelect2 == "fr") {
      placeholderSelect2 = "Saisir votre élément";
    }
    $('#select-lang-form').select2({
      width: "30%"
    });
  }
  loadSelectChoiceLang();
  // (FR) - Fonction pour charger le spinner
  // (EN / US) - Function for loading the spinner
  function loadSpinner() {
    $("#item-list").append(
      '<tr id="load-spinner"><td><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>'
    );
  }
  // (FR) - Fonction pour supprimer le spinner
  // (EN / US) - Function to remove spinner
  function emptySpinner() {
    $("#load-spinner").empty();
  }

  // (FR) - Charger la liste des éléments existants
  // (EN / US) - Load list of existing items
  function loadItems() {
    $("button").prop("disabled", true);
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
    }).always;
  }
  loadItems();
  // (FR) - Ajouter un nouvel élément
  // (EN / US) - Add a new item
  $("#add-item-form").on("submit", function (eventAddItem) {
    $("#error-message").empty();
    eventAddItem.preventDefault();
    // Récupérez les données du formulaire
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
        loadSpinner();
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
        emptySpinner();
        console.log("complete ajax post items");
      });
  });
  // (FR) - Fonction qui ecoute le clavier dans les inputs et supprime les espaces
  // (EN / US) - Function that listens to the keyboard in inputs and removes spaces
  $("input").on("keyup", function (eventKeyInputItem) {
    var inputItem = $(this).val();
    var inputItemTrim = inputItem.trim();
    var inputWithoutSpaces = inputItemTrim.replace(/\s+/g, ""); // Supprime les espaces
    var parentInput = $(this).parent();
    var childrenButton = parentInput.children("button");
    var childrenMessageError = parentInput.children("#error-message");
    if (inputWithoutSpaces.length < 3) {
      // ajout notification erreur
      childrenMessageError.append(
        '<i class="bi bi-exclamation-circle"></i> Le champ doit contenir au moins 3 caractères'
      );
      // mettre en rouge le contour input
      $(this).toggleClass("red-border");
      // desactiver le bouton
      childrenButton.prop("disabled", true);
      // charger le contenu sans espace
      $(this).val(inputWithoutSpaces);
      // Empêcher l'envoi du formulaire
      eventKeyInputItem.preventDefault();
    } else {
      // Effacer le message d'erreur s'il y en a un
      childrenMessageError.empty();
      // rendre de contour input en bleu
      $(this).toggleClass("blue-border");
      // activer le bouton
      childrenButton.prop("disabled", false);
      // charger le contenu sans espace
      $(this).val(inputWithoutSpaces);
    }
  });
  /**
   * (FR) - Action dans l'envoi du formulaire de mise a jour
   * (EN / US) - Action in sending the update form
   */
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

  /**
   * (FR) - Suppression d'un élément
   * (EN / US) - Deleting an item
   */
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

  /**
   * (FR) - Rechercher un élément
   * (EN / US) - Search an item
   */
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

  /**
   * (FR) - Parametrage de SELECT2.JS
   * (EN / US) - Setting up SELECT2.JS
   */
  function loadSelect2() {
    var langSelect2 = $("html").attr("lang");
    var placeholderSelect2 = "Enter your item";
    if (langSelect2 == "fr") {
      placeholderSelect2 = "Saisir votre élément";
    }
    $(".selectItem").select2({
      width: "100%",
      language: langSelect2,
      theme: "bootstrap-5",
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
          return {
            results: data.map(function (item) {
              return { id: item.name, text: item.name };
            }),
          };
        },
        cache: false,
      },
      placeholder: placeholderSelect2,
      minimumInputLength: 2,
    });
  }
  loadSelect2();
  /**
   * (FR) - Parametrage de DATATABLE.JS
   * (EN / US) - Setting up DATATABLE.JS
   */
  function loadDatatable() {
    var urlLangFr = "/library/DataTables/Plugins/i18n/French.json";
    var urlLangEn = "/library/DataTables/Plugins/i18n/en-gb.json";
    var langage = $("html").attr("lang");
    console.log(langage);
    var urlLang = urlLangEn;
    if (langage === "fr") {
      urlLang = urlLangFr;
    } else if (langage === "en") {
      urlLang = urlLangEn;
    } else {
      urlLang = urlLangEn;
    }

    $("#table-item").DataTable({
      searching: false, // (FR) - Désactive la fonction de recherche, (EN/US) - Disable the search function
      ordering: false, // (FR) - Désactive la fonction de tri, (EN/US) - Disable sorting function
      language: {
        url: urlLang, // (FR) - URL vers le fichier de langue, (EN/US) - URL to the language file
      },
      lengthMenu: [5, 10, 25, 50], // (FR) - Préciser les options disponibles, (EN/US) - Specify the available options
      pageLength: 5, // (FR) - Définir le nombre par défaut d'entrées par page, (EN/US) - Set the default number of entries per page
      ajax: {
        url: "http://localhost/crudjquery/api/items.php",
      },
      columns: [{ data: "name" }],
    });
  }
  loadDatatable();
});
