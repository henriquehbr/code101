/* ########## VARIABLES ########## */
drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));
convertHtmlToMarkdown = new showdown.Converter();
viewMode = "cards";
searchBarEnabled = false;

// Enable mouse/touch interactions after page load
$(document).ready(() => {
	$("body").css("pointer-events", "all");
});

// Init all MDC elements preventing log warnings about already-initialized elements
function initMDCElements() {
	window.mdc.autoInit(document, () => {});
}

function toggleSearchBar(action) {
	switch (action) {
		case "open":
			// Indicate the state of the search bar (enabled)
			searchBarEnabled = true;

			// Clear the top app bar content
			$("#topAppBar .mdc-top-app-bar__row").html("");

			// Change the top app bar background color to white
			$("#topAppBar").css("background-color", "white");

			// Append the search bar to the top app bar
			$("#topAppBar .mdc-top-app-bar__row").append(`
				<input id="searchInput" type="search" autocomplete="off" class="w3-input w3-border-0 animated fadeIn" placeholder="Sobre o que você quer aprender?" style="padding-left: 16px;">
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end animated fadeIn" role="toolbar">
					<i class="material-icons material-icons-dark mdc-top-app-bar__action-item" aria-label="Pesquisar" alt="Pesquisar" onclick="toggleSearchBar('close')">close</i>
					<div class="mdc-line-ripple"></div>
				</section>
			`);

			// Event triggered when something is typed on the search input
			$("#searchInput").on("keyup", function() {
				// Search on languages
				if (viewMode == "cards") {
					var value = $("#searchInput").val().toLowerCase();
					$("#viewCard span.mdc-typography--headline6").filter(function() {
						$(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
					});

					// Organize slider items
					$.each($("#viewCard .card-body"), function(i) {
						$(this).flickity("reposition");
					});

					// For each category card...
					$.each($("#viewCard .flickity-slider"), function(i) {

						// Reset the category card visibility state
						$("#viewCard .card-body").eq(i).css("display", "block");

						// If nothing was found, display a "not found" message
						if ($(this).children(":visible").length == 0) {
							$("#viewCard .card-body").eq(i).css("display", "none");
							$("#viewCard .card-title .mdc-typography--body2").eq(i).css("display", "block");
						} else {
							$("#viewCard .card-body").eq(i).css("display", "block");
							$("#viewCard .card-title .mdc-typography--body2").eq(i).css("display", "none");
						}
					});

				} else if (viewMode == "accordions") {
					// Search on commands
					var value = $("#searchInput").val().toLowerCase();
					$("#accordionList h4.panel-title").filter(function() {
						$(this).parent().parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
					});
				}
			});

			// Focus on the search input
			$("#searchInput").focus();
			break;

		case "close":
			// Indicate the state of the search bar (disabled)
			searchBarEnabled = false;

			/* Programmatically press key after search bar is closed
			in order to reset search results to the default state */
			var keyup = jQuery.Event("keyup");
			keyup.which = keyup.keyCode = 8;

			// Clear the search bar text and reset the search results
			$("#searchInput").val("").trigger(keyup);

			// Clear the top app bar content
			$("#topAppBar .mdc-top-app-bar__row").html("");

			// Change the top app bar background color to blue
			$("#topAppBar").css("background-color", "#6200ee");

			$("#topAppBar .mdc-top-app-bar__row").append(`
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
					<a onclick="drawer.open = !drawer.open" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
					<span class="mdc-top-app-bar__title code101-logo">code101</span>
				</section>
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
					<i class="material-icons mdc-top-app-bar__action-item" aria-label="Pesquisar" alt="Pesquisar" onclick="toggleSearchBar('open')">search</i>
				</section>
			`);
			break;
	}
}

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
}

// List all the programming languages on the page
function displayLanguagesOnPage() {

	// Tell the input to search on the cards
	viewMode = "cards";

	// Change the page title to "code101"
	document.title = `code101`;

	// Close the drawer
	drawer.open = false;

	// Empty the content of the all the lists
	$("#viewCard, #accordionList").html("");

	// Request the file languages.yml
	$.get("yml/languages.yml", function(data) {

		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);

		// For each category in languages.yml...
		$.each(yamlData, function(i) {

			// Append the category card
			$("#viewCard").append(`
				<div class="mdc-card w3-margin-bottom">
					<div class="mdc-card__primary-action">
						<div style="padding:16px;display:flex" class="card-header">
							<div class="card-title">
								<h2 style="margin:0" class="mdc-typography--headline6">${this.category_name}</h2>
								<h2 style="margin:0;display:none" class="mdc-typography--body2">Nenhum resultado encontrado!</h2>
							</div>
						</div>
					</div>
					<div id="${this.category_id}" class="card-body mdc-typography--body2"></div>
				</div>
			`);

			// Append the elements on the category card
			$.each(yamlData[i].category_elements, function(index) {
				$(`#${yamlData[i].category_id}`).append(`
					<a onclick="displayCommandsOnPage('${this.nome.toLowerCase()}')" style="display: flex" class="miniCard carousel-cell animated fadeIn">
						<img alt="${this.nome}" src="${this.icone}">
						<span class="mdc-typography--headline6">${this.nome}</span>
					</a>
				`);
			});

		});

		// For each cateogry card
		$.each(yamlData, function(i) {

			// Enable flickity on the category card
			$(`#${this.category_id}`).flickity({
				pageDots: false,
				freeScroll: true,
				cellAlign: "left"
			});
		});

	});
}

