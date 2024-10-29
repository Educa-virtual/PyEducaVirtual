import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class TicketService {
    registroInformation: {
        mode: 'create' | 'edit'

        calendar?: {
            iCalAcadId: string
            iYAcadId: string
        }

        stepYear?: {
            fechaVigente: Date
            fechaInicio: Date
            fechaFin: Date
        }
        stepDiasLaborales?: {
            iDiaId: string
            iDia: string
            cDiaNombre: string
            cDiaAbreviado: string
        }[]
        stepFormasAtencion?: {
            iModalServId: string
            cModalServNombre: string
            iTurnoId: string
            cTurnoNombre: string
            dtAperTurnoInicio: Date
            dtAperTurnoFin: Date
        }[]
        stepTurnos?: {
            turno: string
            horaInicio: Date
            horaFin: Date
        }[]
        stepModalidades?: {
            modalidad: string
        }[]
        stepPeriodosAcademicos?: {
            periodoAcademico: string
            ciclos?: {
                ciclo: string
                fechaInicio: Date
                fechaFin: Date
            }[]
        }[]
    }

    private registrationComplete = new Subject<any>()

    registrationComplete$ = this.registrationComplete.asObservable()

    getTicketInformation() {
        return this.registroInformation
    }

    setTicketInformation(
        registroInformation,
        key: keyof typeof this.registroInformation
    ) {
        this.registroInformation[key] = registroInformation
    }

    complete() {
        this.registrationComplete.next(this.registroInformation.stepYear)
    }

    /**
     * @param {string} fecha 
     * @param {string} typeFormat DD/MM/YY hh:mm:ss - use YYYY for full year
     * @returns {string}  
     */
    formatFechas(fecha, typeFormat = 'DD/MM/YY hh:mm') {
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
