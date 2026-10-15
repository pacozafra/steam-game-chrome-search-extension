chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.target !== 'steam-clipboard' || message.type !== 'copy-selected-name') return;
  if (sender.id !== chrome.runtime.id || sender.tab) return;
  const field = document.getElementById('clipboard-text');
  try {
    if (typeof message.text !== 'string') throw new Error('Texto inválido.');
    field.value = message.text;
    field.select();
    if (!document.execCommand('copy')) throw new Error('Chrome no pudo escribir en el portapapeles.');
    respond({ok:true});
  } catch (error) {
    respond({ok:false, error:error.message});
  } finally {
    if (field) field.value = '';
  }
});