// List commands of a specific language
function displayCommandsOnPage(language) {

	// Tell the input to search on the accordions
	viewMode = "accordions";

	// Close the search bar (if open)
	if (searchBarEnabled == true) {
		toggleSearchBar("close");
	}

	// Empty the content of the all the lists
	$("#viewCard, #accordionList").html("");

	// Get all data from all the languages
	$.get("yml/languages.yml", function(data) {

		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);

		// Loop that repeat for each existent language category
		$.each(yamlData, function(i) {
			// Loop that repeat for each existent language in a specific category
			$.each(this.category_elements, function(i2) {
				// If the actual language name == the selected language name
				if (this.nome.toLowerCase() == language) {
					$("#accordionList").append(`
						<div class="panel panel-default animated fadeIn">
							<div class="panel-heading waves-effect">
								<a class="toggle-link" aria-expanded="false">
									<h4 class="panel-title active">${this.nome}</h4>
									<code class="panel-subtitle">Veja mais informações sobre ${this.nome}</code>
									<i class="material-icons accordion-toggle-icon">arrow_downward</i>
								</a>
							</div>
							<div class="content-collapse collapsed" aria-expanded="false">
								<div class="panel-body">
									<img style="width:8.5rem;float:right" src="${this.icone}" alt="${this.nome}-logo">
									<p>${this.descricao}</p>
									<p class="mdc-typography--body2">
										Criado por ${this.criador}<br>
										Lançada em ${this.data_de_criacao}
									</p>
								</div>
							</div>
						</div>
						<hr>
					`);
				}
			});
		});
	});

	// Get all data from the selected language
	$.get(`yml/${language}.yml`, function(data) {

		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);

		// Change the page title to "code101 | LanguageName"
		document.title = `code101 | ${language.charAt(0).toUpperCase() + language.slice(1)}`;

		// For each item in the YAML data...
		$.each(yamlData, function(i) {
			// Append the following code on the accordion list
			$("#accordionList").append(`
				<div class="panel panel-default animated fadeIn">
					<div class="panel-heading waves-effect">
						<a class="toggle-link" aria-expanded="false">
							<h4 class="panel-title active">${this.nome}</h4>
							<code class="panel-subtitle">${this.exemplo}</code>
							<i class="material-icons accordion-toggle-icon">arrow_downward</i>
						</a>
					</div>
					<div class="content-collapse collapsed" aria-expanded="false">
						<div class="panel-body">
							<p>${convertHtmlToMarkdown.makeHtml(this.descricao)}</p>
						</div>
					</div>
				</div>
			`);
		});

		// Highlight all the code blocks
		$("pre code").each(function(i, block) {
			hljs.highlightBlock(block);
		});

		toggleAccordion();

	});
}

// Displays the "about" dialog
function displayAboutDialog() {
	displayDialog("aboutDialog", "Sobre o code101", `
		code101 é uma aplicação web progressiva desenvolvida para a 1º Mostra Ciêntifica do IFTO Campus Palmas com o objetivo de facilitar a busca por comandos de diversas linguagens de programação.<br><br>
		<a href="https://github.com/henriquehbr/code101" target="_blank">
			<i class="fab fa-github"></i>
			<span class="mdc-list-item__text">Visitar repositório no Github</span>
		</a>
		<br>
		<a href="https://instagram.com/code101.com.br" target="_blank">
			<i class="fab fa-instagram"></i>
			<span class="mdc-list-item__text">Visitar página no Instagram</span>
		</a>
		<br>
		<a href="../assets/privacy_policies.html" target="_blank">
			<i class="fas fa-bullhorn"></i>
			<span class="mdc-list-item__text">Ver as Politicas de Privacidade</span>
		</a>
	`, `
		<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">OK</button>
	`, true);
}

