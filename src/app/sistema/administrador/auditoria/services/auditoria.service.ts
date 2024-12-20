import { httpService } from '@/app/servicios/httpService'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
    constructor(private http: httpService) {}

    async getAuditoriaAccesos(filtroFecha) {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoriaAccesos?filtroFechaInicio=${filtroFecha.filtroFechaInicio}&filtroFechaFin=${filtroFecha.filtroFechaFin}`
            )
        )
        return data.data
    }
    async getAuditoriaAccesosFallidos(filtroFecha) {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoriaAccesosFallidos?filtroFechaInicio=${filtroFecha.filtroFechaInicio}&filtroFechaFin=${filtroFecha.filtroFechaFin}`
            )
        )
        return data.data
    }
    async getAuditoria(filtroFecha) {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoria?filtroFechaInicio=${filtroFecha.filtroFechaInicio}&filtroFechaFin=${filtroFecha.filtroFechaFin}`
            )
        )
        return data.data
    }
    async getAuditoriaMiddleware(filtroFecha) {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoriaMiddleware?filtroFechaInicio=${filtroFecha.filtroFechaInicio}&filtroFechaFin=${filtroFecha.filtroFechaFin}`
            )
        )
        return data.data
    }
    async get_auditoria_accesos_fallidos() {}
    async get_auditoria() {}
    async get_auditoria_backend() {}

    toVisualFechasFormat(fecha, typeFormat = 'DD/MM/YY hh:mm') {
        const sqlDatetimeRegex =
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])([ ]|T)(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d/

        // Verificar si ya es un objeto Date válido
        if (!(fecha instanceof Date || sqlDatetimeRegex.test(fecha))) {
            // Es un objeto Date válido, procesarlo directamente
            return fecha
        }

        // Verificar si es un string en formato SQL DateTime
        if (!(typeof fecha === 'string' && sqlDatetimeRegex.test(fecha))) {
            // Convertir la cadena a un objeto Date
            return fecha
        }

        const date = new Date(fecha)

        const replacements = {
            DD: String(date.getDate()).padStart(2, '0'),
            MM: String(date.getMonth() + 1).padStart(2, '0'),
            YY: String(date.getFullYear()).slice(-2),
            YYYY: date.getFullYear(),
            hh: String(date.getHours()).padStart(2, '0'),
            mm: String(date.getMinutes()).padStart(2, '0'),
            ss: String(date.getSeconds()).padStart(2, '0'),
        }

        // Reemplaza cada formato en el string de typeFormat usando el objeto replacements
        return typeFormat.replace(
            /DD|MM|YYYY|YY|hh|mm|ss/g,
            (match) => replacements[match]
        )
    }

    convertToSQLDateTime(input) {
        // Verifica si el input contiene solo una hora o una fecha completa
        const timeOnlyPattern = /^\d{2}:\d{2}$/
        let dateObject

        if (timeOnlyPattern.test(input)) {
            // Si es solo hora, combínala con la fecha actual
            const currentDate = new Date().toISOString().slice(0, 10)
            dateObject = new Date(`${currentDate}T${input}:00`)
        } else {
            // Si es una fecha completa, intenta convertirla a Date
            dateObject = new Date(input)
        }

        // Formatea la fecha y hora al formato SQL 'YYYY-MM-DD HH:mm:ss'
        const year = dateObject.getFullYear()
        const month = String(dateObject.getMonth() + 1).padStart(2, '0')
        const day = String(dateObject.getDate()).padStart(2, '0')
        const hours = String(dateObject.getHours()).padStart(2, '0')
        const minutes = String(dateObject.getMinutes()).padStart(2, '0')
        const seconds = String(dateObject.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
}
