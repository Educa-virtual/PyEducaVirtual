import { StepConfirmationService, type informationMessage } from '@/app/servicios/confirm.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { IActionTable, IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnChanges, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'
import { httpService } from '../../../http/httpService'
import { TicketService } from '../../service/ticketservice'

@Component({
    selector: 'app-diasLaborales',
    standalone: true,
    imports: [
        TableModule,
        TablePrimengComponent,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
    ],
    templateUrl: './diasLaborales.component.html',
    styleUrl: './diasLaborales.component.scss',
})
export class DiasLaboralesComponent implements OnInit, OnChanges {
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

    nextPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/fechas'])
    }

    async ngOnInit() {
        if(!this.ticketService.registroInformation?.calendar?.iCalAcadId){
            this.router.navigate(['configuracion/configuracion/years'])

            return;
        }

        this.generalService.getDias().subscribe({
            next: (data: any) => {
                this.dias = data.data.map((dia) => ({
                    ...dia,
                }))
            },
            error: (error) => {
                console.error('Error fetching dias:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })

        await this.ticketService.setCalDiasLaborales()

        await this.isSelectionDia()
    }

    confirm() {
        console.log('confirmando')
        const message: informationMessage = {
            header: 'Confirmar',
            message: 'Por favor, confirme para continuar.',
            accept: {
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Usted ha aceptado',
                life: 3000,
            },
            reject: {
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Usted ha aceptado',
                life: 3000,
            },
        }

        this.stepConfirmationService.confirmAction(
            [() => this.saveInformation(), ], message
        )
    }

    async isSelectionDia(){
        // const resultado = this.dias.map((diaOption) => {
        //     const coincidencia = filterDiasLaborales.find(
        //         (diaSelect) =>
        //             diaSelect.iDiaId === diaOption.iDiaId
        //     )
        //     return coincidencia || diaOption
        // })

        // filterDiasLaborales.forEach((diaSelect) => {
        //     const existeEnResultado = resultado.some(
        //         (item) => item.iDiaId === diaSelect.iDiaId
        //     )
        //     if (!existeEnResultado) {
        //         resultado.push(diaSelect)
        //     }
        // })

        // this.dias = resultado
        
        // this.ticketService.setTicketInformation(
        //     filterDiasLaborales,
        //     'stepDiasLaborales'
        // )
        
        // this.diasSelection =
        // this.ticketService.registroInformation.stepDiasLaborales
        // console.log(this.diasSelection)
    }

    onSelectionChange(
        columnsChecked
    ) {
        console.log(columnsChecked);
        this.diasSelections = columnsChecked

    }

    saveInformation() {

        let noExistDiaSelection;
        let ExistDiaNoSelection

        if(Array.isArray(this.ticketService.registroInformation.stepDiasLaborales)){
            noExistDiaSelection = this.diasSelections.filter(dia => 
                !this.ticketService.registroInformation.stepDiasLaborales.some(diaExist => diaExist.iDia === dia.iDia)
            )

            ExistDiaNoSelection = this.ticketService.registroInformation.stepDiasLaborales.filter(diaExist => 
                !this.diasSelections.some(dia => dia.iDia === diaExist.iDia)
            );
            
        } else {
            noExistDiaSelection = this.diasSelections
        }


        console.log('dias a crear')
        console.log(noExistDiaSelection)
        
        console.log('dias a eliminar')
        console.log(ExistDiaNoSelection)

        if(noExistDiaSelection){
            this.ticketService.insCalDiasLaborales(noExistDiaSelection)
        }

        // if(ExistDiaNoSelection){
        //     this.deleteDiasLaborales()
        // }

        this.ticketService.setCalDiasLaborales()

        // this.isSelectionDia()
    }

    createDiasLaborales() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify(
                    this.ticketService.registroInformation.stepDiasLaborales
                ),
                _opcion: 'addDiasLaborales',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    deleteDiasLaborales() {
        console.log(this.ticketService.registroInformation.stepDiasLaborales)

        let create = this.ticketService.registroInformation.stepDiasLaborales
            .filter((dia) => !dia.iDiaLabId)
            .map((dia) => ({
                iCalAcadId:
                    this.ticketService.registroInformation.calendar.iCalAcadId,
                iDiaId: dia.iDiaId,
            }))

        console.log('creando')
        console.log(create)

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify(create),
                _opcion: 'addDiasLaborales',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

        const diasLaboralesIds = new Set(
            this.ticketService.registroInformation.stepDiasLaborales.map(
                (dia) => dia.iDiaLabId
            )
        )

        // Filtra y mapea los días de diasFetch que no están en el Set de IDs
        let update = this.diasFetch
            .filter((dia) => !diasLaboralesIds.has(dia.iDiaLabId))
            .map((dia) => ({
                iDiaLabId: dia.iDiaLabId,
                cDiaNombre: dia.cDiaNombre,
            }))

        console.log('Eliminando')
        console.log(update)

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify(update),
                _opcion: 'deleteDiasLaborales',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
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
    ngOnChanges(changes) {}
}
