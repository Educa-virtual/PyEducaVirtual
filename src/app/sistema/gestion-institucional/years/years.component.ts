import { Component, OnInit } from '@angular/core' //OnChanges, OnDestroy
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CalendarModule } from 'primeng/calendar'
import { ChipsModule } from 'primeng/chips'
import { TagModule } from 'primeng/tag'
import { ToastModule } from 'primeng/toast'
import { ToggleButtonModule } from 'primeng/togglebutton'

import { MessageService } from 'primeng/api'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'

import { FormsModule } from '@angular/forms'

import { GeneralService } from '@/app/servicios/general.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { PrimengModule } from '@/app/primeng.module'
import { years } from './config/table/year.table'
import { YearService } from './config/service/year.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { distribucionBloques } from './config/table/distribucion-bloque.table'
import { DistribucionBloquesService } from './config/service/distribucion-bloques.service'
import { DatePipe } from '@angular/common'

@Component({
    selector: 'app-years',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        ToggleButtonModule,
        ContainerPageComponent,
        CalendarModule,
        ChipsModule,
        ToastModule,
        PrimengModule,
        TagModule,
        InputTextareaModule,
    ],
    providers: [
        MessageService,
        GeneralService,
        StepConfirmationService,
        DatePipe,
    ],
    templateUrl: './years.component.html',
    styleUrl: './years.component.scss',
}) //, OnChanges, OnDestroy
export class YearsComponent implements OnInit {
    forms: {
        year: FormGroup
        distribucionBloque: FormGroup
    } = {
        year: new FormGroup({}),
        distribucionBloque: new FormGroup({}),
    }

    dialogs = {
        year: {
            title: '',
            visible: false,
        },
        yearAcademico: {
            title: '',
            visible: false,
        },
        distribucionBloques: {
            title: '',
            visible: false,
        },
        distribucionBloque: {
            title: '',
            visible: false,
        },
    }

    years = {
        accionBtnItem: years.accionBtnItem.bind(this),
        table: {
            columns: years.table.columns,
            data: [],
            actions: years.table.actions,
        },
        container: years.container,
        saveData: years.saveData.bind(this),
    }

    distribucionBloques = {
        types: [],
        accionBtnItem: distribucionBloques.accionBtnItem.bind(this),
        table: {
            columns: distribucionBloques.table.columns,
            data: [],
            actions: distribucionBloques.table.actions.call(this),
        },
        saveData: distribucionBloques.saveData.bind(this),
    }

    constructor(
        public messageService: MessageService,
        public query: GeneralService,
        private fb: FormBuilder,
        public yearsService: YearService,
        public distribucionBloquesService: DistribucionBloquesService,
        private msg: StepConfirmationService,
        public dialogConfirm: ConfirmationModalService,
        public datePipe: DatePipe
    ) {
        this.forms.year = this.fb.group({
            iYearId: [''],
            cYearNombre: [''],
            cYearOficial: [''],
            iYearEstado: [''],
        })

        // this.forms.yearAcademico = this.fb.group({
        //     iYAcadId: [''],
        //     iYearId: [''],
        //     dtYAcadInicio: [''],
        //     dYAcadFin: [''],
        //     cYAcadNombre: [''],
        //     cYAcadDescripcion: [''],
        //     iEstado: [''],
        // })

        this.forms.distribucionBloque = this.fb.group({
            iDistribucionBloqueId: [''],
            iYAcadId: [''],
            iTipoDistribucionId: [''],
            iSesionId: [''],
            dtInicioBloque: [''],
            dtFinBloque: [''],
            iEstado: [''],
        })
    }

    ngOnInit(): void {
        this.yearsService.getYears().subscribe({
            next: (res: any) => {
                this.years.table.data = res.data
            },
        })

        this.distribucionBloquesService.getTipoDistribucion().subscribe({
            next: (res: any) => {
                this.distribucionBloques.types = res.data.map((item) => ({
                    code: item.iTipoDistribucionId,
                    name: item.cBloqueNombre,
                }))
            },
        })
    }

