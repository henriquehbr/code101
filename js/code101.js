drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));

var html2md = new showdown.Converter();

// Verify if browser supports Web Storage
if (typeof(Storage) !== "undefined") {
	console.log("Your browser supports Web Storage");
} else {
	console.log("Your browser doesn't support Web Storage!");
}

// Create "viewMode" on localStorage (if not exists)
if (localStorage.getItem("viewMode") == null) {
	localStorage.setItem("viewMode", "card");
}

// Get viewMode from localStorage
switch (localStorage.getItem("viewMode")) {
	// If viewMode == "list"
	case "list":
		// Change button to card mode
		$("#changeViewBtn").html(`
			<i class="mdc-list-item__graphic material-icons">view_modules</i>
			Visualizar em card
		`);
	break;

	// If viewMode == "card"
	case "card":
		// Change button to list mode
		$("#changeViewBtn").html(`
			<i class="mdc-list-item__graphic material-icons">view_list</i>
			Visualizar em lista
		`);
	break;
}

function toggleSearchBar(action) {

	switch (action) {
		case "open":
			
			// Clear the top app bar content
			$("#topAppBar .mdc-top-app-bar__row").html("");

			// Change the top app bar background color to white
			$("#topAppBar").css("background-color", "white");

			// Append the search bar to the top app bar
			$("#topAppBar .mdc-top-app-bar__row").append(`
				<input id="searchInput" type="search" class="w3-input w3-border-0 animated fadeIn" placeholder="Sobre o que você quer aprender?" style="padding-left: 16px;">
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end animated fadeIn" role="toolbar">
					<i class="material-icons material-icons-dark mdc-top-app-bar__action-item" aria-label="Pesquisar" alt="Pesquisar" onclick="toggleSearchBar('close')">close</i>
					<div class="mdc-line-ripple"></div>
				</section>
			`);

			// Initialize the search input
			$('#searchInput').hideseek({list: ".searchList"})
		break;

		case "close":

			/* Programmatically press key after search bar is closed
			in order to reset search results to the default state */
			var keyup = jQuery.Event("keyup");
			keyup.which = keyup.keyCode = 8;

			// Clear the search bar text
			$("#searchInput").val("").trigger(keyup);

			// Clear the top app bar content
			$("#topAppBar .mdc-top-app-bar__row").html("");

			// Change the top app bar background color to blue
			$("#topAppBar").css("background-color", "#6200ee");

			$("#topAppBar .mdc-top-app-bar__row").append(`
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
					<a id="drawerBtn" onclick="drawer.open = !drawer.open" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
					<span id="appTitle" class="mdc-top-app-bar__title code101-logo">code101</span>
				</section>
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
					<i class="material-icons mdc-top-app-bar__action-item" aria-label="Pesquisar" alt="Pesquisar" onclick="toggleSearchBar('open')">search</i>
				</section>
			`);
		break;
	}
}

// Toggles
function toggleAccordion() {
	$('.toggle-link').click(function(e) {

		e.preventDefault();

		var toggleActivePanel = $(this).closest('.panel');

		if (toggleActivePanel.find('.content-collapse').hasClass('velocity-animating')) {
			return false;
		} else if (e.handled !== true) {
			if ($(this).hasClass('active')) {
				toggleActivePanel.find('.content-collapse').attr('aria-expanded', false).velocity('slideUp', {
					easing: 'easeOutQuad'
				});
				$(this).attr('aria-expanded', false).removeClass('active');
			} else {
				toggleActivePanel.find('.content-collapse').attr('aria-expanded', true).velocity('slideDown', {
					easing: 'easeOutQuad'
				});
				$(this).attr('aria-expanded', true).addClass('active');
			}
			e.handled = true;
		} else {
			return false;
		}
	});
};

