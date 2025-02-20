import { removeHTML } from '@/app/shared/utils/remove-html'

// convierte los datos de las preguntas
export const mapPregunta = (pregunta, alternativas) => {
    pregunta.iPreguntaId = pregunta.iBancoId
    pregunta.cPregunta = pregunta.cBancoPregunta
    pregunta.cPreguntaNoHTML = removeHTML(pregunta.cBancoPregunta)
    pregunta.iEncabPregId = pregunta.idEncabPregId
    pregunta.iPreguntaPeso = pregunta.nBancoPuntaje
    pregunta.cEncabPregContenido = pregunta.cTipoPregDescripcion
    pregunta.alternativas = alternativas
    pregunta.cPreguntaTextoAyuda = pregunta.cBancoTextoAyuda
    pregunta.isLocal = false
    pregunta.logros = pregunta.logros ?? []
    pregunta.jEvalRptaEstudiante =
        pregunta.jEvalRptaEstudiante && JSON.parse(pregunta.jEvalRptaEstudiante)
    return pregunta
}

// mapea los datos de las alternativas
export const mapAlternativa = (alternativa) => {
    alternativa.iAlternativaId = alternativa.iBancoAltId
    alternativa.cAlternativaDescripcion = alternativa.cBancoAltDescripcion
    alternativa.cAlternativaLetra = alternativa.cBancoAltLetra
    alternativa.bAlternativaCorrecta = alternativa.bBancoAltRptaCorrecta ? 1 : 0
    alternativa.cAlternativaExplicacion = alternativa.cBancoAltExplicacionRpta
    return alternativa
}

// mapea los datos de la pregunta encabezado
export const mapEncabezado = (encabezado) => {
    encabezado.cPreguntaNoHTML = removeHTML(encabezado.cEncabPregTitulo)
    encabezado.iEncabPregId = encabezado.idEncabPregId
    encabezado.logros = []
    const ids = []
    const idsEvaluacionPreg = []
    encabezado.preguntas = encabezado.preguntas.map((subPregunta) => {
        ids.push(subPregunta.iBancoId)
        idsEvaluacionPreg.push(subPregunta.iEvalPregId)
        const alternativas = subPregunta.alternativas?.map((alt, index) => {
            if (index === 0) {
                encabezado.logros = alt.logros ?? []
            }
            return mapAlternativa(alt)
        })
        return mapPregunta(subPregunta, alternativas)
    })
    encabezado.iPreguntaId = ids.join(',')
    encabezado.iEvalPregId = idsEvaluacionPreg.join(',')
    return encabezado
}