    // getYearCalendarios(item: any) {
    //     this.showCaption = 'addCalendario'
    //     this.caption = 'Registrar Calendario Escolar'
    //     this.query
    //         .searchCalAcademico({
    //             esquema: 'acad',
    //             tabla: 'year_academicos',
    //             campos: 'iYAcadId, iYearId,dtYAcadInicio, dYAcadFin, cYAcadNombre, cYAcadDescripcion, iEstado',
    //             condicion: 'iYearId = ' + item.iYearId,
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 this.yearCalendarios = data.data

    //                 console.log(this.yearCalendarios)
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching Años Académicos:', error)
    //                 this.messageService.add({
    //                     severity: 'danger',
    //                     summary: 'Mensaje',
    //                     detail: 'Error en ejecución',
    //                 })
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }

    // addCalendario(): void {
    //     if (this.formCalendario.valid) {
    //         console.log(this.formCalendario.value)
    //         //ALMACENAR LA INFORMACION
    //         this.query
    //             .addYear({
    //                 json: JSON.stringify(this.formCalendario.value),
    //                 _opcion: 'addYearCalendario',
    //             })
    //             .subscribe({
    //                 next: (data: any) => {
    //                     console.log(data)
    //                 },
    //                 error: (error) => {
    //                     console.error('Error fetching turnos:', error)
    //                     this.messageService.add({
    //                         severity: 'danger',
    //                         summary: 'Mensaje',
    //                         detail: 'Error de ejecución',
    //                     })
    //                 },
    //                 complete: () => {
    //                     console.log('Request completed')

    //                     this.getYearCalendarios(this.formCalendario.value)
    //                     this.messageService.add({
    //                         severity: 'success',
    //                         summary: 'Mensaje',
    //                         detail: 'Proceso exitoso',
    //                     })
    //                 },
    //             })
    //     } else {
    //         this.messageService.add({
    //             severity: 'warning',
    //             summary: 'Mensaje',
    //             detail: 'Formulario invalido',
    //         })
    //         console.log(
    //             'Formulario no válido - Calendario',
    //             this.formCalendario.invalid
    //         )
    //     }
    // }
    // updateCalendario(): void {
    //     if (this.formCalendario.valid) {
    //         console.log(this.formCalendario.value)
    //         //ALMACENAR LA INFORMACION
    //         this.query
    //             .updateYear({
    //                 json: JSON.stringify(this.formCalendario.value),
    //                 _opcion: 'updateYearCalendario',
    //             })
    //             .subscribe({
    //                 next: (data: any) => {
    //                     console.log(data)
    //                 },
    //                 error: (error) => {
    //                     console.error('Error fetching year calendario:', error)
    //                     this.messageService.add({
    //                         severity: 'danger',
    //                         summary: 'Mensaje',
    //                         detail: 'Error de ejecución',
    //                     })
    //                 },
    //                 complete: () => {
    //                     console.log('Request completed')
    //                     this.messageService.add({
    //                         severity: 'success',
    //                         summary: 'Mensaje',
    //                         detail: 'Proceso exitoso',
    //                     })
    //                     this.getYearCalendarios(this.formCalendario.value)
    //                     this.lema =
    //                         this.formCalendario.get('cYAcadDescripcion')?.value
    //                 },
    //             })
    //     } else {
    //         console.log(this.formCalendario.value)

    //         this.messageService.add({
    //             severity: 'warning',
    //             summary: 'Mensaje',
    //             detail: 'Formulario invalido',
    //         })
    //     }
    // }
    // deleteCalendario() {
    //     this.query
    //         .deleteYear({
    //             json: JSON.stringify(this.formCalendario.value),
    //             _opcion: 'deleteYearCalendario',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 console.log(data)
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching calendario:', error)
    //                 this.messageService.add({
    //                     severity: 'danger',
    //                     summary: 'Mensaje',
    //                     detail: 'Error de ejecución',
    //                 })
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //                 this.getYearCalendarios(this.formCalendario.value)
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Mensaje',
    //                     detail: 'Proceso exitoso',
    //                 })
    //             },
    //         })
    // }
}