// List all the programming languages on the page
function listLanguagesOnPage() {

	// Close drawer
	drawer.open = false;

	// Disable slick on viewCard if it's enabled
	if ($("#viewCard").hasClass("slick-initialized")) {
		$("#viewCard").slick("unslick");
	}

	// Empty the content of the all the lists
	$("#viewList, #viewCard, #accordionList").html("");

	// Request the file languages.yml
	$.get("yml/languages.yml", function(data) {
		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);

		switch (localStorage.getItem("viewMode")) {
			case "list":

				// Turn card view invisible
				$("#viewCard").css("display", "none");

				// For each item in languages.yml...
				$.each(yamlData, function(i) {
					// Append the language on the language list
					$("#viewList").append(`
						<li onclick="listCommands('${yamlData[i].nome.toLowerCase()}')" class="mdc-list-item animated fadeIn">
							<img src="${yamlData[i].icone}" class="mdc-list-item__graphic" alt="${yamlData[i].nome}">
							<span class="mdc-list-item__text">
								<span class="mdc-list-item__primary-text">${yamlData[i].nome}</span>
								<span class="mdc-list-item__secondary-text">${yamlData[i].descricao}</span>
							</span>
						</li>
					`)
				})
			break;

			case "card":

				// Turn card view visible
				$("#viewCard").css("display", "block");

				// For each item in languages.yml...
				$.each(yamlData, function(i) {
					// Append the language on the language list
					$("#viewCard").append(`
						<a style="display: flex" class="miniCard carousel-cell animated fadeIn">
							<img src="${yamlData[i].icone}">
							<span class="mdc-typography--headline6 title">${yamlData[i].nome}</span>
							<span class="mdc-typography--caption">${yamlData[i].descricao}</span>
							<button onclick="listCommands('${yamlData[i].nome.toLowerCase()}')" class="mdc-button" onclick="listCommands('${yamlData[i].nome.toLowerCase()}')">
								Aprender
							</button>
						</a>
					`)
				})

				// Enable slick on view card
				$("#viewCard").slick({
					dots: false,
					arrows: false,
					infinite: false,
					swipeToSlide: true,
					centerMode: false,
					variableWidth: true
				});

			break;
		}
	})
}

function listLanguagesOnDrawer() {

	// Empty the previous content of the language list
	$("#languagesDrawer").html("");

	// Request the file languages.yml
	$.get("yml/languages.yml", function(data) {
		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);
		// For each item in languages.yml...
		$.each(yamlData, function(i) {
			// Appends the following code to the drawer
			$("#languagesDrawer").append(`
				<a onclick="listCommands('${yamlData[i].nome.toLowerCase()}'); drawer.open = false" class="mdc-list-item mdc-list-item">
					<img class="mdc-list-item__graphic" src="${yamlData[i].icone}" alt="${yamlData[i].nome}">
					${yamlData[i].nome}
				</a>
			`)
		})
	})
}

// List commands of a specific language
function listCommands(language) {

	// Close the search bar (if open)
	toggleSearchBar("close");

	// Empty the content of the all the lists
	$("#viewList, #viewCard, #accordionList").html("");

	// Get all data from the selected language YML file
	$.get(`yml/${language}.yml`, function(data) {
		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);
		// For each item in the YAML data...
		$.each(yamlData, function(i) {
			// Append the following code on the accordion list
			$("#accordionList").append(`
				<div class="panel panel-default animated fadeIn">
					<div class="panel-heading waves-effect">
						<a class="toggle-link" aria-expanded="false">
							<h4 class="panel-title active">${yamlData[i].nome}</h4>
							<code class="panel-subtitle">${yamlData[i].exemplo}</code>
							<i class="material-icons accordion-toggle-icon">arrow_downward</i>
						</a>
					</div>
					<div class="content-collapse collapsed" aria-expanded="false">
						<div class="panel-body">
							<p>${html2md.makeHtml(yamlData[i].descricao)}</p>
						</div>
					</div>
				</div>
			`)
		})

		// Highlight all the code blocks
		$("pre code").each(function(i, block) {
			hljs.highlightBlock(block);
		});

		toggleAccordion();

	})
}

function changeViewMode() {
	switch (localStorage.getItem("viewMode")) {
		// Set viewMode to list
		case "list":
			localStorage.setItem("viewMode", "card");
			listLanguagesOnPage();
			$("#changeViewBtn").html(`
				<i class="mdc-list-item__graphic material-icons">view_list</i>
				Visualizar em lista
			`);
		break;

		// Set viewMode to card
		case "card":
			localStorage.setItem("viewMode", "list");
			listLanguagesOnPage();
			$("#changeViewBtn").html(`
				<i class="mdc-list-item__graphic material-icons">view_modules</i>
				Visualizar em card
			`);
		break;
	}
}

