# Configuración de Galería Dinámica (Google Drive)

Este proyecto permite que la galería de fotos se actualice automáticamente subiendo imágenes a una carpeta de Google Drive.

## 1. Preparar la Carpeta en Drive
1. Crea una carpeta en Google Drive para las fotos de la barbería.
2. Sube las fotos (formatos .jpg, .png o .webp).
3. Haz clic derecho en la carpeta > **Compartir** > Cambia a **"Cualquier persona con el enlace"** (modo lector).
4. Copia el ID de la carpeta de la URL (es el código largo que aparece después de `/folders/`).

## 2. Crear el Puente (Google Apps Script)
1. Ve a [script.google.com](https://script.google.com/).
2. Crea un **Nuevo Proyecto**.
3. Pega el siguiente código:

```javascript
function doGet() {
  const folderId = '1-fab5OLAphxESrTtbL-vMgTdnIEd6aCw'; 
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    const result = [];
    while (files.hasNext()) {
      const file = files.next();
      if (file.getMimeType().startsWith('image/')) {
        result.push({
          id: file.getId(),
          image: `https://lh3.googleusercontent.com/d/${file.getId()}=s0`, 
          title: file.getName().split('.')[0],
          category: "Galería"
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({error: e.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
4. Cambia `'TU_ID_DE_CARPETA_AQUÍ'` por el ID que copiaste en el paso 1.
5. Dale a **Implementar > Nueva implementación**.
6. Selecciona **Aplicación web**.
7. En "Quién tiene acceso", pon **Cualquier persona**.
8. Pulsa "Implementar" y autoriza los permisos de Google.
9. Copia la **URL de la aplicación web**.

## 3. Conectar con la Web
1. Abre el archivo `src/data/config.json` en este proyecto.
2. Pega la URL en el campo `"driveEndpoint"`:
   ```json
   "driveEndpoint": "https://script.google.com/macros/s/XXXXX/exec"
   ```
3. ¡Listo! La web ahora leerá las fotos de Drive.
