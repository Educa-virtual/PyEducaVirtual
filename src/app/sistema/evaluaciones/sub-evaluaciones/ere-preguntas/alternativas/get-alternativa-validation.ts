export function getAlternativaValidation(
    tipoPregunta: number,
    alternativas = []
): string | null {
    // Cualquier preguntadebe tener al menos 2 alternativas
    if (alternativas.length < 2) {
        return 'Debe haber almenos 2 alternativas'
    }

    if (tipoPregunta === 1 && alternativas.length >= 2) {
        // Una de sus respuestas debe ser correcta
        if (
            alternativas.filter(
                (alternativa) => alternativa.bAlternativaCorrecta === 1
            ).length < 1
        ) {
            return 'Debe haber al menos una alternativa correcta'
        }
    }

    if (tipoPregunta === 1 && alternativas.length >= 2) {
        // Una de sus respuestas debe ser correcta
        if (
            alternativas.filter(
                (alternativa) => alternativa.bAlternativaCorrecta === 1
            ).length > 1
        ) {
            return 'Solo debe haber una respuesta correcta'
        }
    }

    return null
}
