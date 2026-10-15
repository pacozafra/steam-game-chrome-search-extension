import {cleanSelection, searchUrl} from './search.js';

const MENU_ID = 'buscar-juego-steam';
const pendingKey = id => 'steam-search-' + id;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({id:MENU_ID, title:'Buscar: %s', contexts:['selection']});
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId !== MENU_ID) return;
  const query = cleanSelection(info.selectionText);
  if (!query) return;
  void copyToClipboard(String(info.selectionText).trim()).catch(error => {
    console.warn('No se pudo copiar el nombre al portapapeles.', error);
  });
  void openSearch(query);
});

async function openSearch(query) {
  let tab;
  try {
    // Registra la pestaña antes de cargar Steam, para evitar una carrera con el script.
    tab = await chrome.tabs.create({url:'about:blank', active:true});
    await chrome.storage.session.set({[pendingKey(tab.id)]:{query, created:Date.now()}});
    await chrome.tabs.update(tab.id, {url:searchUrl(query)});
  } catch (error) {
    if (tab) await chrome.storage.session.remove(pendingKey(tab.id)).catch(() => {});
    console.warn('No se pudo abrir la búsqueda de Steam.', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'steam-get-pending-search') return;
  let url;
  try { url = new URL(sender.url); } catch { return; }
  if (sender.frameId !== 0 || !sender.tab?.id || url.origin !== 'https://store.steampowered.com' || url.pathname !== '/search/') return;
  const key = pendingKey(sender.tab.id);
  (async () => {
    const record = (await chrome.storage.session.get(key))[key];
    await chrome.storage.session.remove(key);
    sendResponse(record && Date.now() - record.created < 60000 ? {query:record.query} : null);
  })().catch(() => sendResponse(null));
  return true;
});

chrome.tabs.onRemoved.addListener(id => {
  void chrome.storage.session.remove(pendingKey(id)).catch(() => {});
});

// Serializa las copias para que varios clics rápidos no creen documentos simultáneos.
let clipboardQueue = Promise.resolve();
function copyToClipboard(text) {
  const task = clipboardQueue.then(() => writeClipboard(text));
  clipboardQueue = task.catch(() => {});
  return task;
}

async function writeClipboard(text) {
  const documentUrl = chrome.runtime.getURL('clipboard.html');
  const contexts = await chrome.runtime.getContexts({
    contextTypes:['OFFSCREEN_DOCUMENT'], documentUrls:[documentUrl]
  });
  if (!contexts.length) {
    await chrome.offscreen.createDocument({
      url:'clipboard.html', reasons:['CLIPBOARD'],
      justification:'Copiar el nombre seleccionado al portapapeles al buscarlo en Steam.'
    });
  }
  try {
    const result = await chrome.runtime.sendMessage({
      target:'steam-clipboard', type:'copy-selected-name', text
    });
    if (!result?.ok) throw new Error(result?.error ?? 'La copia no se confirmó.');
  } finally {
    await chrome.offscreen.closeDocument().catch(() => {});
  }
}
