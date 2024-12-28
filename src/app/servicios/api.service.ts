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
        // return await this.http.getData('virtual/getData', queryPayload)
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
