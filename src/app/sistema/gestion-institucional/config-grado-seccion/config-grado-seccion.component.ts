import { GeneralService } from '@/app/servicios/general.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { MenuItem } from 'primeng/api'
import { Component, OnInit } from '@angular/core'
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

    visible: boolean = false
    searchText: string = ''
    filteredItems: string[] = []
    perfiles = []
    iSedeId: number
    opcion: string = 'inicio'
    caption: string = '' // Etiqueta de modal
    selAnio: string
    config = []
    constructor(
        public query: GeneralService,
        private fb: FormBuilder,
        private store: LocalStoreService,
        private router: Router,
        private stepService: AdmStepGradoSeccionService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
        this.stepService.iSedeId = this.iSedeId
        this.stepService.iNivelTipoId = perfil.iNivelTipoId

        this.stepService.perfil = perfil
    }

    ngOnInit() {
        //variables
        console.log(this.stepService.perfil)
        console.log(this.store.getItem('dremoPerfil'), 'dremo perfil')
        this.form = this.fb.group({
            iConfigId: [''],
            iEstadoConfigId: [null, Validators.required], // Control para estado
            cConfigDescripcion: ['', Validators.required], // Control para descripción"
            cConfigNroRslAprobacion: [''],
            cConfigUrlRslAprobacion: [''],
            cEstadoConfigNombre: [''],
            cSedeNombre: [''],
            iSedeId: [''],
            iYAcadId: [''],
            cYAcadNombre: [''],
            iNivelId: [0],
        })
        this.items = this.stepService.itemsStep // router del step
        console.log(this.form, 'datso form')
        this.estadoConfiguraciones()
        this.searchConfiguraciones()
        this.getSede()

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
                        iServEdId: <number>0,
                        cConfigNroRslAprobacion: '',
                        cConfigUrlRslAprobacion: '',
                        cConfigDescripcion: '',
                        bConfigEsBilingue: false,
                        cEstadoConfigNombre: '',
                        cSedeNombre: '',
                        iNivelTipoId: this.stepService.iNivelTipoId,
                        cYAcadNombre: <number>this.sede[0].cYAcadNombre,
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
                    this.stepService.setListaConfig(data)
                    this.configuracion_lista = this.stepService.getListaConfig()
                    console.log(
                        this.stepService.getListaConfig(),
                        'prueba interna'
                    )
                },
                error: (error) => {
                    console.error('Error procedimiento BD:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.opcion = 'inicio'

                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
        setTimeout(() => {
            console.log(
                this.stepService.getListaConfig(),
                'prueba después del subscribe'
            )
        }, 1000) // Ajusta el tiempo de espera según la duración estimada de la llamada
    }

    // this.step.setEstadoConfig(data.data)
    navigateToYears() {
        // this.ticketService.registroInformation = {
        //     mode: 'create'
        // }

        this.router.navigate(['configuracion/configuracion/years']) // Navega a YearsComponent
    }
    accionBtnItemTable({ accion, item }) {
        if (accion === 'agregar') {
            // this.selectedItems = []
            // this.selectedItems = [item]
            this.opcion = 'seleccionar'
            this.caption = 'Seleccionar configuración'
            this.visible = true
            // this.asignarPreguntas()
        }
        if (accion === 'editar') {
            const registro = [
                {
                    iConfigId: item.iConfigId,
                    iYAcadId: item.iYAcadId,
                    iEstadoConfigId: item.iEstadoConfigId,
                    iNivelTipoId: item.NivelTipoId,
                    iSedeId: item.iSedeId,
                    iServEdId: item.iServEdId,
                    cConfigNroRslAprobacion: item.cConfigNroRslAprobacion,
                    cConfigUrlRslAprobacion: item.cConfigUrlRslAprobacion,
                    cConfigDescripcion: item.cConfigDescripcion,
                    bConfigEsBilingue: item.bConfigEsBilingue,

                    cNivelTipoNombre:
                        this.stepService.perfil['cNivelTipoNombre'],
                    cEstadoConfigNombre: '',
                    cSedeNombre: '',
                    cModalServId: this.stepService.perfil['cNivelNombre'],
                    cYAcadNombre: <number>this.sede[0].cYAcadNombre,
                },
            ]

            this.stepService.configuracion = registro

            console.log(registro, 'configuracion constante')

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
