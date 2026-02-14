/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, prerendered, version } from "$service-worker";

const CACHE = `walink-${version}`;
const ASSETS = new Set([...build, ...files, ...prerendered]);
ASSETS.delete("/CNAME");

// ---- Install ----
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS.values())));
});

// ---- Activate ----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
  );
});

// ---- Fetch (stale-while-revalidate for EVERYTHING) ----
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            caches.open(CACHE).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          return cached ?? new Response("Offline", { status: 503 });
        });

      return cached ?? fetchPromise;
    }),
  );
});
