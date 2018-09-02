var drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-drawer--temporary"));

var menuEl = document.querySelector(".mdc-menu");
var menu = new mdc.menu.MDCMenu(menuEl);

menuEl.addEventListener('MDCMenu:selected', function(evt) {
	var detail = evt.detail;
});

// action --> open/close/search
function toggleSearchBar(action) {

	switch (action) {
		case "open":

			// Reset both search bar animations
			$("#searchBarExpanded, #searchBarCollapsed").removeClass("animated fadeIn fadeOut");

			// Hide the collapsed search bar
			$("#searchBarCollapsed").addClass("animated fadeOut");
			$("#searchBarCollapsed").css("display", "none");
			
			// Show the expanded search bar
			$("#searchBarExpanded").addClass("animated fadeIn");
			$("#searchBarExpanded").css("display", "block");
		break;

		case "close":

			// Press key after search bar is close, to reset search results to default state
			var keyup = jQuery.Event("keyup");
			keyup.which = keyup.keyCode = 8;

			// Reset both search bar animations
			$("#searchBarExpanded, #searchBarCollapsed").removeClass("animated fadeIn fadeOut");

			// Hide the expanded search bar
			$("#searchBarExpanded").addClass("animated fadeOut");
			$("#searchBarExpanded").css("display", "none");
			$("#searchBarExpanded #searchInput").val("").trigger(keyup);

			// Show the colapsed search bar
			$("#searchBarCollapsed").addClass("animated fadeIn");
			$("#searchBarCollapsed").css("display", "flex");
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

var html2md = new showdown.Converter();
viewMode = "card";

// List all the programming languages on the page
function listLanguagesOnPage(viewMode) {

	// Empty the content of the all the lists
	$("#view-list, #view-card, #accordionList").html("");

	// Request the file languages.yaml
	$.get("yml/languages.yml", function(data) {
		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);

		switch (viewMode) {
			case "list":

				// Turn card view invisible
				$("#view-card").css("display", "none");

				// Initialize the search input on the list view
				$('#searchInput').hideseek({
					list: "#view-list",
					nodata: "Nenhum resultado encontrado!"
				});

				// For each item in languages.yaml...
				$.each(yamlData, function(i) {
					// Append the language on the language list
					$("#view-list").append(`
						<li onclick="listCommands('${yamlData[i].nome.toLowerCase()}')" class="mdc-list-item animated fadeIn">
							<img src="${yamlData[i].icone}" class="mdc-list-item__graphic" alt="${yamlData[i].nome}">
							<span class="mdc-list-item__text">
								${yamlData[i].nome}
								<span class="mdc-list-item__secondary-text">
									${yamlData[i].descricao}
								</span>
							</span>
						</li>
					`)
				})
				break;

			case "card":

				// Turn card view visible
				$("#view-card").css("display", "grid");

				// Initialize the search input on the card view
				$('#searchInput').hideseek({
					list: "#view-card",
					nodata: "Nenhum resultado encontrado!"
				});

				// For each item in languages.yaml...
				$.each(yamlData, function(i) {
					// Append the language on the language list
					$("#view-card").append(`
						<div class="mdc-layout-grid__cell animated fadeIn">
							<div class="mdc-card">
								<div onclick="listCommands('${yamlData[i].nome.toLowerCase()}')" class="mdc-card__primary-action">
									<div style="background-image: url(${yamlData[i].icone});" class="mdc-card__media mdc-card__media--16-9"></div>
									<div class="mdc-card-content">
										<h2 class="mdc-typography--headline6">${yamlData[i].nome}</h2>
										<h3 class="mdc-typography--body2">${yamlData[i].descricao}</h3>
									</div>
								</div>
							</div>
						</div>
					`)
				})
				break;
		}
	})
}

function listLanguagesOnDrawer() {

	// Empty the previous content of the language list
	$("#languagesDrawer").html("");

	// Appends the "Home" item to the drawer
	$("#languagesDrawer").append(`
		<a onclick="listLanguagesOnPage('${viewMode}'); drawer.open = false" class="mdc-list-item">
			<i class="mdc-list-item__graphic material-icons">home</i>
			Página inicial
		</a>
		<hr class="mdc-list-divider">
	`);

	// Request the file languages.yaml
	$.get("yml/languages.yml", function(data) {
		// Convert the file data from YAML into JSON
		var yamlData = jsyaml.load(data);
		// For each item in languages.yaml...
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

	// Empty the content of the all the lists
	$("#view-list, #view-card, #accordionList").html("");

	// Initialize the search input on the list view
	$('#searchInput').hideseek({
		list: "#accordionList",
		nodata: "Nenhum resultado encontrado!"
	});

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
	switch (viewMode) {
		case "list":
			viewMode = "card";
			listLanguagesOnPage(viewMode);
			$("#changeview-btn").html(`
				<i class="mdc-list-item__graphic material-icons">view_list</i>
				Visualizar em lista
			`);
			break;

		case "card":
			viewMode = "list";
			listLanguagesOnPage(viewMode);
			$("#changeview-btn").html(`
				<i class="mdc-list-item__graphic material-icons">view_modules</i>
				Visualizar em card
			`);
			break;
	}
}

// Displays the "about" dialog
function aboutDialog() {
	$("body").append(`
		<aside id="aboutDialog"
			class="mdc-dialog"
			role="alertdialog"
			aria-labelledby="dialog-title"
			aria-describedby="mdc-dialog-description">
			<div class="mdc-dialog__surface">

				<header class="mdc-dialog__header">
					<h2 id="dialog-title" class="mdc-dialog__header__title">
						Sobre o code101
					</h2>
				</header>

				<section id="mdc-dialog-description" class="mdc-dialog__body">
					Plataforma desenvolvida com o objetivo de facilitar a busca por comandos de linguagens de programação.<br><br>

					<a href="https://github.com/henriquehbr/code101" target="_blank">Visitar repositório no Github</a>
				</section>

				<footer class="mdc-dialog__footer">
					<button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">OK</button>
				</footer>

			</div>
			<div class="mdc-dialog__backdrop"></div>
		</aside>
	`);
	var dialog = new mdc.dialog.MDCDialog(document.querySelector("#aboutDialog"));
	dialog.show();
}

listLanguagesOnPage(viewMode);
listLanguagesOnDrawer();