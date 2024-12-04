import { httpService } from '@/app/servicios/httpService'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
    constructor(private http: httpService) {}

    async getAuditoriaAccesos() {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoriaAccesos`
            )
        )
        return data.data
    }
    async getAuditoriaAccesosFallidos() {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoriaAccesosFallidos`
            )
        )
        return data.data
    }
    async getAuditoria() {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoria`
            )
        )
        return data.data
    }
    async getAuditoriaMiddleware() {
        const data = await firstValueFrom(
            this.http.getData(
                `seg/auditoria/selAuditoriaMiddleware`
            )
        )
        return data.data
    }
    async get_auditoria_accesos_fallidos() {}
    async get_auditoria() {}
    async get_auditoria_backend() {}

    toVisualFechasFormat(fecha, typeFormat = 'DD/MM/YY hh:mm') {
        const sqlDatetimeRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])([ ]|T)(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d/

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


}
