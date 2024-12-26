export interface ITableService {
    esquema: string
    tabla: string
    campoId?: string

    data?: IDataService[]
}

export interface IDataService {
    campos?: {
        [key: string]: string
    }
    valorId?: string
    tablaHija?: string
    where?:
        | {
              COLUMN_NAME: string
              VALUE: string
          }
        | string
}
