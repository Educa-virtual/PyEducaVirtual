import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'

import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'

import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-modalidades',
    standalone: true,
    imports: [
        ButtonModule,
        TablePrimengComponent,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        DropdownModule,
    ],
    templateUrl: './modalidades.component.html',
    styleUrl: './modalidades.component.scss',
})
export class ModalidadesComponent implements OnInit, OnChanges {
    form: FormGroup

    visible: boolean = false

    modalidades: {
        iModalServId: string
        cModalServNombre: string
    }[]

    modalidadesModal: { modalidad: string }

    modalidadesFetch: { name: string }[]

    modalidadesInformation
    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    showDialog(){
        this.visible = true
    }

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodosAcademicos',
        ])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    saveInformation() {
        let modalidadsCurrent

        // Asegura que `registroInformation` esté inicializado
        if (!this.ticketService.registroInformation) {
            this.ticketService.registroInformation = {}
        }

        // Verifica la existencia de `stepYear` y continúa con `stepTurnos`
        if ('stepTurnos' in this.ticketService.registroInformation) {
            modalidadsCurrent = this.ticketService.getTicketInformation().stepModalidades
        } else {
            // Agrega `stepTurnos` si no existe
            this.ticketService.registroInformation = {
                ...this.ticketService.registroInformation,
                stepModalidades: [],
            }
            modalidadsCurrent = this.ticketService.registroInformation.stepModalidades
        }

        modalidadsCurrent.push(this.modalidadesModal)
        this.ticketService.setTicketInformation(modalidadsCurrent, 'stepModalidades')

        this.modalidadesInformation = this.ticketService
            .getTicketInformation()
            .stepModalidades.map((modalidad, index) => ({
                index: (index + 1),
                modalidad: modalidad.modalidad,
            }))

        console.log(this.ticketService.getTicketInformation().stepModalidades)
        this.visible = false
    }

    ngOnInit() {
        this.form = this.fb.group({
            modalidad: [''],
        })

        this.form.valueChanges.subscribe((value) => {
            this.modalidadesModal = {
                modalidad: value.modalidad.name,
            }
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

                    
                    this.modalidadesFetch = this.modalidades.map((modalidad) => ({
                        name: modalidad.cModalServNombre,
                    }))
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

            if(this.ticketService.registroInformation?.stepModalidades){
                this.modalidadesInformation = this.ticketService
                .getTicketInformation()
                .stepModalidades.map((modalidad, index) => ({
                    index: (index + 1),
                    modalidad: modalidad.modalidad,
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

    columns = [
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
            field: 'modalidad',
            header: 'Modalidad',
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
