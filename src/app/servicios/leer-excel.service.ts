import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class LeerExcelService {
  constructor(private messageService: MessageService) {}

  /**
   * Leer datos desde archivo Excel
   * @param archivo Archivo a leer
   * @param hojas Arreglo con nombres de hojas a leer o nulo para leer todas
   * @returns Objeto con datos
   */
  async leerArchivo(archivo: any, hojas: string[] | null): Promise<Array<object>> {
    const file = archivo;
    if (!file) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un archivo',
      });
      return Promise.reject();
    }

    const reader = new FileReader();

    let objeto_inicial: any = {};

    return new Promise((resolve, reject) => {
      try {
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, {
            type: 'array',
            sheetStubs: true,
          });
          objeto_inicial = {};
          if (hojas.length == 0 || hojas == null) {
            hojas = Object.keys(workbook.Sheets);
          }
          hojas.forEach((hoja, index) => {
            const fila = this.configurarFilasColumnas(workbook.Sheets[hoja]);
            objeto_inicial[index] = fila;
          });
          resolve(objeto_inicial);
        };
      } catch (error) {
        reject(error);
      }
      reader.onerror = () => {
        reject('Error procesando el archivo');
      };
      reader.readAsArrayBuffer(file);
    });
  }

  configurarFilasColumnas(worksheet: XLSX.WorkSheet) {
    const objeto_final = {};
    for (const key in worksheet) {
      const match = key.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const letra_columna = match[1];
        const numero_fila = Number(match[2]);
        if (!objeto_final[numero_fila]) {
          objeto_final[numero_fila] = {};
        }
        objeto_final[numero_fila][letra_columna] = worksheet[key].v;
      }
    }
    return objeto_final;
  }
}
