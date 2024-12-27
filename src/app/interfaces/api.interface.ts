export interface IGetTableService {
    esquema: string
    tabla: string
    campos: string
    where: string
}

export interface IInsertTableService {
    esquema: string
    tabla: string
    campos: {
        [key: string]: string | number
    }
}

export interface IUpdateTableService {
    esquema: string
    tabla: string
    data: [
        {
            campos: {
                [key: string]: string | number
            }
            where: {
                COLUMN_NAME: string
                VALUE: string | number
            }
        },
    ]
}

export interface IDeleteTableService {
    esquema: string
    tabla: string
    campoId: string | number
    valorId: string | number
    tablaHija: string
}
