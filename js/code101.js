// Material components

let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-drawer--temporary"));
document.querySelector("#drawer-btn").addEventListener('click', () => drawer.open = true);

// Instantiation
var menuEl = document.querySelector(".mdc-menu");
var menu = new mdc.menu.MDCMenu(menuEl);
var menuButtonEl = document.querySelector('#menu-btn');

// Toggle menu open
menuButtonEl.addEventListener('click', function() {
	menu.open = !menu.open;
});

// Listen for selected item
menuEl.addEventListener('MDCMenu:selected', function(evt) {
	var detail = evt.detail;
});

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

	// Empty the content of the language list
	$("#languagesList").html("");

	// Empty the content of the accordion list
	$("#accordionList").html("");

	// Remove the search input from the language list
	$("#searchInputDiv").remove();

	// Appends the search input to the page
	$("#pageContent").prepend(`
		<div id="searchInputDiv" class="mdc-text-field mdc-text-field--fullwidth">
			<input
				type="text"
				id="searchInput"
				class="mdc-text-field__input"
				placeholder="Pesquisar"
				aria-label="Pesquisar"
				data-toggle="hideseek"
				data-list="#languagesList"
			/>
		</div>
	`);

	// Initialize the search input
	$("#searchInput").hideseek({
		nodata: "Sem resultados!"
	});

	// Get all data from languages.json
	$.getJSON("json/languages.json", function(data) {
		// For each item in the languages.json...
		$.each(data, function(i) {
			// Append the following code on the language list
			$("#languagesList").append(`
				<li onclick="listCommands('${data[i].nome.toLowerCase()}')" class="mdc-list-item">
					<img src="${data[i].icone}" class="mdc-list-item__graphic"></img>
					<span class="mdc-list-item__text">
						${data[i].nome}
						<span class="mdc-list-item__secondary-text">
							${data[i].descricao}
						</span>
					</span>
				</li>
			`)
		})
	})
}

function listLanguagesOnDrawer() {

	// Empty the previous content of the language list
	$("#languagesDrawer").html("");

	// Appends the "Home" item to the drawer
	$("#languagesDrawer").append(`
		<a onclick="listLanguagesOnPage(); drawer.open = false" class="mdc-list-item">
			<i class="mdc-list-item__graphic material-icons">home</i>
			Página inicial
		</a>
		<hr class="mdc-list-divider">
	`);

	// Get all data from languages.json
	$.getJSON("json/languages.json", function(data) {
		// For each item in the languages.json...
		$.each(data, function(i) {
			// Appends the following code to the drawer
			$("#languagesDrawer").append(`
				<a onclick="listCommands('${data[i].nome.toLowerCase()}'); drawer.open = false" class="mdc-list-item mdc-list-item">
					<img class="mdc-list-item__graphic" src="${data[i].icone}">
					${data[i].nome}
				</a>
			`)
		})
	})
}

// List commands of a specific language
function listCommands(language) {

	// Empty the content of the language list
	$("#languagesList").html("");

	// Empty the content of the accordion list
	$("#accordionList").html("");

	// Remove the search input from the language list
	$("#searchInputDiv").remove();

	// Appends the search input to the page
	$("#pageContent").prepend(`
		<div id="searchInputDiv" class="mdc-text-field mdc-text-field--fullwidth">
			<input
				type="text"
				id="searchInput"
				class="mdc-text-field__input"
				placeholder="Pesquisar"
				aria-label="Pesquisar"
				data-toggle="hideseek"
				data-list="#accordionList"
			/>
		</div>
	`);

	// Initialize the search input
	$("#searchInput").hideseek({
		nodata: "Sem resultados!"
	});

	// Get all data from the selected language JSON
	$.getJSON(`json/c.json`, function(data) {
		// For each item in the JSON...
		$.each(data, function(i) {
			// Append the following code on the accordion list
			$("#accordionList").append(`
				<div class="panel panel-default">
					<div class="panel-heading waves-effect">
						<a class="toggle-link" aria-expanded="false">
							<h4 class="panel-title active">${data[i].nome}</h4>
							<span class="panel-subtitle">${data[i].exemplo}</span>
							<i class="material-icons accordion-toggle-icon">arrow_downward</i>
						</a>
					</div>
					<div class="content-collapse collapsed" aria-expanded="false">
						<div class="panel-body">
							<p>
								${data[i].descricao}
							</p>
						</div>
					</div>
				</div>
			`)
		})

		toggleAccordion();

	})
}

// Displays the "about" dialog
function aboutDialog() {
	var dialog = new mdc.dialog.MDCDialog(document.querySelector("#aboutDialog"));
	dialog.show();
}

listLanguagesOnPage();
listLanguagesOnDrawer();