const currentCache = "send-hug-v7";
const serverUrl = "localhost:5000";

// upon installing a new service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    // open the cache
    caches
      .open(currentCache)
      .then(function (cache) {
        // cache static assets
        let toCache = [
          "/index.html",
          "/css/styles.css",
          "/app/aboutApp.component.html",
          "/app/adminDashboard.component.html",
          "/app/app.component.html",
          "/app/errorPage.component.html",
          "/app/fullList.component.html",
          "/app/loader.component.html",
          "/app/mainPage.component.html",
          "/app/messages.component.html",
          "/app/myPosts.component.html",
          "/app/newItem.component.html",
          "/app/popUp.component.html",
          "/app/reports.component.html",
          "/app/searchResults.component.html",
          "/app/userPage.component.html",
          "/app.bundle.js",
        ];

        // add all assets to cache
        cache.addAll(toCache);

        // cache icons
        let iconCache = [
          "/assets/img/admin.svg",
          "/assets/img/admin_active.svg",
          "/assets/img/admin_hover.svg",
          "/assets/img/home.svg",
          "/assets/img/home_active.svg",
          "/assets/img/home_hover.svg",
          "/assets/img/Logo.svg",
          "/assets/img/Logo_notifications.png",
          "/assets/img/post.svg",
          "/assets/img/post_active.svg",
          "/assets/img/post_hover.svg",
        ];

        // add all icons to cache
        cache.addAll(iconCache);

        // in case there's an error
      })
      .catch(function (err) {
        console.log(err);
      }),
  );
});

// upon activating a new service worker
self.addEventListener("activate", function (event) {
  event.waitUntil(
    // get all current caches
    caches.keys().then(function (cacheNames) {
      // filter out any non-app caches and the current cache
      cacheNames
        .filter(function (cacheName) {
          return cacheName.startsWith("send-hug") && cacheName != currentCache;
          //delete all unneeded caches
        })
        .map(function (cacheName) {
          return caches.delete(cacheName);
        });
    }),
  );
});

