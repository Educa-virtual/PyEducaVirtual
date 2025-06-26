import { Component, inject, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-config-hora-docente',
    standalone: true,
    imports: [
        StepsModule,
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
    ],
    templateUrl: './config-hora-docente.component.html',
    styleUrl: './config-hora-docente.component.scss',
})
export class ConfigHoraDocenteComponent implements OnInit {
    items: MenuItem[]
    form: FormGroup

    configuracion: any = []
    showCaption: string
    caption: string
    docentes: any[]

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private msg: StepConfirmationService
    ) {
        this.items = this.stepService.itemsStep
        this.configuracion = this.stepService.configuracion
    }

    ngOnInit(): void {
        console.log('implemntacion')

        try {
            this.form = this.fb.group({
                iConfigId: [this.configuracion[0].iConfigId],
            })
            this.searchPersonalDocente()
        } catch (error) {
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }
    confirm() {
        this._confirmService.openConfiSave({
            message: '¿Estás seguro de que deseas guardar y continuar?',
            header: 'Advertencia de autoguardado',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Acción para eliminar el registro
                this.router.navigate(['/gestion-institucional/asignar-grado'])
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        if (accion === 'retornar') {
            this._confirmService.openConfiSave({
                message:
                    '¿Estás seguro de que deseas regresar al paso anterior?',
                header: 'Advertencia de autoguardado',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Acción para eliminar el registro
                    this.router.navigate([
                        '/gestion-institucional/plan-estudio',
                    ])
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Acción cancelada',
                    })
                },
            })
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                //this.addPersonal();
                this.searchPersonalDocente()
                //this.visible=false;
                break
            case 'editar':
                //this.updatePersonal();
                this.searchPersonalDocente()
                //this.visible=false;
                break
        }
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Retornar',
            text: 'Retornar',
            icon: 'pi pi-arrow-circle-left',
            accion: 'retornar',
            class: 'p-button-warning',
        },
        // {
        //     labelTooltip: 'Asignar horas',
        //     text: 'Asignar horas',
        //     icon: 'pi pi-plus',
        //     accion: 'agregar',
        //     class: 'p-button-primary',
        // },
        {
            labelTooltip: 'Exportar PDF',
            text: 'Reporte',
            icon: 'pi pi-file-pdf',
            accion: 'agregar',
            class: 'p-button-danger',
        },
    ]

    searchPersonalDocente() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iSedeId: this.configuracion[0].iSedeId,
                    iYAcadId: this.configuracion[0].iYAcadId,
                }),
                _opcion: 'getDocentesSede',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data

                    this.docentes = item.map((persona) => ({
                        ...persona,
                        nombre_completo: (
                            persona.cPersDocumento +
                            ' ' +
                            persona.cPersPaterno +
                            ' ' +
                            persona.cPersMaterno +
                            ' ' +
                            persona.cPersNombre
                        ).trim(),
                    }))

                    console.log(this.docentes, 'personal ies')
                },
                error: (error) => {
                    console.error('Error procedimiento BD:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
    }

    selectedItems = []
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
    actionsLista: IActionTable[]
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '3rem',
            field: 'cPersDocumento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPersPaterno',
            header: 'Apellido paterno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPersMaterno',
            header: 'Apellido materno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPersNombre',
            header: 'Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iHorasLabora',
            header: 'Total de horas',
            text_header: 'center',
            text: 'center',
        },

        // {
        //     type: 'actions',
        //     width: '3rem',
        //     field: 'actions',
        //     header: 'Acciones',
        //     text_header: 'center',
        //     text: 'center',
        // },
    ]
}
