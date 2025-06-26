import { GeneralService } from '@/app/servicios/general.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { MenuItem, MessageService } from 'primeng/api'
import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
    Validators,
    FormsModule,
} from '@angular/forms'
import { FloatLabelModule } from 'primeng/floatlabel'

import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { StepsModule } from 'primeng/steps'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { InputNumberModule } from 'primeng/inputnumber'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-config-grado-seccion',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        ContainerPageComponent,
        StepsModule,
        InputNumberModule,
        DropdownModule,
        FloatLabelModule,
        InputTextModule,
        CardModule,
        ToastModule,
    ],
    providers: [GeneralService],
    templateUrl: './config-grado-seccion.component.html',
    styleUrl: './config-grado-seccion.component.scss',
})
export class ConfigGradoSeccionComponent implements OnInit {
    items: MenuItem[]

    form: FormGroup

    configuracion_lista: {
        // iConfigId: number
        // iEstadoConfigId: number
        // cConfigDescripcion: string
        // cConfigNroRslAprobacion: string
        // cConfigUrlRslAprobacion: string
        // cEstadoConfigNombre: string
        // cSedeNombre: string
        // iSedeId: number
        // iYAcadId: number
        // cYAcadNombre: string
    }[]
    sede: any[]
    enlace: string
    visible: boolean = false
    searchText: string = ''
    filteredItems: string[] = []
    perfiles = []
    iSedeId: number
    opcion: string = 'inicio'
    caption: string = '' // Etiqueta de modal
    selAnio: string
    config = []

    dremoYear: any
    dremoiYAcadId: any
    btnInvalido: boolean = false
    private _confirmService = inject(ConfirmationModalService)
    constructor(
        public query: GeneralService,
        private fb: FormBuilder,
        private store: LocalStoreService,
        private router: Router,
        private stepService: AdmStepGradoSeccionService,
        private messageService: MessageService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
        this.stepService.iSedeId = this.iSedeId
        this.stepService.iNivelTipoId = perfil.iNivelTipoId
        this.stepService.perfil = perfil
        this.dremoYear = this.store.getItem('dremoYear')
        this.dremoiYAcadId = this.store.getItem('dremoiYAcadId')
    }

    ngOnInit() {
        //variables
        console.log(this.stepService.perfil)
        console.log(this.store.getItem('dremoPerfil'), 'dremo perfil')
        this.form = this.fb.group({
            iConfigId: [''],
            iYAcadId: [''],
            iEstadoConfigId: [null, Validators.required], // Control para estado

            cConfigDescripcion: ['', Validators.required], // Control para descripción"
            cConfigNroRslAprobacion: [''],
            cConfigUrlRslAprobacion: [''],
            cEstadoConfigNombre: [''],

            cYAcadNombre: [''],
            cServEdNombre: [''],
            //iNivelId: [0],
        })
        this.items = this.stepService.itemsStep // router del step
        this.estadoConfiguraciones()
        this.searchConfiguraciones()
        // this.getSede()

        // this.searchAnio()
    }

    accionBtnItem(accion) {
        switch (accion) {
            case 'agregar':
                this.visible = true
                break
            case 'auto':
                this.opcion = 'auto'
                break
            case 'manual':
                this.opcion = 'manual'
                this.caption = 'Registrar'
                break
            case 'sel-manual':
                this.config = [
                    {
                        iConfigId: 0,
                        iYAcadId: <number>this.sede[0].iYAcadId,
                        iEstadoConfigId: 1,
                        cModalServId: this.stepService.perfil['cNivelNombre'],
                        cNivelTipoNombre:
                            this.stepService.perfil['cNivelTipoNombre'],
                        iSedeId: <number>this.iSedeId,
                        iServEdId: <number>this.sede[0].iServEdId,
                        cConfigNroRslAprobacion: '',
                        cConfigUrlRslAprobacion: '',
                        cConfigDescripcion: '',
                        bConfigEsBilingue: false,
                        cEstadoConfigNombre: '',
                        cSedeNombre: '',
                        iNivelTipoId: this.stepService.perfil['iNivelTipoId'],
                        cYAcadNombre: <number>this.sede[0].cYAcadNombre,
                        iEstado: 0,
                    },
                ]

                this.stepService.configuracion = this.config

                console.log(this.sede, 'configuracion grado')

                setTimeout(() => {
                    this.router.navigate(['/gestion-institucional/config'])
                }, 1000)

                //this.opcion = 'step'
                //this.caption = 'Nueva configuración grados y secciones de la IE'

                //this.form.get('iConfigId')?.setValue(0)
                //this.form.get('iSedeId')?.setValue(this.iSedeId)
                this.visible = false
                break
        }
    }

