const currentCache = "send-hug-v2";
const serverUrl = "localhost:5000";

// upon installing a new service worker
self.addEventListener("install", function(event) {
	event.waitUntil(
		// open the cache
		caches.open(currentCache).then(function(cache) {
			// cache static assets
			let toCache = [
				'/index.html',
				'/css/styles.css',
				'/app/aboutApp.component.html',
				'/app/adminDashboard.component.html',
				'/app/app.component.html',
				'/app/errorPage.component.html',
				'/app/fullList.component.html',
				'/app/loader.component.html',
				'/app/mainPage.component.html',
				'/app/messages.component.html',
				'/app/myPosts.component.html',
				'/app/newItem.component.html',
				'/app/popUp.component.html',
				'/app/reports.component.html',
				'/app/searchResults.component.html',
				'/app/userPage.component.html',
				'/app.bundle.js'
			]
			
			// add all assets to cache
			cache.addAll(toCache);
			
		// in case there's an error
		}).catch(function(err) {
			console.log(err);
		})
	)
});

// fetch event listener
self.addEventListener("fetch", function(event) {
	let fetchTarget = event.request.url;
	let urlToFetch;
	
	//if the request is for a browser-sync component, skip checking the cache
	if(fetchTarget.includes("browser-sync")) {
		return;
	}
	
	if(fetchTarget.pathname == '/') {
		urlToFetch = '/index.html';
	}
	else {
		urlToFetch = fetchTarget;
	}
	
	event.respondWith(
		// find the target in the cache
		caches.match(fetchTarget).then(function(response) {
			// if the target exists in the cache, return it
			if(response) {
				//fetches the url from the server and checks whether it was
					//updated after it was cached. If it was, replaces the URL in
					//the cache with the newly fetched one
					fetch(urlToFetch, {headers: event.request.headers}).then(function(fetchResponse) {
						//checks the "last modified" date for both the cached and the
						//fetched urls
						let fetchedDate = fetchResponse.headers.get("Last-Modified");
						let cachedDate = response.headers.get("Last-Modified");
						let fetchedDateSec = new Date(fetchedDate);
						let cachedDateSec = new Date(cachedDate);
						
						//if the asset isn't the dynamic JS file and it was changed since it was cached, replace the
						//cached asset with the new asset
						if(urlToFetch != '/app.bundle.js' && !fetchTarget.includes(serverUrl) && fetchedDateSec > cachedDateSec)
							caches.open(currentCache).then(function(cache) {
								cache.put(urlToFetch, fetchResponse);
							})
						//otherwise, if the asset IS the JS file, replace it anyway as it contains dynamic content
						// that may have been changed
						else if(urlToFetch == '/app.bundle.js' || fetchTarget.includes(serverUrl)) {
							caches.open(currentCache).then(function(cache) {
								cache.put(urlToFetch, fetchResponse);
							})
						}
					})
				
				return response;
			}
			// otherwise, go to the network and fetch it
			else {
				// fetch the asset
				fetch(fetchTarget, {headers: event.request.headers}).then(function(fetchRes) {
					// open the cache and add the asset
					caches.open(currentCache).then(function(cache) {
						cache.put(fetchTarget, fetchRes);
					})
				// if there's an error, alert the user
				}).catch(function(err) {
					console.log('Error: ' + err);
				})
				
				// return the fetch request in the meanwhile so that the user won't
				// have to wait
				return fetch(fetchTarget, {headers: event.request.headers});
			}
		})
	)
})