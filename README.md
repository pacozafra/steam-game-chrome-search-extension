# Steam Game Chrome Search Extension

Extensión para Chrome que busca el texto seleccionado como un juego en Steam, abre el primer resultado en una pestaña nueva y copia el nombre al portapapeles. Versión **1.0.6**.

## Instalación

1. Descarga este repositorio con **Code → Download ZIP** y extrae el contenido, o clónalo con Git.
2. Abre `chrome://extensions` en Chrome y activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y selecciona la carpeta que contiene `manifest.json`.
4. Permite el acceso a Steam y la escritura en el portapapeles si Chrome lo solicita.
5. Selecciona el nombre de un juego, pulsa el botón derecho y elige **Buscar: [texto seleccionado]**.

Requiere **Chrome 116 o posterior**. No necesita dependencias, compilación ni clave de API. Para actualizar, sustituye los archivos y pulsa **Recargar** en la tarjeta de la extensión.

## Copia al portapapeles

Al pulsar **Buscar:** copia también el texto seleccionado al portapapeles de Windows. Puedes pegarlo con Ctrl+V en cualquier aplicación. Copia la selección completa, quitando solo espacios al principio y al final, aunque la consulta de Steam tenga un límite de 200 caracteres. La búsqueda se inicia en paralelo y no depende de que termine la copia.

Al actualizar, acepta el nuevo permiso para escribir en el portapapeles si Chrome lo solicita. Requiere Chrome 116 o posterior. Usa un documento interno invisible, lo cierra tras copiar y no lee el contenido previo del portapapeles. La selección queda disponible para pegar hasta que copies otro texto.

## Mejora de velocidad

La comprobación empieza al iniciar la carga de la página y entra en la primera ficha en cuanto aparecen el campo de búsqueda y el resultado. No espera a que termine de construirse toda la página. La mejora real depende de Steam y de la conexión; no se ha medido en un navegador real.

## Comportamiento

Abre una pestaña nueva con la búsqueda de juegos y entra automáticamente en el primer resultado. Comprueba primero que el campo de búsqueda de Steam contiene el texto solicitado. La lista puede aparecer brevemente durante la carga.

Si no hay resultados o no cargan en 15 segundos, conserva la búsqueda. Las búsquedas normales en Steam no se redirigen. Si Steam muestra un aviso que bloquea la búsqueda, resuélvelo y vuelve a usar la extensión.

## Corrección de la versión 1.0.2

Se ha eliminado la marca que se añadía tras # en la URL y cualquier modificación del historial de Steam. La pestaña se identifica internamente antes de navegar. Esto evita interferir con la navegación de Steam y garantiza que el término de búsqueda se envía en el parámetro term. Se rechazan listas cuyo campo de búsqueda está vacío o contiene otro texto.

## Privacidad y permisos

Usa contextMenus, storage, offscreen, clipboardWrite y acceso a Steam. Mantiene temporalmente en memoria el texto seleccionado y el identificador de la pestaña en chrome.storage.session. Los elimina cuando la pestaña solicita la búsqueda o se cierra; se descartan también al reiniciar Chrome o recargar la extensión. Las solicitudes caducan a los 60 segundos. No hay almacenamiento permanente, analítica ni servidores propios. Envía a Steam como máximo 200 caracteres de la selección.

Incluye una recreación del símbolo de Steam. No está afiliada a Valve.

## Verificación

Pruebas simuladas de conservación del término, caracteres especiales, ausencia de fragmentos añadidos, orden de creación/registro/navegación, primera ficha, lista genérica, carga tardía, búsquedas normales, sin resultados y enlaces inválidos. Verificada también con simulaciones la copia completa, varios clics consecutivos, el cierre del documento y que un fallo de copia no bloquea la búsqueda. Falta una prueba de extremo a extremo en Chrome con Steam real y el portapapeles de Windows.

Documentación: https://developer.chrome.com/docs/extensions/reference/api/storage
https://developer.chrome.com/docs/extensions/reference/api/offscreen
