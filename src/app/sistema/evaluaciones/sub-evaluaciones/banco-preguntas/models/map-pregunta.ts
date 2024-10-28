import { removeHTML } from '@/app/shared/utils/remove-html'

export const mapPregunta = (pregunta, alternativas) => {
    return {
        iPreguntaId: pregunta.iBancoId,
        cPregunta: pregunta.cBancoPregunta,
        cPreguntaNoHTML: removeHTML(pregunta.cBancoPregunta),
        iCursoId: pregunta.iCursoId,
        iDocenteId: pregunta.iDocenteId,
        iTipoPregId: pregunta.iTipoPregId,
        iEncabPregId: pregunta.idEncabPregId,
        iPreguntaPeso: pregunta.nBancoPuntaje,
        cEncabPregTitulo: pregunta.cEncabPregTitulo,
        cEncabPregContenido: pregunta.cTipoPregDescripcion,
        alternativas: alternativas,
        iHoras: pregunta.iHoras,
        iMinutos: pregunta.iMinutos,
        iSegundos: pregunta.iSegundos,
        cPreguntaTextoAyuda: pregunta.cBancoTextoAyuda,
        cTipoPregDescripcion: pregunta.cTipoPregDescripcion,
        iEvalPregId: pregunta.iEvalPregId,
        isLocal: false,
        iEvaluacionId: pregunta.iEvaluacionId,
        logros: pregunta.logros ?? [],
    }
}

export const mapAlternativa = (alternativa) => {
    return {
        iAlternativaId: alternativa.iBancoAltId,
        cAlternativaDescripcion: alternativa.cBancoAltDescripcion,
        cAlternativaLetra: alternativa.cBancoAltLetra,
        bAlternativaCorrecta: alternativa.bBancoAltRptaCorrecta ? 1 : 0,
        cAlternativaExplicacion: alternativa.cBancoAltExplicacionRpta,
    }
}

export const mapEncabezado = (encabezado) => {
    encabezado.cPreguntaNoHTML = removeHTML(encabezado.cPregunta)
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
