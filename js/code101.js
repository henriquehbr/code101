/* Variables
============================= */
drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));
html2md = new showdown.Converter();
viewMode = "cards";
searchBarEnabled = false;

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
				<input id="searchInput" type="search" oninput="searchCards()" autocomplete="off" class="w3-input w3-border-0 animated fadeIn search" placeholder="Sobre o que você quer aprender?" style="padding-left: 16px;">
				<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end animated fadeIn" role="toolbar">
					<i class="material-icons material-icons-dark mdc-top-app-bar__action-item" aria-label="Pesquisar" alt="Pesquisar" onclick="toggleSearchBar('close')">close</i>
					<div class="mdc-line-ripple"></div>
				</section>
			`);

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

			// Clear the search bar text
			$("#searchInput").val("").trigger(keyup);

			// Reset the search results before closing the search bar
			searchCards();

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
function listLanguagesOnPage() {

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
					<a style="display: flex" class="miniCard animated fadeIn">
						<img alt="${this.nome}" src="${this.icone}">
						<span class="mdc-typography--headline6">${this.nome}</span>
						<span class="mdc-typography--caption">${this.descricao}</span>
						<button onclick="listCommands('${this.nome.toLowerCase()}')" class="mdc-button" onclick="listCommands('${this.nome.toLowerCase()}')">
							Aprender
						</button>
					</a>
				`);
			});

		});

		// For each cateogry card
		$.each(yamlData, function(i) {

			// Disable slick on category card if it's enabled
			if ($(`#${this.category_id}`).hasClass("slick-initialized")) {
				$(`#${this.category_id}`).slick("unslick");
			}

			// Enable slick on the category card
			$(`#${this.category_id}`).slick({
				dots: false,
				arrows: false,
				infinite: false,
				speed: 1000,
				swipeToSlide: true,
				centerMode: false,
				variableWidth: true
			});
		});

	});
}

// List commands of a specific language
function listCommands(language) {

	// Tell the input to search on the accordions
	viewMode = "accordions";

	// Close the search bar (if open)
	if (searchBarEnabled == true) {
		toggleSearchBar("close");
	}

	// Empty the content of the all the lists
	$("#viewCard, #accordionList").html("");

	// Get all data from the selected language YML file
	$.get(`yml/${language}.yml`, function(data) {

		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);

		// Change the page title to "code101 | Language"
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
							<p>${html2md.makeHtml(this.descricao)}</p>
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
function aboutDialog() {

	// Close the drawer
	drawer.open = false;

	$("body").append(`
		<div id="aboutDialog" class="mdc-dialog" role="alertdialog">
			<div class="mdc-dialog__container">
				<div class="mdc-dialog__surface">

					<h2 class="mdc-dialog__title">Sobre o code101</h2>

					<div class="mdc-dialog__content">
						code101 é uma aplicação web progressiva desenvolvida com o objetivo de facilitar a busca por comandos de diversas linguagens de programação.<br><br>
						<a href="https://github.com/henriquehbr/code101" target="_blank">
							<i class="fab fa-github"></i> Visitar repositório no Github
						</a><br>
						<a href="https://instagram.com/code101.com.br" target="_blank">
							<i class="fab fa-instagram"></i> Visitar página no Instagram
						</a>
					</div>

					<footer class="mdc-dialog__actions">
						<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">OK</button>
					</footer>

				</div>
			</div>
			<div class="mdc-dialog__scrim"></div>
		</div>
	`);

	dialog = new mdc.dialog.MDCDialog(document.querySelector("#aboutDialog"));
	dialog.open();
}

// Displays the "suggestCommands" dialog
function suggestCommandsDialog() {

	// Close the drawer
	drawer.open = false;

	$("body").append(`
		<div id="suggestCommandsDialog" class="mdc-dialog" role="alertdialog">
			<div class="mdc-dialog__container">
				<div class="mdc-dialog__surface">

					<h2 class="mdc-dialog__title">Ajude esse projeto a ficar ainda maior, sugira um comando.</h2>

					<div class="mdc-dialog__content">
						<form id="suggestCommandsForm" action="https://us-central1-code101-b884a.cloudfunctions.net/enviarEmail" method="post">

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
					</div>

					<footer class="mdc-dialog__actions">
						<button id="btnDialogCancel" type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">Cancelar</button>
						<button id="btnDialogOK" type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">OK</button>
					</footer>

				</div>
			</div>
			<div class="mdc-dialog__scrim"></div>
		</div>
	`);

	/* Init MDC on all inputs in the suggest commands form
	And also prevent from logging warnings about already-initialized elements */
	window.mdc.autoInit(document, () => {});

	dialog = new mdc.dialog.MDCDialog(document.querySelector("#suggestCommandsDialog"));
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

		// Send the suggestion data to Firebase Cloud Functions
		$.ajax({
			type: "post",
			url: "https://us-central1-code101-b884a.cloudfunctions.net/enviarEmail",
			data: $("#suggestCommandsForm").serialize(),
			success: function() {
				showSnackBar("Sua sugestão foi enviada com sucesso!", "OK", 3000);
			}
		});

		$("#suggestCommandsDialog").remove();
	});

	// Event triggered when the dialog is closed
	$("#suggestCommandsDialog").on("MDCDialog:closed", function() {
		$("#suggestCommandsDialog").remove();
	});
}

function searchCards() {
	if (viewMode == "cards") {
		var value = $("#searchInput").val().toLowerCase();
		$("#viewCard span.mdc-typography--headline6").filter(function() {
			$(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});

		// If nothing was found, display a "not found" message
		$.each($("#viewCard .mdc-card .card-body .slick-track"), function(i) {
			if ($(this).children(":visible").length == 0) {
				$("#viewCard .card-title .mdc-typography--body2").eq(i).css("display", "block");
			} else {
				$("#viewCard .card-title .mdc-typography--body2").eq(i).css("display", "none");
			}
		});

	} else if (viewMode == "accordions") {
		var value = $("#searchInput").val().toLowerCase();
		$("#accordionList h4.panel-title").filter(function() {
			$(this).parent().parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	}
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