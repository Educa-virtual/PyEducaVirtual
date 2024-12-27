/**
 * Interface que representa la estructura de los datos para una consulta a una tabla.
 */
export interface ITableService {
    /**
     * El nombre del esquema de la base de datos en el que se encuentra la tabla.
     *
     * @type {string}
     */
    esquema: string

    /**
     * El nombre de la tabla sobre la que se realizará la operación.
     *
     * @type {string}
     */
    tabla: string

    /**
     * (Opcional) El nombre del campo que será utilizado como identificador único (ID).
     *
     * @type {string}
     */
    campoId?: string

    /**
     * (Opcional) Un conjunto de datos a ser procesados en la operación.
     * Puede ser un arreglo de objetos `IDataService`.
     *
     * @type {IDataService[]}
     */
    data?: IDataService[] | IDataService
}

/**
 * Interface que representa la estructura de los datos para una operación en una tabla o relación.
 */
export interface IDataService {
    /**
     * (Opcional) Los campos y sus valores asociados para la operación. Puede ser un objeto con pares clave-valor
     * o una cadena con el nombre de un campo específico.
     *
     * @type {{[key: string]: string | number} | string}
     */
    campos?:
        | {
              [key: string]: string | number
          }
        | string

    /**
     * (Opcional) El valor de un identificador único. Este campo se utiliza generalmente para referirse a un registro específico.
     *
     * @type {string}
     */
    valorId?: string

    /**
     * (Opcional) El nombre de una tabla hija asociada a la tabla principal.
     * Esto puede ser útil en casos de relaciones entre tablas.
     *
     * @type {string}
     */
    tablaHija?: string

    /**
     * (Opcional) Una condición `where` para filtrar los resultados en una consulta.
     * Puede ser un objeto que contenga el nombre de la columna y el valor a filtrar o una cadena de consulta.
     *
     * @type {{COLUMN_NAME: string, VALUE: string | number} | string}
     */
    where?:
        | {
              COLUMN_NAME: string
              VALUE: string | number
          }
        | string
}