// Displays the "suggestCommands" dialog
function displaySuggestCommandsDialog() {
	displayDialog("suggestCommandsDialog", "Ajude esse projeto a ficar ainda maior, sugira um comando", `
		<form id="suggestCommandsForm">

			<div class="mdc-text-field mdc-text-field--outlined w3-margin-top" data-mdc-auto-init="MDCTextField">
				<input type="text" name="commandName" autocomplete="off" class="mdc-text-field__input">
				<label class="mdc-floating-label">Nome do comando</label>
				<div class="mdc-notched-outline">
					<svg>
						<path class="mdc-notched-outline__path" />
					</svg>
				</div>
				<div class="mdc-notched-outline__idle"></div>
			</div>

			<div class="mdc-text-field mdc-text-field--outlined w3-margin-top" data-mdc-auto-init="MDCTextField">
				<input type="email" name="userEmail" autocomplete="off" class="mdc-text-field__input">
				<label class="mdc-floating-label">Seu email</label>
				<div class="mdc-notched-outline">
					<svg>
						<path class="mdc-notched-outline__path" />
					</svg>
				</div>
				<div class="mdc-notched-outline__idle"></div>
			</div>

			<div class="mdc-text-field mdc-text-field--outlined w3-margin-top" data-mdc-auto-init="MDCTextField">
				<input type="text" name="langSelect" autocomplete="off" class="mdc-text-field__input">
				<label class="mdc-floating-label">Linguagem do comando</label>
				<div class="mdc-notched-outline">
					<svg>
						<path class="mdc-notched-outline__path" />
					</svg>
				</div>
				<div class="mdc-notched-outline__idle"></div>
			</div>

			<div class="mdc-text-field mdc-text-field--textarea w3-margin-top" data-mdc-auto-init="MDCTextField">
				<textarea name="commandDescription" autocomplete="off" class="mdc-text-field__input"></textarea>
				<label class="mdc-floating-label">Fale sobre o comando</label>
			</div>

		</form>
	`, `
		<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">Cancelar</button>
		<button id="btnDialogOK" disabled="disabled" type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">OK</button>
	`, true);

	validateForm("suggestCommandsForm", "btnDialogOK");

	// When "OK" button is clicked...
	$("#btnDialogOK").click(function() {

		// Send the suggestion data to Firebase Cloud Functions
		$.ajax({
			type: "post",
			url: "https://us-central1-code101-b884a.cloudfunctions.net/registerSuggestion",
			data: $("#suggestCommandsForm").serialize(),
		});

		$("#suggestCommandsDialog").remove();
		showSnackBar("Sua sugestão foi enviada com sucesso!");
	});
}

// Generate a MDC dialog with the given arguments
function displayDialog(dialogId, dialogTitle, dialogContent, dialogButtons, closeDrawer) {

	// If the drawer need to be closed...
	if (closeDrawer == true) {
		// Close the drawer
		drawer.open = false;
	}

	$("body").append(`
		<div id="${dialogId}" class="mdc-dialog" role="alertdialog">
			<div class="mdc-dialog__container">
				<div class="mdc-dialog__surface">

					<h2 class="mdc-dialog__title">${dialogTitle}</h2>

					<div class="mdc-dialog__content">
						${dialogContent}
					</div>

					<footer class="mdc-dialog__actions">
						${dialogButtons}
					</footer>

				</div>
			</div>
			<div class="mdc-dialog__scrim"></div>
		</div>
	`);

	initMDCElements();

	dialog = new mdc.dialog.MDCDialog(document.querySelector(`#${dialogId}`));
	dialog.open();

	// Event triggered when the dialog is closed
	$(`#${dialogId}`).on("MDCDialog:closed", function() {
		$(`#${dialogId}`).remove();
	});
}

// Verify if form inputs are filled and valid
function validateForm(formId, submitButton) {
	// Triggered when any input value on the form is changed
	$(`#${formId} :input`).on("keyup change blur", function() {

		// Remove spaces from input value
		var emptyFields = $(`#${formId} :input`).filter(function() {
			return $.trim(this.value) === "";
		});

		// If all inputs are filled, valid, and checked
		if (!emptyFields.length &&
			$(".mdc-text-field--invalid").length < 1 &&
			$("input[type='checkbox']:checked").length == $("input[type='checkbox']").length) {
			// Enabled the form submit button
			$(`#${submitButton}`).removeAttr("disabled");
		} else {
			// If any input is empty, disable the form submit button
			$(`#${submitButton}`).attr("disabled", "disabled");
		}
	});
}

function showSnackBar(message) {
	$("body").append(`
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
		actionText: "OK",
		timeout: 3000
	};

	snackbar.show(dataObj);

	// Event triggered when the snackbar hides
	$(".mdc-snackbar").on("MDCSnackbar:hide", function() {
		$(".mdc-snackbar").remove();
	})
}

displayLanguagesOnPage();