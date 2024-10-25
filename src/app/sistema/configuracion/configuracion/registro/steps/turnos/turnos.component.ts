import { Component, OnInit, OnChanges } from '@angular/core'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import {
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { CalendarModule } from 'primeng/calendar'
import { FloatLabelModule } from 'primeng/floatlabel'
import { FormsModule } from '@angular/forms'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

@Component({
    selector: 'app-turnos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        DialogModule,
        CalendarModule,
        DropdownModule,
        FloatLabelModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './turnos.component.html',
    styleUrl: './turnos.component.scss',
})
export class TurnosComponent implements OnInit, OnChanges {
    turnos: {
        iTurnoId: string
        cTurnoNombre: string
    }[]

    form: FormGroup

    visible: boolean = false

    turnosFetch: { name: string }[]

    turnosModal: { turno: string; horaInicio: Date; horaFin: Date }
    turnosInformation

    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    nextPage() {

        this.router.navigate([
            'configuracion/configuracion/registro/modalidades',
        ])
    }

    prevPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }

    saveInformation() {
        let turnosCurrent

        // Asegura que `registroInformation` esté inicializado
        if (!this.ticketService.registroInformation) {
            this.ticketService.registroInformation = {}
        }

        // Verifica la existencia de `stepYear` y continúa con `stepTurnos`
        if ('stepTurnos' in this.ticketService.registroInformation) {
            turnosCurrent = this.ticketService.getTicketInformation().stepTurnos
        } else {
            // Agrega `stepTurnos` si no existe
            this.ticketService.registroInformation = {
                ...this.ticketService.registroInformation,
                stepTurnos: [],
            }
            turnosCurrent = this.ticketService.registroInformation.stepTurnos
        }

        turnosCurrent.push(this.turnosModal)
        this.ticketService.setTicketInformation(turnosCurrent, 'stepTurnos')

        this.turnosInformation = this.ticketService
            .getTicketInformation()
            .stepTurnos.map((turno, index) => ({
                index: (index + 1),
                turno: turno.turno,
                horaInicio: this.formatFechas(turno.horaInicio),
                horaFin: this.formatFechas(turno.horaFin),
            }))

        console.log(this.ticketService.getTicketInformation().stepTurnos)

        this.visible = false
    }

    formatFechas(fecha) {
        const date = new Date(fecha)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${hours}:${minutes}`

        // return `${day}/${month}/${year}`
    }

    showDialog() {
        this.visible = true
    }
    ngOnInit() {
        this.form = this.fb.group({
            turno: [''],
            horaInicio: [''],
            horaFin: [''],
        })

        this.form.valueChanges.subscribe((value) => {
            this.turnosModal = {
                turno: value.turno.name,
                horaInicio: value.horaInicio,
                horaFin: value.horaFin,
            }
        })

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'turnos',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.turnos = data.data

                    this.turnosFetch = this.turnos.map((turno) => ({
                        name: turno.cTurnoNombre,
                    }))

                    // console.log(this.turnos);
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

            if(this.ticketService.registroInformation.stepTurnos){
                this.turnosInformation = this.ticketService
                .getTicketInformation()
                .stepTurnos.map((turno, index) => ({
                    index: (index + 1),
                    turno: turno.turno,
                    horaInicio: this.formatFechas(turno.horaInicio),
                    horaFin: this.formatFechas(turno.horaFin),
                }))
            }

    }

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'turno',
            header: 'Turno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'horaInicio',
            header: 'Hora inicio',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'horaFin',
            header: 'Hora fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    ngOnChanges(changes) {}
}
