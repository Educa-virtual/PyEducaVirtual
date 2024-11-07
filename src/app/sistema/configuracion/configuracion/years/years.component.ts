import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { Output, EventEmitter } from '@angular/core'

import { Router } from '@angular/router'
import { httpService } from '../http/httpService'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { TicketService } from '../registro/service/ticketservice'

@Component({
    selector: 'app-years',
    standalone: true,
    imports: [ContainerPageComponent, TablePrimengComponent],
    templateUrl: './years.component.html',
    styleUrl: './years.component.scss',
    providers: [],
})
export class YearsComponent implements OnInit {
    fechasAcademicas

    @Output() emitMode = new EventEmitter()
    constructor(
        private router: Router,
        private httpService: httpService,
        private localService: LocalStoreService,
        private ticketService: TicketService
    ) {}

    ngOnInit(): void {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: this.localService.getItem('dremoPerfil').iSedeId,
                }),
                _opcion: 'getCalendarioIESede',
            })
            .subscribe({
                next: (data: any) => {
                    // console.log(data.data)
                    console.log(JSON.parse(data.data[0]['calendarioAcademico']))

                    this.fechasAcademicas = JSON.parse(
                        data.data[0]['calendarioAcademico']
                    ).map((fecha) => ({
                        fechaVigente: this.ticketService.toVisualFechasFormat(
                            fecha.dtCalAcadInicio,
                            'YYYY'
                        ),
                        dtCalAcadInicio:
                            this.ticketService.toVisualFechasFormat(
                                fecha.dtCalAcadInicio,
                                'DD/MM/YY'
                            ),
                        dtCalAcadFin: this.ticketService.toVisualFechasFormat(
                            fecha.dtCalAcadFin,
                            'DD/MM/YY'
                        ),
                        iSedeId: fecha.iSedeId,
                        iYAcadId: fecha.iYAcadId,
                        iCalAcadId: fecha.iCalAcadId,
                        iEstado: fecha.iEstado,
                    }))

                    // console.log(this.fechasAcademicas)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actionsContainer = [
        {
            labelTooltip: 'Registrar año escolar',
            text: 'Registrar año escolar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

    handleActions(row) {
        console.log(row)

        const actions = {
            ver: () => {
                // Lógica para la acción "ver"
                console.log('Viendo')
            },
            editar: () => {
                // Lógica para la acción "editar"
                console.log('Editando')
                console.log(row.item.iYAcadId)
                this.ticketService.setModeSteps('edit')
                this.ticketService.setCalendar({
                    iSedeId: row.item.iSedeId,
                    iYAcadId: row.item.iYAcadId,
                    iCalAcadId: row.item.iCalAcadId,
                })

                this.ticketService.getCalendar(
                    {
                        iSedeId: row.item.iSedeId,
                        iYAcadId: row.item.iYAcadId,
                        iCalAcadId: row.item.iCalAcadId,
                    },
                    [() => this.navigateToRegistro()],
                    false
                    // []
                )

                // this.ticketService.getDiasLaborales({
                //     iCalAcadId: row.item.iCalAcadId,
                // })
                // this.ticketService.getFormasAtencion({
                //     iCalAcadId: row.item.iCalAcadId,
                // })
                // this.ticketService.getPeriodosAcademicos({
                //     iCalAcadId: row.item.iCalAcadId,
                // })
            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
                console.log('Eliminando')
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
    }

    actions = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            // isVisible:(fechasAcademicas)=>{
            //     fechasAcademicas
            //     return fechasAcademicas.iEstado === 0
            // }
        },
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
            field: 'fechaVigente',
            header: 'Año vigente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Fecha fin',
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

    navigateToRegistro() {
        if (!this.ticketService.registroInformation.mode) {
            this.ticketService.registroInformation = {
                mode: 'create',
            }
        }
        this.router.navigate(['configuracion/configuracion/registro'])
    }

    navigateToResumen() {
        this.router.navigate(['/configuracion/configuracion/registro'])
    }
}