    actionsContainer = [
        {
            labelTooltip: 'Regresar',
            text: 'Regresar',
            icon: 'pi pi-arrow-left',
            accion: '',
            class: 'p-button-primary',
        },
    ]

    estadoConfiguraciones() {
        this.query.searchEstadoConfiguracion().subscribe({
            next: (data: any) => {
                this.stepService.setEstadoConfig(data.data)
            },
            error: (error) => {
                console.error('Error fetching Años Académicos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }
    getSede() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iSedeId: this.iSedeId,
                }),
                _opcion: 'getSedeYearAct',
            })
            .subscribe({
                next: (data: any) => {
                    this.stepService.sede = data.data
                    this.sede = data.data
                    console.log(this.sede, 'sede')
                },
                error: (error) => {
                    console.error('Error procedimiento BD:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    // this.getYearCalendarios(this.formCalendario.value)

                    if (
                        Number(this.sede[0].iYAcadId) ===
                        Number(this.dremoiYAcadId)
                    ) {
                        this._confirmService.openAlert({
                            header: 'Advertencia de configuracion',
                            message:
                                'El año escolar de I.E. es: ' +
                                this.sede[0].cYAcadNombre,
                            icon: 'pi pi-check-circle',
                            //severity : "success"
                        })
                        this.btnInvalido = true
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Advertencia de configuración',
                            detail: 'Año escolar habilitado para configuracion de ambientes',
                        })
                    } else {
                        this._confirmService.openAlert({
                            header: 'Advertencia de configuración',
                            message:
                                'El año escolar de I.E. es: ' +
                                this.sede[0].cYAcadNombre +
                                ' y el año vigente es : ' +
                                this.dremoYear,
                            icon: 'pi pi-times-circle',
                            //severity : "error"
                        })

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Registro no valido',
                            detail: 'El calendario escolar y periodos no configurados',
                        })

                        this.btnInvalido = false
                    }
                    //this.sede[0].iYAcadId
                    //this.sede[0].cYAcadNombre
                },
            })
    }
    searchConfiguraciones() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iSedeId: this.iSedeId,
                }),
                _opcion: 'getConfiguracion',
            })
            .subscribe({
                next: (data: any) => {
                    //this.stepService.setListaConfig(data)
                    //this.configuracion_lista = this.stepService.getListaConfig()
                    this.configuracion_lista = data.data
                    // console.log(this.configuracion_lista,'valor de data')
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje del Sistema',
                        detail: 'Peticion rechazada error:' + error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                    this.opcion = 'inicio'
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje del Sistema',
                        detail: 'Lista de configuraciones obtenida correctamente',
                    })
                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
        /*   setTimeout(() => {
            console.log(
                this.stepService.getListaConfig(),
                'prueba después del subscribe'
            )
        }, 1000)*/ // Ajusta el tiempo de espera según la duración estimada de la llamada
    }

    // this.step.setEstadoConfig(data.data)
    navigateToYears() {
        // this.ticketService.registroInformation = {
        //     mode: 'create'
        // }

        this.router.navigate(['configuracion/configuracion/years']) // Navega a YearsComponent
    }

    confirm() {
        this.router.navigate(['gestion-institucional/plan-estudio'])
    }
    accionBtnItemTable({ accion, item }) {
        if (accion === 'retornar') {
            this._confirmService.openConfiSave({
                message:
                    '¿Estás seguro de que deseas regresar al paso anterior?',
                header: 'Advertencia de autoguardado',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Acción para eliminar el registro
                    this.router.navigate(['/gestion-institucional/ambiente'])
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

        if (accion === 'agregar') {
            // this.selectedItems = []
            // this.selectedItems = [item]
            const dremoYear = this.dremoYear // año

            const resultado =
                this.configuracion_lista?.filter(
                    (item) => item['cYAcadNombre'] === dremoYear
                ) || []

            if (resultado.length > 0) {
                this._confirmService.openAlert({
                    header: 'Advertencia de configuracion',
                    message:
                        'El año escolar de I.E. ' +
                        this.sede[0].cYAcadNombre +
                        ' ya existe',
                    icon: 'pi pi-exclamation-triangle',
                    //severity : "success"
                })
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
                return
            } else {
                this.visible = true
                this.opcion = 'seleccionar'
                this.caption = 'Seleccionar configuración'
            }
        }
        if (accion === 'editar') {
            //    this.stepService.setListaConfig(item)

            const registro = [
                {
                    iConfigId: item.iConfigId,
                    iYAcadId: item.iYAcadId,
                    iEstadoConfigId: item.iEstadoConfigId,
                    iNivelTipoId: this.stepService.perfil['iNivelTipoId'],
                    iSedeId: item.iSedeId,
                    iServEdId: item.iServEdId,
                    cConfigNroRslAprobacion: item.cConfigNroRslAprobacion,
                    cConfigUrlRslAprobacion: item.cConfigUrlRslAprobacion,
                    cConfigDescripcion: item.cConfigDescripcion,
                    bConfigEsBilingue: item.bConfigEsBilingue,
                    cServEdNombre: item.cServEdNombre,
                    cSedeNombre: item.cSedeNombre,
                    iEstado: item.iEstado,
                    cEstadoConfigNombre: item.cEstadoConfigNombre, // existente
                    iTurnoId: item.iTurnoId, // existente
                    iCalAcadId: item.iCalAcadId, // existente
                    cTurnoNombre: item.cTurnoNombre, // existente

                    cNivelTipoNombre:
                        this.stepService.perfil['cNivelTipoNombre'],
                    cModalServId: this.stepService.perfil['cNivelNombre'],
                    cYAcadNombre: <number>item.cYAcadNombre,
                    iProgId: this.stepService.perfil['iProgId'],
                    // existente
                    // existente
                },
            ]

            this.stepService.configuracion = registro

            //console.log(registro, 'configuracion constante')

            setTimeout(() => {
                this.router.navigate(['/gestion-institucional/config'])
            }, 1000)

            /* this.form.get('iYearId')?.setValue(item.iYearId)
            this.form.get('cYearNombre')?.setValue(item.cYearNombre)
            this.form.get('cYearOficial')?.setValue(item.cYearOficial)
            if (item.iYearEstado == 1) {
                this.form.get('iYearEstado')?.setValue(1)
            } else {
                this.form.get('iYearEstado')?.setValue(0)
            }*/
            // this.caption = 'Seleccionar'
            // this.visible = true
        }

        if (accion === 'eliminar') {
            this.form.get('iYearId')?.setValue(item.iYearId)

            // this.showDelete()
        }
        if (accion === 'select') {
            this.selAnio = 'El año a clonar es ' + item.cYAcadNombre
            console.log(item)
            // this.showDelete()
        }
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Retornar',
            text: 'Retornar',
            icon: 'pi pi-arrow-circle-left',
            accion: 'retornar',
            class: 'p-button-warning',
        },
        {
            labelTooltip: 'Crear registro',
            text: 'Configuración',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-Primary',
        },
    ]

    selectedItems = []
    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        // {
        //     labelTooltip: 'Eliminar',
        //     icon: 'pi pi-trash',
        //     accion: 'eliminar',
        //     type: 'item',
        //     class: 'p-button-rounded p-button-danger p-button-text',
        // },
    ]
    actionsLista: IActionTable[]
    columns = [
        {
            type: 'item',
            width: '5rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYAcadNombre',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cConfigDescripcion',
            header: 'Descripcion',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cSedeNombre',
            header: 'Descripcion',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cEstadoConfigNombre',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cConfigNroRslAprobacion',
            header: 'Resolución',
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

    columnsLista = [
        {
            type: 'radio-action',
            width: '3rem',
            field: 'iConfigId',
            header: 'Seleccionar',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYAcadNombre',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '5rem',
            field: 'cSedeNombre',
            header: 'Sede',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cEstadoConfigNombre',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
    ]
}
