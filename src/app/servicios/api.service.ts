import { Injectable } from '@angular/core'
import { httpService } from '@/app/servicios/httpService'
import { ITableService } from '@/app/interfaces/api.interface'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: httpService) {}

    /**
     * Realiza una solicitud HTTP GET para obtener datos del servidor.
     *
     * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
     * Estos contienen los parámetros o filtros para la consulta.
     * @returns Una promesa que resuelve la respuesta del servidor, que puede
     * ser los datos obtenidos.
     * @example Uso básico:
     * ```ts
     * const datos = await this.apiService.getData({
     *     esquema: 'ere',
     *     tabla: 'V_EvaluacionFechasCursos',
     *     data: {
     *         campos: '*',
     *         where: 'iEvaluacionId = 679',
     *     }
     * });
     * ```
     *
     * @example Uso con múltiples consultas:
     * ```ts
     * const datos = await this.apiService.getData([
     *     {
     *         esquema: 'ere',
     *         tabla: 'V_EvaluacionFechasCursos',
     *         data: {
     *             campos: '*',
     *             where: 'iEvaluacionId = 679',
     *         }
     *     },
     *     {
     *         esquema: 'acad',
     *         tabla: 'V_CalendarioAcademico',
     *         data: {
     *             campos: '*',
     *             where: 'iCalAcadId = 3',
     *         }
     *     }
     * ]);
     * ```
     */
    async getData(queryPayload: ITableService | ITableService[]) {
        return await this.http.getData('virtual/getData', queryPayload)
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
    async insertData(queryPayload: ITableService) {
        return await this.http.postData('virtual/insertData', queryPayload)
    }

    /**
     * Realiza una solicitud HTTP PUT para actualizar datos existentes en el servidor.
     *
     * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
     *                       Estos contienen los datos a actualizar.
     * @returns Una promesa que resuelve la respuesta del servidor, indicando si la operación de actualización fue exitosa.
     */
    async updateData(queryPayload: ITableService) {
        return await this.http.putData('virtual/updateData', queryPayload)
    }

    /**
     * Realiza una solicitud HTTP DELETE para eliminar datos del servidor.
     *
     * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
     *                       Estos contienen los datos o identificadores necesarios para eliminar los registros.
     * @returns Una promesa que resuelve la respuesta del servidor, indicando si la operación de eliminación fue exitosa.
     */
    async deleteData(queryPayload: ITableService) {
        return this.http.deleteData('virtual/deleteData', queryPayload)
    }
}
