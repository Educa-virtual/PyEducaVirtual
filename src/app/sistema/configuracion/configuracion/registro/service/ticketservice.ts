import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class TicketService {

    registroInformation: {
        stepYear?: {
            iSedeId: string
            fechaVigente: Date
            fechaInicio: Date
            fechaFin: Date
        },
        stepDiasLaborales?: {
            iDiaId: string
            iDia: string
            cDiaNombre: string
            cDiaAbreviado: string
        }[],
        stepFormasAtencion?:{
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
        }[],
        stepModalidades?: {
            modalidad: string
        }[],
        stepPeriodosAcademicos?: {
            periodoAcademico: string
            ciclos?: {
                ciclo: string,
                fechaInicio: Date,
                fechaFin: Date,
            }[]
        }[],
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
}