// Displays the "about" dialog
function aboutDialog() {
	$("body").append(`
		<div id="aboutDialog" class="mdc-dialog" role="alertdialog">
			<div class="mdc-dialog__container">
				<div class="mdc-dialog__surface">

					<h2 class="mdc-dialog__title" id="my-dialog-title">Sobre o code101</h2>

					<div id="mdc-dialog-body" class="mdc-dialog__content">
						Plataforma desenvolvida com o objetivo de facilitar a busca por comandos de linguagens de programação.<br><br>
						<a href="https://github.com/henriquehbr/code101" target="_blank"><i class="fab fa-github"></i> Visitar repositório no Github</a><br>
						<a href="https://instagram.com/code101.com.br" target="_blank"><i class="fab fa-instagram"></i> Visitar página no Instagram</a>
					</div>

					<footer class="mdc-dialog__actions">
						<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">OK</button>
					</footer>

				</div>
			</div>
			<div class="mdc-dialog__scrim"></div>
		</div>
	`);

	var dialog = new mdc.dialog.MDCDialog(document.querySelector("#aboutDialog"));
	dialog.open();
}

// Displays the "suggestCommands" dialog
function suggestCommandsDialog() {
	$("body").append(`
		<div id="suggestCommandsDialog" class="mdc-dialog" role="alertdialog">
			<div class="mdc-dialog__container">
				<div class="mdc-dialog__surface">

					<h2 class="mdc-dialog__title" id="my-dialog-title">Sobre o code101</h2>

					<div id="mdc-dialog-body" class="mdc-dialog__content">
						<form id="suggestCommandsForm" action="https://us-central1-code101-b884a.cloudfunctions.net/enviarEmail" method="post">
							<input class="w3-input w3-border w3-round w3-margin-bottom" name="commandName" type="text" placeholder="Nome do comando">
							<input class="w3-input w3-border w3-round w3-margin-bottom" name="userEmail" type="email" placeholder="Seu email">
							<input class="w3-input w3-border w3-round w3-margin-bottom" name="langSelect" placeholder="Linguagem do comando"></input>
							<textarea name="commandDescription" class="w3-input w3-border w3-round w3-margin-bottom" placeholder="Fale sobre o comando"></textarea>
						</form>
					</div>

					<footer class="mdc-dialog__actions">
						<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">Cancelar</button>
						<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">OK</button>
					</footer>

				</div>
			</div>
			<div class="mdc-dialog__scrim"></div>
		</div>
	`);

	var dialog = new mdc.dialog.MDCDialog(document.querySelector("#suggestCommandsDialog"));
	dialog.open();

	// Triggered when any input value on form is changed
	$("#suggestCommandsForm > :input").on("keyup change", function() {

		// Remove spaces from input value
		var emptyFields = $("#suggestCommandsForm :input").filter(function() {
			return $.trim(this.value) === "";
		});

		// If all inputs are filled
		if (!emptyFields.length) {
			// Enabled the form submit button
			$("#btnDialogOK").removeAttr("disabled");
		// If any input is empty
		} else {
			// Disable the form submit button
			$("#btnDialogOK").attr("disabled", "disabled");
		}
	});

	// When "OK" button is clicked...
	$("#btnDialogOK").click(function() {
		var suggestCommandsFormData = $("#suggestCommandsForm").serialize();
		$.ajax({
			type: "post",
			url: "https://us-central1-code101-b884a.cloudfunctions.net/enviarEmail",
			data: suggestCommandsFormData,
		});
		showSnackBar("Sua sugestão foi enviada com sucesso!", "OK", 3000);
	})

	// When "Cancel" button is clicked...
	$("#btnDialogCancel").click(function() {
		// Clear all inputs and close dialog
		$("#suggestCommandsForm").trigger("reset");
	});
}

function showSnackBar(message, actionText, timeout, actionHandler) {
	$("#pageContent").append(`
		<div class="mdc-snackbar mdc-snackbar--align-start" aria-live="assertive" aria-atomic="true" aria-hidden="true">
			<div class="mdc-snackbar__text"></div>
			<div class="mdc-snackbar__action-wrapper">
				<button type="button" class="mdc-snackbar__action-button"></button>
			</div>
		</div>
	`);
	const snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector(".mdc-snackbar"));
	const dataObj = {
		message: message,
		actionText: actionText,
		timeout: timeout,
		actionHandler: actionHandler
	};

	snackbar.show(dataObj);	
}

listLanguagesOnPage();
listLanguagesOnDrawer();