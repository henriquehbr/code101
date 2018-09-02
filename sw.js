// Cache-first network
var CACHE = "code101-cache";
var precacheFiles = [
	/* Files to be cached */
	"/",

	// CSS
	"css/css-megapack.css",
	"css/code101.css",

	// JS
	"js/js-megapack.js",
	"js/code101.js",

	// RESOURCES (RES)
	"res/lang-icons/c.png",
	"res/lang-icons/js.png",
	"res/PressStart2P.ttf",

	// YML
	"yml/c.yml",
	"yml/javascript.yml",
	"yml/languages.yml",

	// HTML
	"index.html"
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