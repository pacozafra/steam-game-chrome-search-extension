export function cleanSelection(text) {
  return String(text ?? '').replace(/[™®©]/g, '').normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200).trim();
}

export function searchUrl(query) {
  const url = new URL('https://store.steampowered.com/search/');
  url.searchParams.set('term', query);
  url.searchParams.set('category1', '998');
  return url.href;
}
