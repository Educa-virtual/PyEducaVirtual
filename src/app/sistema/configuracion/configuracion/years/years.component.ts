import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
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
    calendariosAcademicosSede

    constructor(
        private router: Router,
        private httpService: httpService,
        private localService: LocalStoreService,
        private ticketService: TicketService
    ) {}

    ngOnInit(): void {
        this.ticketService.getCalendarioIESede({
            onNextCallbacks: [(data) => {
                this.calendariosAcademicosSede = data.map((calAcademico) => ({
                        iCalAcadId: calAcademico.iCalAcadId,
                        dtCalAcadInicio: this.ticketService.toVisualFechasFormat(calAcademico.dtCalAcadInicio, 'DD/MM/YYYY'),
                        dtCalAcadFin: this.ticketService.toVisualFechasFormat(calAcademico.dtCalAcadFin, 'DD/MM/YYYY'),
                        cYearNombre: calAcademico.cYearNombre,
                }))
            }]
        })
    }

    actionsContainer = [
        {
            labelTooltip: 'Registrar año escolar',
            text: 'Registrar año escolar',
            icon: 'pi pi-plus',
            accion: 'crear',
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
            crear: () => {
                // this.ticketService.setModeSteps('create')
                console.log('Año vigente')
                this.ticketService.setCalendar({
                    iSedeId: "",
                    iYAcadId: "",
                    iCalAcadId: "",
                })
                this.navigateToRegistro()

            },
            editar: () => {
                // Lógica para la acción "editar"
                console.log('Editando')
                console.log(row.item.iYAcadId)
                console.log('Modo?')
                console.log(this.ticketService.registroInformation.mode)
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
            field: 'cYearNombre',
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
        this.router.navigate(['configuracion/configuracion/registro'])
    }

    navigateToResumen() {
        this.router.navigate(['/configuracion/configuracion/registro'])
    }
}
