import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  /**
   * @param {string} fecha
   * @param {string} typeFormat DD/MM/YY hh:mm:ss - use YYYY for full year
   * @returns {string}
   */
  toVisualFechasFormat(fecha, typeFormat = 'DD/MM/YY hh:mm:ss') {
    const date = new Date(fecha);

    const replacements = {
      DD: String(date.getDate()).padStart(2, '0'),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      YY: String(date.getFullYear()).slice(-2),
      YYYY: date.getFullYear(),
      hh: String(date.getHours()).padStart(2, '0'),
      mm: String(date.getMinutes()).padStart(2, '0'),
      ss: String(date.getSeconds()).padStart(2, '0'),
    };

    // Reemplaza cada formato en el string de typeFormat usando el objeto replacements
    return typeFormat.replace(/DD|MM|YYYY|YY|hh|mm|ss/g, match => replacements[match]);
  }

  convertToSQLDateTime(input) {
    // Verifica si el input contiene solo una hora o una fecha completa
    const timeOnlyPattern = /^\d{2}:\d{2}$/;
    let dateObject;

    if (timeOnlyPattern.test(input)) {
      // Si es solo hora, combínala con la fecha actual
      const currentDate = new Date().toISOString().slice(0, 10);
      dateObject = new Date(`${currentDate}T${input}:00`);
    } else {
      // Si es una fecha completa, intenta convertirla a Date
      dateObject = new Date(input);
    }

    // Formatea la fecha y hora al formato SQL 'YYYY-MM-DD HH:mm:ss'
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    const ms = String(dateObject.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}Z`;
  }
  convertFormGroupToFormData(form) {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value instanceof File) {
        // Si es un archivo, accedemos a `name`
        console.log('Agregando form data');
        console.log(key, value);

        formData.append(key, value, value.name);
      } else if (value instanceof Blob) {
        // Si es un Blob genérico
        formData.append(key, value, 'archivo-sin-nombre');
      } else if (typeof value === 'boolean') {
        // Si el valor es un booleano, lo convertimos a 'true' o 'false'
        formData.append(key, value.toString());
      } else if (typeof value === 'string') {
        formData.append(key, value);
      } else {
        console.warn(`El campo "${key}" tiene un valor no compatible:`, value);
      }
    });

    return formData;
  }

  base64ToFile(base64String: string, fileName: string, mimeType: string): File {
    // Eliminar el encabezado 'data:*/*;base64,' si está presente
    const base64Data = base64String.startsWith('data:') ? base64String.split(',')[1] : base64String;

    // Decodificar la cadena Base64 a bytes
    const byteCharacters = atob(base64Data);

    // Crear un array de bytes de la cadena decodificada
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    // Crear un Blob con los bytes y el tipo MIME del archivo
    const blob = new Blob(byteArrays, { type: mimeType });

    // Crear un objeto File a partir del Blob
    return new File([blob], fileName, { type: mimeType });
  }

  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Convierte a una fecha segura, sin guiones, que no tendrá problemas incluso si SQL Server está configurado en un idioma diferente a español
   */
  convertirAFechaSegura(objFecha: Date) {
    const fecha = objFecha;
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${year}${month}${day}`;
    return fechaFormateada;
  }
}
