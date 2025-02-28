import { Component, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Router } from '@angular/router'
import { TicketService } from '../registro/service/ticketservice'
import { ApiService } from '@/app/servicios/api.service'
import { MessageService } from 'primeng/api'

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
        private messageService: MessageService,
        private apiService: ApiService,
        private ticketService: TicketService
    ) {}

    ngOnInit(): void {
        this.ticketService.registroInformation = {}

        this.ticketService.getCalendarioIESede({
            onNextCallbacks: [
                (data) => {
                    this.calendariosAcademicosSede = data.map(
                        (calAcademico) => ({
                            iCalAcadId: calAcademico.iCalAcadId,
                            dtCalAcadInicio:
                                this.ticketService.toVisualFechasFormat(
                                    calAcademico.dtCalAcadInicio,
                                    'DD/MM/YYYY'
                                ),
                            dtCalAcadFin:
                                this.ticketService.toVisualFechasFormat(
                                    calAcademico.dtCalAcadFin,
                                    'DD/MM/YYYY'
                                ),
                            cYearNombre: calAcademico.cYearNombre,
                        })
                    )
                },
            ],
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
            crear: async () => {
                const validRegister = await this.validNewRegister()
                if (validRegister.length > 0) {
                    return this.messageService.add({
                        summary: 'Año escolar',
                        detail: `El año ${new Date().getFullYear()} ya se ha registrado`,
                        life: 3000,
                        severity: 'warn',
                    })
                }
                await this.navigateToRegistro()
            },
            editar: async () => {
                console.log(row.item)

                await this.ticketService.setCalendar(
                    {
                        iCalAcadId: row.item.iCalAcadId,
                    },
                    {
                        onCompleteCallbacks: [() => this.navigateToRegistro()],
                    }
                )
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
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
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

    async validNewRegister() {
        return await this.apiService.getData({
            esquema: 'acad',
            tabla: 'V_CalendariosAcademicos',
            campos: '*',
            where: `cYearNombre=${new Date().getFullYear()} AND iSedeId=${JSON.parse(localStorage.getItem('dremoPerfil')).iSedeId}`,
        })
    }

    async navigateToRegistro() {
        console.log('Navegando')
        this.router.navigate(['configuracion/configuracion/registro'])
    }

    navigateToResumen() {
        this.router.navigate(['/configuracion/configuracion/registro'])
    }
}