// fetch event listener
self.addEventListener("fetch", function (event) {
  let fetchTarget = event.request.url;
  let urlToFetch;

  //if the request is for a browser-sync component, skip checking the cache
  if (fetchTarget.includes("browser-sync")) {
    return;
  }

  // if the request is for the server and the user is online
  if (fetchTarget.includes(serverUrl) && navigator.onLine) {
    // if it's a POST request with PushSubscription data, save the info in cache
    if (event.request.method == "POST" && fetchTarget.includes("notifications")) {
      // fetch the asset
      fetch(fetchTarget, { headers: event.request.headers, method: "POST" })
        .then(function (fetchRes) {
          // open the cache and add the asset
          caches.open(currentCache).then(function (cache) {
            cache.put(fetchTarget, fetchRes);
          });
          // if there's an error, alert the user
        })
        .catch(function (err) {
          console.log("Error: " + err);
        });
    }
    // otherwise ignore it
    else {
      return;
    }
  }
  // if the request is for the server and the user is offline, alert them that they're offline so the server is unavailable
  else if (fetchTarget.includes(serverUrl) && !navigator.onLine) {
    return new Response("You are currently offline; try again when you're online.", {
      status: 503,
      statusText:
        "The server isn't available at the moment as you are currently offline. Try again when you're connected to the internet.",
    });
    // If the request is for the server, it's going to get cached by the SWManager
    // so we don't need to do anything
  } else if (fetchTarget.includes(serverUrl)) {
    return;
  }

  // if the request is a non-GET and the user is offline, return an error
  if (event.request.method != "GET" && !navigator.onLine) {
    return new Response("You are currently offline; try again when you're online.", {
      status: 503,
      statusText:
        "The server isn't available at the moment. Try again when you're connected to the internet.",
    });
  }
  // otherwise, just pass it on to the server as-is
  else if (event.request.method != "GET" && navigator.onLine) {
    return;
  }

  if (fetchTarget.pathname == "/") {
    urlToFetch = "/index.html";
  } else {
    urlToFetch = fetchTarget;
  }

  event.respondWith(
    // find the target in the cache
    caches.match(fetchTarget).then(function (response) {
      // if the target exists in the cache, return it
      if (response) {
        //fetches the url from the server and checks whether it was
        //updated after it was cached. If it was, replaces the URL in
        //the cache with the newly fetched one
        fetch(urlToFetch, { headers: event.request.headers })
          .then(function (fetchResponse) {
            //checks the "last modified" date for both the cached and the
            //fetched urls
            let fetchedDate = fetchResponse.headers.get("Last-Modified");
            let cachedDate = response.headers.get("Last-Modified");
            let fetchedDateSec = new Date(fetchedDate);
            let cachedDateSec = new Date(cachedDate);

            //if the asset isn't the dynamic JS file and it was changed since it was cached, replace the
            //cached asset with the new asset
            if (urlToFetch != "/app.bundle.js" && fetchedDateSec > cachedDateSec)
              caches.open(currentCache).then(function (cache) {
                cache.put(urlToFetch, fetchResponse);
              });
            //otherwise, if the asset IS the JS file, replace it anyway as it contains dynamic content
            // that may have been changed
            else if (urlToFetch == "/app.bundle.js") {
              caches.open(currentCache).then(function (cache) {
                cache.put(urlToFetch, fetchResponse);
              });
            }
          })
          .catch(function (err) {
            // if the user is offline, let them know that they're offline and that's the issue
            if (!navigator.onLine) {
              return new Response("You are currently offline; try again when you're online.", {
                status: 503,
                statusText:
                  "The server isn't available at the moment. Try again when you're connected to the internet.",
              });
            }
            // otherwise log the error
            else {
              console.log(err);
            }
          });

        // if the URL to fetch is not one of the static assets, return fetch request
        if (urlToFetch == "/app.bundle.js" || fetchTarget.includes(serverUrl)) {
          return fetch(urlToFetch, { headers: event.request.headers }).catch(function (err) {
            return response;
          });
        }
        // otherwise return the response from cache
        else {
          return response;
        }
      }
      // otherwise, go to the network and fetch it
      else {
        // fetch the asset
        fetch(fetchTarget, { headers: event.request.headers })
          .then(function (fetchRes) {
            // open the cache and add the asset
            caches.open(currentCache).then(function (cache) {
              cache.put(fetchTarget, fetchRes);
            });
            // if there's an error, alert the user
          })
          .catch(function (err) {
            console.log("Error: " + err);
          });

        // return the fetch request in the meanwhile so that the user won't
        // have to wait
        return fetch(fetchTarget, { headers: event.request.headers }).catch(function (err) {
          // if the user is offline, let them know that theyy're offline and that's the issue
          if (!navigator.onLine) {
            return new Response("You are currently offline; try again when you're online.", {
              status: 503,
              statusText:
                "The server isn't available at the moment. Try again when you're connected to the internet.",
            });
          }
          // otherwise log the error
          else {
            console.log(err);
          }
        });
      }
    }),
  );
});

// message event listener
self.addEventListener("message", function (event) {
  // if the action in the message is to skip waiting, do it
  if (event.data.action == "skip waiting") {
    self.skipWaiting();
  }
});

// push event listener
self.addEventListener("push", function (event) {
  pushData = event.data.json();

  event.waitUntil(
    // show the user the notification
    self.registration.showNotification(pushData.title, {
      body: pushData.body,
      icon: "/assets/img/Logo_notifications.png",
    }),
  );
});

// push subscription change
self.addEventListener("pushsubscriptionchange", (event) => {
  // get the clients using the service worker
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      // alert the client that it needs to resubscribe
      client.postMessage({ action: "resubscribe" });
    });
  });
});
