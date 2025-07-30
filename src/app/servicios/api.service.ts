import { Injectable } from '@angular/core';
import { httpService } from '@/app/servicios/httpService';
import {
  IGetTableService,
  IInsertTableService,
  IUpdateTableService,
  IDeleteTableService,
} from '@/app/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: httpService) {}

  /**
     * Obtiene datos de una API remota y procesa la respuesta.
     * 
     * Realiza una solicitud HTTP a un servicio remoto para obtener los datos
     * de las tablas especificadas. Si los valores en la respuesta están en
     * formato JSON como cadenas, los decodifica de manera segura. Los datos
     * procesados se devuelven en un formato estructurado.
     * 
     * @param queryPayload Un solo objeto o un arreglo de objetos que contienen
     *        los parámetros de consulta para la solicitud. Cada objeto debe
     *        cumplir con la interfaz `IGetTableService`, que define las
     *        propiedades como:
     *        - `esquema`: El esquema de la base de datos.
     *        - `tabla`: El nombre de la tabla o vista de la base de datos.
     *        - `campos`: Los campos a seleccionar en la consulta.
     *        - `where`: Condición de filtrado de la consulta.
     * 
     * @returns Un arreglo de objetos donde cada objeto representa un registro
     *          de la tabla consultada. Cada objeto puede tener propiedades que
     *          son valores de tipo JSON, que serán automáticamente
     *          decodificados si están en formato de cadena válida.
     * 
    
     * @example Uso básico:
     * ```ts
     * async myFunction() {
     *     const [evaluacionCursos] = 
     *         await this.apiService.getData({
     *             esquema: 'ere',
     *             tabla: 'V_EvaluacionFechasCursos',
     *             campos: '*',
     *             where: 'iEvaluacionId = 679',
     *         })
     * }
     * ```
     *
     * @example Uso con múltiples consultas:
     * ```ts
     * async myFunction() {
     *     const [evaluacionCursos, calendarioAcademico] =
     *         await this.apiService.getData([
     *             {
     *                 esquema: 'ere',
     *                 tabla: 'V_EvaluacionFechasCursos',
     *                 campos: '*',
     *                 where: 'iEvaluacionId = 679',
     *             },
     *             {
     *                 esquema: 'acad',
     *                 tabla: 'turnos',
     *                 campos: 'iTurnoId, cTurnoNombre',
     *                 where: 'iTurnoId = 1',
     *             },
     *         ])
     * }
     *
     * ```
     */
  async getData(queryPayload: IGetTableService | IGetTableService[]) {
    // Realizar la solicitud HTTP y obtener los datos.
    return await this.formatData(this.http.getData('virtual/getData', queryPayload));
  }

  getDataObs(queryPayload: IGetTableService | IGetTableService[]) {
    // Realizar la solicitud HTTP y obtener los datos.
    return this.http.getDataObs('virtual/getData', queryPayload);
  }

  /**
   * Realiza una solicitud HTTP POST para insertar nuevos datos en el
   * servidor.
   *
   * @param queryPayload - Un objeto o arreglo de objetos que puede ser
   * de tipo `ITableService` o `IDataService[]`.
   *
   * Estos contienen los datos a insertar en
   * el servidor.
   * @returns Una promesa que resuelve la respuesta del servidor, indicando * * si la operación fue exitosa.
   * @example Uso básico:
   * ```php
   * $query = $this->selDesdeTablaOVista('grl', 'personas');
   * ```
   */
  async insertData(queryPayload: IInsertTableService | IInsertTableService[]) {
    if (Array.isArray(queryPayload)) {
      queryPayload.forEach(item => {
        if (typeof item['campos'] === 'object') {
          item['campos'] = JSON.stringify(item['campos']);
        }
      });
    }

    if (typeof queryPayload['campos'] === 'object') {
      queryPayload['campos'] = JSON.stringify(queryPayload['campos']);
    }

    return await this.formatData(this.http.postData('virtual/insertData', queryPayload));
  }

  insertDataObs(queryPayload: IInsertTableService | IInsertTableService[]) {
    if (Array.isArray(queryPayload)) {
      queryPayload.forEach(item => {
        if (typeof item['campos'] === 'object') {
          item['campos'] = JSON.stringify(item['campos']);
        }
      });
    }

    if (typeof queryPayload['campos'] === 'object') {
      queryPayload['campos'] = JSON.stringify(queryPayload['campos']);
    }

    return this.http.postDataObs('virtual/insertData', queryPayload);
  }

  /**
   * Realiza una solicitud HTTP PUT para actualizar datos existentes en el servidor.
   *
   * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
   *                       Estos contienen los datos a actualizar.
   * @returns Una promesa que resuelve la respuesta del servidor, indicando si la operación de actualización fue exitosa.
   */
  async updateData(queryPayload: IUpdateTableService | IUpdateTableService[]) {
    if (Array.isArray(queryPayload)) {
      queryPayload.forEach(item => {
        if (typeof item['campos'] === 'object') {
          item['campos'] = JSON.stringify(item['campos']);
        }
        if (typeof item['where'] === 'object') {
          item['where'] = JSON.stringify(item['where']);
        }
      });
    }

    if (typeof queryPayload['campos'] === 'object') {
      queryPayload['campos'] = JSON.stringify(queryPayload['campos']);
    }
    if (typeof queryPayload['where'] === 'object') {
      queryPayload['where'] = JSON.stringify(queryPayload['where']);
    }

    return await this.formatData(this.http.postData('virtual/updateData', queryPayload));
  }

  /**
   * Realiza una solicitud HTTP DELETE para eliminar datos del servidor.
   *
   * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
   *                       Estos contienen los datos o identificadores necesarios para eliminar los registros.
   * @returns Una promesa que resuelve la respuesta del servidor, indicando si la operación de eliminación fue exitosa.
   */
  async deleteData(queryPayload: IDeleteTableService | IDeleteTableService[]) {
    return await this.formatData(this.http.postData('virtual/deleteData', queryPayload));
  }

  async formatData(data: any) {
    const res = await data;

    // Verificar si la respuesta contiene datos válidos.
    if (res?.data?.length > 0) {
      console.log('Datos obtenidos:', res.data);

      // Procesar los datos y decodificar valores JSON en los registros.
      return res.data.map(item => {
        const decodedItem: Record<string, any> = {};

        // Asegurarse de que `item` no sea null o undefined antes de usar Object.entries
        if (item && typeof item === 'object') {
          // Iterar sobre cada propiedad del objeto de datos.
          Object.entries(item).forEach(([key, value]) => {
            try {
              // Decodificar el valor si es una cadena JSON válida.
              decodedItem[key] =
                typeof value === 'string' && value.startsWith('[{')
                  ? JSON.parse(value) // Decodificar JSON.
                  : value; // Mantener el valor original si no es JSON.
            } catch (e) {
              // Si ocurre un error al decodificar, mantener el valor original.
              decodedItem[key] = value;
              console.error(`Error al decodificar el campo ${key}:`, e);
            }
          });
        } else {
          // Si `item` es nulo o no es un objeto, dejarlo como está.
          console.warn('Elemento no válido en los datos:', item);
          return item;
        }

        return decodedItem;
      });
    } else {
      // Si no hay datos o la respuesta está vacía, devolver los datos tal como están.
      console.log('No se encontraron datos o la respuesta está vacía');
      return res.data;
    }
  }
}
