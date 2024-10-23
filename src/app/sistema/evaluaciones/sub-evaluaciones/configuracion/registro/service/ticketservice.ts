import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class TicketService {
    registroInformation = {
        stepYear: {
            fechaVigente: new Date(),
            fechaInicio: new Date(),
            fechaFin: new Date(),
        },
        stepDiasLaborales: {
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: false,
            domingo: false,
        },
        stepTurnos: [{turno: '',horaInicio: '', horaFin: '',},],
        stepModalidades: [{modalidad: ''},],

        periodosAcademicos: [{
            periodoAcademico: '',
            ciclos: [{ciclo: '', fechaInicio: '', fechaFin: ''}],
        }],
        resumen: {
            toRegister: '',
            start: '',
            end: null,
        },
    }

    private registrationComplete = new Subject<any>()

    registrationComplete$ = this.registrationComplete.asObservable()

    getTicketInformation() {
        return this.registroInformation
    }

    setTicketInformation(registroInformation, key: keyof typeof this.registroInformation) {
        this.registroInformation[key] = registroInformation
    }

    complete() {
        this.registrationComplete.next(this.registroInformation.stepYear)
    }
}
