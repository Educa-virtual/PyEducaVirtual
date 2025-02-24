import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class FormatoService {
    constructor() {}

    /**
     * Convierte una fecha ingresada como string a formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).
     * Soporta formatos con y sin hora.
     * @param fechaTexto Fecha ingresada (Ej: "12/08/2024 14:30" o "2024-08-12T14:30:00Z")
     * @returns Fecha en formato ISO 8601 o null si es inválida
     */
    standardizeDateTime(fechaTexto: string): string | null {
        if (!fechaTexto) return null

        // Lista de formatos posibles
        const formatos = [
            {
                regex: /^(0?[1-9]|[12][0-9]|3[01])[/.-](0?[1-9]|1[012])[/.-](\d{4})\s+(\d{1,2}):(\d{2})$/,
                indices: [1, 2, 3, 4, 5],
            }, // DD/MM/YYYY HH:mm
            {
                regex: /^(0?[1-9]|1[012])[/.-](0?[1-9]|[12][0-9]|3[01])[/.-](\d{4})\s+(\d{1,2}):(\d{2})$/,
                indices: [2, 1, 3, 4, 5],
            }, // MM/DD/YYYY HH:mm
            {
                regex: /^(\d{4})[-/.](0?[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])\s+(\d{1,2}):(\d{2})$/,
                indices: [1, 2, 3, 4, 5],
            }, // YYYY-MM-DD HH:mm
            {
                regex: /^(\d{4})[-/.](0?[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])T(\d{1,2}):(\d{2}):(\d{2})Z?$/,
                indices: [1, 2, 3, 4, 5, 6],
            }, // ISO 8601 completo
        ]

        for (const { regex, indices } of formatos) {
            const match = fechaTexto.match(regex)
            if (match) {
                const [year, month, day, hour, minute, second = '00'] =
                    indices.map((i) => match[i])
                // Convertir a formato ISO 8601
                return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}Z`
            }
        }

        return null // Si no coincide con ningún formato válido
    }
}
