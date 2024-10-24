import { Component, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core'
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

@Component({
    selector: 'app-turnos',
    standalone: true,
    imports: [TablePrimengComponent, ButtonModule, DialogModule],
    templateUrl: './turnos.component.html',
    styleUrl: './turnos.component.scss',
})
export class TurnosComponent implements OnInit, OnChanges {
    turnos: {
        iTurnoId: string
        cTurnoNombre: string
    }[]

    visible: boolean = false;


    turnosInformation
    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {}

    nextPage() {
        this.ticketService.registroInformation.stepTurnos =
            this.turnosInformation
        this.router.navigate([
            'configuracion/configuracion/registro/modalidades',
        ])
    }

    prevPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }

    showDialog() {
        this.visible = true;
    }
    ngOnInit() {
        this.httpService
            .postData('administracion/dias', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'turnos',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.turnos = data.data

                    this.columns = this.columns.map((column) => {
                        if (column.type === 'select') {
                            // Cambiar la referencia de column con spread operator y mapear las opciones de turnos
                            return {
                                ...column,
                                options: this.turnos.map((turno) => ({
                                    nombre: turno.cTurnoNombre,
                                })),
                            }
                        }
                        return { ...column } // Siempre devuelve una nueva referencia de la columna
                    })

                    // console.log(this.turnos);
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    this.cdr.detectChanges();
                    console.log('Request completed')
                },
            })
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
            field: 'iTurnoId',
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
            width: '8rem',
            field: 'cHoraInicio',
            header: 'Hora inicio',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cHoraFin',
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
