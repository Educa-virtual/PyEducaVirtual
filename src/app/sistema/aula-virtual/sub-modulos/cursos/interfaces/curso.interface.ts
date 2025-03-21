export interface ICurso {
    iCursoId: string | number
    cCursoNombre: string
    descripcion?: string
    seccion?: string
    cGradoAbreviacion?: string
    cCicloRomanos?: string
    cNivelNombreCursos?: string
    iEstudiantes?: number
    iSilaboId?: string
    nombrecompleto?: string
    cNivelTipoNombre?: string
    cSeccion?: string
    cCursoImagen?: string
    idDocCursoId?: string
    iNivelCicloId?: any
    iCantidadPreguntas?: number
    iCursosNivelGradId?: string
    bTieneArchivo?: boolean
    //iCursoNivelGradId?: string
    dtExamenFechaInicio?: string
    dtExamenFechaFin?: string
    iExamenCantidadPreguntas?: string
    iEvaluacionIdHashed?: string
    iCursoNivelGradId?: string
}
