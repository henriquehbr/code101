// Cache-first network
var CACHE = "code101-cache";
var precacheFiles = [
	/* Files to be cached */
	"/",

	// CSS
	"https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/themes/white/pace-theme-flash.min.css",
	"https://cdn.jsdelivr.net/npm/material-components-web@0.40.1/dist/material-components-web.min.css",
	"https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
	"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css",
	"css/w3.css",
	"css/code101.css",

	// JS
	"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/pace.min.js",
	"https://cdn.jsdelivr.net/npm/material-components-web@0.40.1/dist/material-components-web.min.js",
	"https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.12.0/js-yaml.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/velocity/1.5.0/velocity.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/velocity/1.5.0/velocity.ui.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js",
	"js/code101.js",

	// RESOURCES (ASSETS)
	"assets/lang-icons/c.svg",
	"assets/lang-icons/html.svg",
	"assets/lang-icons/java.svg",
	"assets/lang-icons/javascript.svg",
	"assets/lang-icons/python.svg",
	"assets/lang-icons/ruby.svg",
	"https://fonts.googleapis.com/css?family=Roboto:300,400,500",
	"https://fonts.googleapis.com/css?family=Press+Start+2P",
	"https://fonts.googleapis.com/icon?family=Material+Icons",
	"https://use.fontawesome.com/releases/v5.4.1/css/all.css",

	// YML
	"yml/c.yml",
	"yml/html.yml",
	"yml/java.yml",
	"yml/javascript.yml",
	"yml/languages.yml",
	"yml/ruby.yml",

	// HTML
	"index.html",

	// MANIFEST
	"manifest.json"
];

// Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function(evt) {
	console.log("Instalando Service Worker...");
	evt.waitUntil(precache().then(function() {
		console.log("Instalação realizada!");
		return self.skipWaiting();
	}));
});


// Allow sw to control of current page
self.addEventListener('activate', function(event) {
	console.log("Ativando o Service Worker...");
	return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
	console.log("O Service Worker está solicitando o arquivo: " + evt.request.url);
	evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
	evt.waitUntil(update(evt.request));
});


function precache() {
	return caches.open(CACHE).then(function(cache) {
		return cache.addAll(precacheFiles);
	});
}

function fromCache(request) {
	// Pull files from the cache first thing so we can show them fast
	return caches.open(CACHE).then(function(cache) {
		return cache.match(request).then(function(matching) {
			return matching || Promise.reject('no-match');
		});
	});
}

function update(request) {
	// Call the server to get the newest version of the file to use the next time we show view
	return caches.open(CACHE).then(function(cache) {
		return fetch(request).then(function(response) {
			return cache.put(request, response);
		});
	});
}

function fromServer(request) {
	// This is the fallback if it is not in the cache to go to the server and get it
	return fetch(request).then(function(response) {
		return response
	})

	.catch(function(err) {
		console.log("Sem conexão - não foi possivel obter os arquivos do servidor!");
	});
}