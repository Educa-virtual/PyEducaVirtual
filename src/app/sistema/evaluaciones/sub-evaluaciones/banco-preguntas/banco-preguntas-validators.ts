export const validPreguntaUnica = (pregunta, alternativas = []) => {
    let message = ''
    if (alternativas.length < 2) {
        message = 'La pregunta debe tener al menos 2 alternativas'
        return {
            pregunta,
            message,
            isValid: false,
        }
    }

    const alternatvisaCorrectas = alternativas.filter(
        (alternativa) => alternativa.bAlternativaCorrecta === 1
    )
    if (alternatvisaCorrectas.length > 1) {
        message = 'Debe haber sólo una alternativa correcta'
        return {
            pregunta,
            message,
            isValid: false,
        }
    }

    if (alternatvisaCorrectas.length === 0) {
        message = 'Debe haber por lo menos una alternativa correcta'
        return {
            pregunta,
            message,
            isValid: false,
        }
    }

    const alternatvisaIncorrectas = alternativas.filter(
        (alternativa) => alternativa.bAlternativaCorrecta === 0
    )

    if (alternatvisaIncorrectas.length === 0) {
        message = 'Debe haber por lo menos una alternativa incorrecta'
        return {
            pregunta,
            message,
            isValid: false,
        }
    }
    return {
        isValid: true,
    }
}

export const validPreguntaMultiple = (pregunta, alternativas = []) => {
    let message = ''
    if (alternativas.length < 2) {
        message = 'La pregunta debe tener al menos 2 alternativas'
        return {
            pregunta,
            message,
            isValid: false,
        }
    }
    return {
        isValid: true,
    }
}

export const validarPregunta = (pregunta, alternativas = []) => {
    if (pregunta.iTipoPregId === 1) {
        return validPreguntaUnica(pregunta, alternativas)
    }
    if (pregunta.iTipoPregId === 2) {
        return validPreguntaMultiple(pregunta, alternativas)
    }
    return {
        isValid: true,
    }
}
