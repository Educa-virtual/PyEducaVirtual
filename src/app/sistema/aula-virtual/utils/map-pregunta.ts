export const mapPregunta = (pregunta, alternativas) => {
    return {
        iPreguntaId: pregunta.iBancoId,
        cPregunta: pregunta.cBancoPregunta,
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
    }
}

export const mapAlternativa = (alternativa) => {
    return {
        iAlternativaId: alternativa.iBancoAltId,
        cAlternativaDescripcion: alternativa.cBancoAltDescripcion,
        cAlternativaLetra: alternativa.cBancoAltLetra,
        bAlternativaCorrecta: alternativa.bBancoAltRptaCorrecta,
        cAlternativaExplicacion: alternativa.cBancoAltExplicacionRpta,
    }
}

export const mapEncabezado = (encabezado) => {
    encabezado.preguntas = encabezado.preguntas.map((subPregunta) => {
        const alternativas = subPregunta.alternativas?.map((alt) => {
            return mapAlternativa(alt)
        })
        return mapPregunta(subPregunta, alternativas)
    })
    return encabezado
}
