/*
 * Service worker do Organiza.
 *
 * Estratégia conservadora (network-first): sempre tenta a rede primeiro e, se
 * falhar (offline), recorre ao cache. Só cacheia recursos estáticos do Next e
 * ignora POST (Server Actions) e chamadas a outros domínios (ex.: Supabase).
 * O objetivo principal é tornar o app instalável e um pouco mais resiliente.
 */
const CACHE = "organiza-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Não interfere em POST (Server Actions) nem em requisições cross-origin.
  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Guarda uma cópia dos assets estáticos para acelerar/offline parcial.
        if (request.url.includes("/_next/static/") || request.url.includes("/icons/")) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
