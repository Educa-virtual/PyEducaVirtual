export interface ITableService {
    esquema: string
    tabla: string
    data: IDataService
}

export interface IDataService {
    data: Array<{
        campos: object
        where:
            | string
            | {
                  COLUMN_NAME: string
                  VALUE: string
              }
    }>
}
