import { Injectable } from '@angular/core'
import { httpService } from '@/app/servicios/httpService'
import {
    IGetTableService,
    IInsertTableService,
    IUpdateTableService,
    IDeleteTableService,
} from '@/app/interfaces/api.interface'

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
    async getData(queryPayload: IGetTableService | IGetTableService[]) {
        const res = await this.http.getData('virtual/getData', queryPayload)

        // Verificar si la respuesta es un array no vacío
        return res.data.map((item) => {
            // Decodificar valores JSON del objeto si son cadenas válidas en formato JSON

            const decodedItem: Record<string, any> = {}

            Object.entries(item).forEach(([key, value]) => {
                try {
                    // Si el valor es una cadena válida en formato JSON, decodificarla
                    decodedItem[key] =
                        typeof value == 'string' && value.startsWith('[{"')
                            ? JSON.parse(value)
                            : value
                } catch (e) {
                    // Si ocurre un error al decodificar, mantener el valor original
                    decodedItem[key] = value
                }
            })

            return decodedItem
        })
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
    async insertData(
        queryPayload: IInsertTableService | IInsertTableService[]
    ) {
        return await this.http.postData('virtual/insertData', queryPayload)
    }

    /**
     * Realiza una solicitud HTTP PUT para actualizar datos existentes en el servidor.
     *
     * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
     *                       Estos contienen los datos a actualizar.
     * @returns Una promesa que resuelve la respuesta del servidor, indicando si la operación de actualización fue exitosa.
     */
    async updateData(
        queryPayload: IUpdateTableService | IUpdateTableService[]
    ) {
        return await this.http.putData('virtual/updateData', queryPayload)
    }

    /**
     * Realiza una solicitud HTTP DELETE para eliminar datos del servidor.
     *
     * @param queryPayload - Un objeto o arreglo de objetos que puede ser de tipo `ITableService` o `IDataService[]`.
     *                       Estos contienen los datos o identificadores necesarios para eliminar los registros.
     * @returns Una promesa que resuelve la respuesta del servidor, indicando si la operación de eliminación fue exitosa.
     */
    async deleteData(
        queryPayload: IDeleteTableService | IDeleteTableService[]
    ) {
        return this.http.deleteData('virtual/deleteData', queryPayload)
    }
}
