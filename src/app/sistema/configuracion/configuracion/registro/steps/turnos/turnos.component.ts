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

    modalidades: {
        iModalServId: string
        cModalServNombre: string
    }[]
    form: FormGroup

    visible: boolean = false

    formasAtencionModal: {
        iModalServId: string
        cModalServNombre: string
        iTurnoId: string
        cTurnoNombre: string
        dtAperTurnoInicio: Date
        dtAperTurnoFin: Date
    }

    formasAtencionInformation

    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodosAcademicos',
        ])
    }

    prevPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }

    saveState() {
        // Asegura que `registroInformation` esté inicializado
        if (!this.ticketService.registroInformation) {
            this.ticketService.registroInformation = {}
        }

        // Verifica la existencia de `stepYear` y continúa con `stepTurnos`
        if ('stepFormasAtencion' in this.ticketService.registroInformation) {
            this.formasAtencionInformation =
                this.ticketService.getTicketInformation().stepFormasAtencion
        } else {
            // Agrega `stepTurnos` si no existe
            this.ticketService.registroInformation = {
                ...this.ticketService.registroInformation,
                stepFormasAtencion: [],
            }
            this.formasAtencionInformation =
                this.ticketService.registroInformation.stepFormasAtencion
        }

        this.formasAtencionInformation.push(this.formasAtencionModal)
        this.ticketService.setTicketInformation(
            this.formasAtencionInformation,
            'stepFormasAtencion'
        )
    }

    indexColumns(){
        this.formasAtencionInformation = this.ticketService
            .getTicketInformation()
            .stepFormasAtencion.map((turno, index) => ({
                ...turno,
                index: index + 1,
                dtAperTurnoInicio: this.formatFechas(turno.dtAperTurnoInicio),
                dtAperTurnoFin: this.formatFechas(turno.dtAperTurnoFin),
            }))

        console.log(
            this.ticketService.getTicketInformation().stepFormasAtencion
        )
    }

    saveInformation() {
        this.saveState()
        this.indexColumns()

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iTurnoId: this.formasAtencionModal.iTurnoId,
                    iModalServId: this.formasAtencionModal.iModalServId,
                    iCalAcadId: 3,
                    dtAperTurnoInicio: this.formasAtencionModal.dtAperTurnoInicio,
                    dtAperTurnoFin: this.formasAtencionModal.dtAperTurnoFin,
                }),
                _opcion: 'addCalTurno',
            })
            .subscribe({
                next: (data: any) => {
                    // this.modalidades = data.data
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

        this.hiddenDialog()
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

    hiddenDialog(){
        this.visible = false
    }
    ngOnInit() {
        this.form = this.fb.group({
            modalidad: [''],
            turno: [''],
            horaInicio: [''],
            horaFin: [''],
        })

        this.form.valueChanges.subscribe((value) => {
            this.formasAtencionModal = {
                iModalServId: value.modalidad.iModalServId,
                cModalServNombre: value.modalidad.cModalServNombre,
                iTurnoId: value.turno.iTurnoId,
                cTurnoNombre: value.turno.cTurnoNombre,
                dtAperTurnoInicio: value.horaInicio,
                dtAperTurnoFin: value.horaFin,
            }

            console.log(value)
        })

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'modalidad_servicios',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.modalidades = data.data
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
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
                    // console.log(this.turnos);
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

        if (this.ticketService.registroInformation?.stepFormasAtencion) {
            this.formasAtencionInformation = this.ticketService
                .getTicketInformation()
                .stepFormasAtencion.map((turno, index) => ({
                    ...turno,
                    index: index + 1,
                    dtAperTurnoInicio: this.formatFechas(
                        turno.dtAperTurnoInicio
                    ),
                    dtAperTurnoFin: this.formatFechas(turno.dtAperTurnoFin),
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
            field: 'cTurnoNombre',
            header: 'Turno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Modalidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoInicio',
            header: 'Hora inicio',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoFin',
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
