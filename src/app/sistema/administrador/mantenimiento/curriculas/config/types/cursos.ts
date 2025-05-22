interface payload {
    iCursoId?: string
    iCurrId: string
    iTipoCursoId: string
    cCursoNombre: string
    nCursoCredTeoria: string
    nCursoCredPractica: string
    cCursoDescripcion: string
    nCursoTotalCreditos: string
    cCursoPerfilDocente: string
    iCursoTotalHoras: string
    iEstado: number
    cCursoImagen: string
}

export interface iCursos {
    payload: payload
    formGroup: {
        [K in keyof payload]: any[]
    }
    patchValues: (keyof payload)[]
}
