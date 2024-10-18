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
    const ids = []
    encabezado.preguntas = encabezado.preguntas.map((subPregunta) => {
        ids.push(subPregunta.iBancoId)
        const alternativas = subPregunta.alternativas?.map((alt) => {
            return mapAlternativa(alt)
        })
        return mapPregunta(subPregunta, alternativas)
    })
    encabezado.iPreguntaId = ids.join(',')
    return encabezado
}
