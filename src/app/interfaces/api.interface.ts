export interface IGetTableService {
  /**
   * El nombre del esquema de la base de datos en el que se encuentra la
   * tabla o vista sobre la cual se realizará la operación.
   *
   * @type {string}
   */
  esquema: string;
  /**
   * El nombre de la tabla o vista sobre la cual se realizará la operación.
   *
   * @type {string}
   */
  tabla: string;
  /**
   * La condición de filtrado que se aplicará a los registros de la tabla.
   *
   * @type {string}
   */
  campos: string;
  /**
   * La condición de filtrado que se aplicará a los registros de la tabla.
   *
   * @type {string}
   */
  where: string;
}

export interface IInsertTableService {
  esquema: string;
  tabla: string;
  campos:
    | {
        [key: string]: string | number;
      }
    | string;
}

export interface IUpdateTableService {
  esquema: string;
  tabla: string;
  campos:
    | {
        [key: string]: string | number;
      }
    | string;
  where:
    | {
        COLUMN_NAME: string;
        VALUE: string | number;
      }
    | string;
}

export interface IDeleteTableService {
  esquema: string;
  tabla: string;
  campoId: string | number;
  valorId: string | number;
  tablaHija?: string;
}
