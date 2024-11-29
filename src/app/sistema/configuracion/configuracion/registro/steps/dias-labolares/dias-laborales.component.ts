import {
    StepConfirmationService,
    type informationMessage,
} from '@/app/servicios/confirm.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'
import { httpService } from '../../../http/httpService'
import { TicketService } from '../../service/ticketservice'

@Component({
    selector: 'app-dias-laborales',
    standalone: true,
    imports: [
        TableModule,
        TablePrimengComponent,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
    ],
    templateUrl: './dias-laborales.component.html',
    styleUrl: './dias-laborales.component.scss',
})
export class DiasLaboralesComponent implements OnInit {
    dias: typeof this.ticketService.registroInformation.stepDiasLaborales

    diasSelections

    diasFetch: typeof this.ticketService.registroInformation.stepDiasLaborales

    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private stepConfirmationService: StepConfirmationService,
        private router: Router,
        private generalService: GeneralService,
        private localService: LocalStoreService
    ) {}

    async nextPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/fechas'])
    }

    async ngOnInit() {
        if (!this.ticketService.registroInformation?.calendar?.iCalAcadId) {
            this.router.navigate(['configuracion/configuracion/years'])

            return
        }

        this.dias = (await this.ticketService.selDias()).data

        await this.ticketService.setCalendar()

        await this.isSelectionDia()
    }

    confirm() {
        console.log('confirmando')
        const message: informationMessage = {
            header: '¿Desea guardar información?',
            message: 'Por favor, confirme para continuar.',
            accept: {
                severity: 'success',
                summary: 'Dias laborales',
                detail: 'Se han guardado los dias.',
                life: 3000,
            },
            reject: {
                severity: 'error',
                summary: 'Dias laborales',
                detail: 'Se ha cancelado',
                life: 3000,
            },
        }

        this.stepConfirmationService.confirmAction(
            {
                onAcceptPromises: [
                    () => this.saveInformation(),
                    () => this.nextPage(),
                ],
            },
            message
        )
    }

    async isSelectionDia() {
        if (
            Array.isArray(
                this.ticketService.registroInformation.stepDiasLaborales
            )
        ) {
            this.diasSelections = this.dias.filter((dia) =>
                this.ticketService.registroInformation.stepDiasLaborales.some(
                    (diaExist) => diaExist.iDiaId == dia.iDiaId
                )
            )
        }
    }

    onSelectionChange(columnsChecked) {
        console.log(columnsChecked)
        this.diasSelections = columnsChecked
    }

    async saveInformation() {
        let noExistDiaSelection
        let ExistDiaNoSelection

        console.log(this.ticketService.registroInformation.stepDiasLaborales)

        console.log('Dias seleccionados')

        console.log(this.diasSelections)

        if (
            Array.isArray(
                this.ticketService.registroInformation.stepDiasLaborales
            )
        ) {
            noExistDiaSelection = this.diasSelections.filter(
                (dia) =>
                    !this.ticketService.registroInformation.stepDiasLaborales.some(
                        (diaExist) => diaExist.iDiaId == dia.iDiaId
                    )
            )

            ExistDiaNoSelection =
                this.ticketService.registroInformation.stepDiasLaborales.filter(
                    (diaExist) =>
                        !this.diasSelections.some(
                            (dia) => dia.iDiaId == diaExist.iDiaId
                        )
                )
        } else {
            noExistDiaSelection = this.diasSelections
        }

        console.log('dias a crear')
        console.log(noExistDiaSelection)

        console.log('dias a eliminar')
        console.log(ExistDiaNoSelection)

        if (
            Array.isArray(noExistDiaSelection) &&
            noExistDiaSelection.length > 0
        ) {
            await this.ticketService.insCalDiasLaborales(noExistDiaSelection)
        }

        if (
            Array.isArray(ExistDiaNoSelection) &&
            ExistDiaNoSelection.length > 0
        ) {
            await this.ticketService.deleteCalDiasLaborales(ExistDiaNoSelection)
        }

        await this.ticketService.setCalendar()

        await this.isSelectionDia()
    }

    actions: IActionTable[] = [
        {
            labelTooltip: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
            },
            accion: 'asignar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'iDiaId',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDiaAbreviado',
            header: 'Acrónimo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDiaNombre',
            header: 'Días',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'checked',
            header: '',
            type: 'checkbox',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]
}
