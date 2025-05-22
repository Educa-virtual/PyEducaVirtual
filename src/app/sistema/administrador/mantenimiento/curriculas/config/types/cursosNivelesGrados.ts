interface payload {
    iCursosNivelGradId?: string
    iCursoId: string
    iNivelGradoId: string
    nCursoHorasTeoria: string
    nCursoHorasPractica: string
    cCursoDescripcion: string
    nCursoTotalCreditos: string
    cCursoPerfilDocente: string
    iCursoTotalHoras: string
}

export interface iCursosNivelesGrados {
    payload: payload
    formGroup: {
        [K in keyof payload]: any[]
    }
}
