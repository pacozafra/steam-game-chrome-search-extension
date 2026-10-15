(async () => {
  let pending;
  try { pending = await chrome.runtime.sendMessage({type:'steam-get-pending-search'}); }
  catch { return; }
  if (!pending?.query) return;

  const normalize = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
  const expected = normalize(pending.query);
  let finished = false;
  let observer;
  let interval;
  let timeout;
  const stop = () => {
    finished = true;
    observer?.disconnect();
    clearInterval(interval);
    clearTimeout(timeout);
  };
  const openFirst = () => {
    if (finished) return true;
    // No abras una lista genérica: el buscador visible debe contener el texto solicitado.
    const input = document.querySelector('#term') ?? document.querySelector('input[name="term"]:not(#store_nav_search_term)');
    if (!input || normalize(input.value) !== expected) return false;
    const first = document.querySelector('#search_resultsRows a.search_result_row');
    if (!first) return false;
    let url;
    try { url = new URL(first.href, location.href); } catch { stop(); return true; }
    if (url.origin !== 'https://store.steampowered.com' || !/^\/app\/\d+(?:\/|$)/.test(url.pathname)) {
      stop();
      return true;
    }
    stop();
    location.replace(url.href);
    return true;
  };

  if (openFirst()) return;
  observer = new MutationObserver(openFirst);
  // Observa el documento incluso antes de que exista el elemento <html>.
  observer.observe(document, {childList:true, subtree:true});
  interval = setInterval(openFirst, 250);
  timeout = setTimeout(stop, 15000);
})();
