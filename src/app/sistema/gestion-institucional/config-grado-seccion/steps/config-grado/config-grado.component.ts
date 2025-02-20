import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'

import { StepsModule } from 'primeng/steps'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { DialogModule } from 'primeng/dialog'
import {
    TablePrimengComponent,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'

import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { InputSwitchModule } from 'primeng/inputswitch'
import { GeneralService } from '@/app/servicios/general.service'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { TreeViewPrimengComponent } from '@/app/shared/tree-view-primeng/tree-view-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

import { TreeTableModule } from 'primeng/treetable'
import { TreeNode } from 'primeng/api'

@Component({
    selector: 'app-config-grado',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        StepsModule,
        ContainerPageComponent,
        TablePrimengComponent,
        DialogModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        InputSwitchModule,
        TreeViewPrimengComponent,
        PrimengModule,

        TreeTableModule,

        //TreeModule,         // Asegúrate de importar el módulo del árbol
        //InputTextModule     // Importa InputTextModule para el filtro
    ],
    templateUrl: './config-grado.component.html',
    styleUrl: './config-grado.component.scss',
})
export class ConfigGradoComponent implements OnInit {
    form: FormGroup
    items: MenuItem[]
    caption: string
    visible: boolean = false
    mensaje: string
    option: string
    event: []
    configuracion: any[]
    grados: any[] = [] // Asegúrate de inicializarlo

    files!: TreeNode[]

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private query: GeneralService,
        private msg: StepConfirmationService
    ) {
        //this.iSedeId = this.stepService.iSedeId
        this.items = this.stepService.itemsStep
        //this.iYAcadId = this.stepService.iYAcadId
        this.configuracion = this.stepService.configuracion
    }

    ngOnInit(): void {
        this.grados = this.stepService.grados
        console.log(
            this.grados,
            'parametros de configuracion',
            this.stepService
        )

        this.files = [
            {
                data: {
                    name: 'Applications',
                    size: '200mb',
                    size2: '20mb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'Angular',
                            size: '25mb',
                            type: 'Folder',
                        },
                        children: [
                            {
                                data: {
                                    name: 'angular.app',
                                    size: '10mb',
                                    type: 'Application',
                                },
                            },
                            {
                                data: {
                                    name: 'cli.app',
                                    size: '10mb',
                                    type: 'Application',
                                },
                            },
                            {
                                data: {
                                    name: 'mobile.app',
                                    size: '5mb',
                                    type: 'Application',
                                },
                            },
                        ],
                    },
                    {
                        data: {
                            name: 'editor.app',
                            size: '25mb',
                            type: 'Application',
                        },
                    },
                    {
                        data: {
                            name: 'settings.app',
                            size: '50mb',
                            type: 'Application',
                        },
                    },
                ],
            },
            {
                data: {
                    name: 'Cloud',
                    size: '20mb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'backup-1.zip',
                            size: '10mb',
                            type: 'Zip',
                        },
                    },
                    {
                        data: {
                            name: 'backup-2.zip',
                            size: '10mb',
                            type: 'Zip',
                        },
                    },
                ],
            },
            {
                data: {
                    name: 'Desktop',
                    size: '150kb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'note-meeting.txt',
                            size: '50kb',
                            type: 'Text',
                        },
                    },
                    {
                        data: {
                            name: 'note-todo.txt',
                            size: '100kb',
                            type: 'Text',
                        },
                    },
                ],
            },
            {
                data: {
                    name: 'Documents',
                    size: '75kb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'Work',
                            size: '55kb',
                            type: 'Folder',
                        },
                        children: [
                            {
                                data: {
                                    name: 'Expenses.doc',
                                    size: '30kb',
                                    type: 'Document',
                                },
                            },
                            {
                                data: {
                                    name: 'Resume.doc',
                                    size: '25kb',
                                    type: 'Resume',
                                },
                            },
                        ],
                    },
                    {
                        data: {
                            name: 'Home',
                            size: '20kb',
                            type: 'Folder',
                        },
                        children: [
                            {
                                data: {
                                    name: 'Invoices',
                                    size: '20kb',
                                    type: 'Text',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                data: {
                    name: 'Downloads',
                    size: '25mb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'Spanish',
                            size: '10mb',
                            type: 'Folder',
                        },
                        children: [
                            {
                                data: {
                                    name: 'tutorial-a1.txt',
                                    size: '5mb',
                                    type: 'Text',
                                },
                            },
                            {
                                data: {
                                    name: 'tutorial-a2.txt',
                                    size: '5mb',
                                    type: 'Text',
                                },
                            },
                        ],
                    },
                    {
                        data: {
                            name: 'Travel',
                            size: '15mb',
                            type: 'Text',
                        },
                        children: [
                            {
                                data: {
                                    name: 'Hotel.pdf',
                                    size: '10mb',
                                    type: 'PDF',
                                },
                            },
                            {
                                data: {
                                    name: 'Flight.pdf',
                                    size: '5mb',
                                    type: 'PDF',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                data: {
                    name: 'Main',
                    size: '50mb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'bin',
                            size: '50kb',
                            type: 'Link',
                        },
                    },
                    {
                        data: {
                            name: 'etc',
                            size: '100kb',
                            type: 'Link',
                        },
                    },
                    {
                        data: {
                            name: 'var',
                            size: '100kb',
                            type: 'Link',
                        },
                    },
                ],
            },
            {
                data: {
                    name: 'Other',
                    size: '5mb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'todo.txt',
                            size: '3mb',
                            type: 'Text',
                        },
                    },
                    {
                        data: {
                            name: 'logo.png',
                            size: '2mb',
                            type: 'Picture',
                        },
                    },
                ],
            },
            {
                data: {
                    name: 'Pictures',
                    size: '150kb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'barcelona.jpg',
                            size: '90kb',
                            type: 'Picture',
                        },
                    },
                    {
                        data: {
                            name: 'primeng.png',
                            size: '30kb',
                            type: 'Picture',
                        },
                    },
                    {
                        data: {
                            name: 'prime.jpg',
                            size: '30kb',
                            type: 'Picture',
                        },
                    },
                ],
            },
            {
                data: {
                    name: 'Videos',
                    size: '1500mb',
                    type: 'Folder',
                },
                children: [
                    {
                        data: {
                            name: 'primefaces.mkv',
                            size: '1000mb',
                            type: 'Video',
                        },
                    },
                    {
                        data: {
                            name: 'intro.avi',
                            size: '500mb',
                            type: 'Video',
                        },
                    },
                ],
            },
        ]

        try {
            //bd iiee_ambientes
            //this.visible = true
            this.form = this.fb.group({
                iIieeAmbienteId: [''], //codigo de tabla_iiee_ambientes
                iTipoAmbienteId: [null, Validators.required], // tabla_iiee_ambientes (FK)
                iEstadoAmbId: ['', Validators.required], // tabla_iiee_ambientes (FK)
                iUbicaAmbId: ['', Validators.required], // tabla_iiee_ambientes (FK)
                iUsoAmbId: ['', Validators.required], // tabla_iiee_ambientes (FK)
                iPisoAmbid: ['', Validators.required], // tabla_iiee_ambientes (FK)
                iYAcadId: [this.configuracion[0].iYAcadId], // tabla_iiee_ambientes (FK)
                iSedeId: [this.configuracion[0].iSedeId], // tabla_iiee_ambientes (FK)
                bAmbienteEstado: [''],
                cAmbienteNombre: ['', Validators.required],
                cAmbienteDescripcion: ['', Validators.required],
                iAmbienteArea: ['', Validators.required],
                iAmbienteAforo: ['', Validators.required],
                cAmbienteObs: [''],
                // ambiente: [''],
                cYAcadNombre: [this.configuracion[0].cYAcadNombre], // campo adicional para la vista
            })
        } catch (error) {
            console.error('Error initializing form:', error)
            //  this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }
    accionBtnItemTable({ accion, item }) {
        if (accion == 'agregar') {
            this.event = item
        }
        if (accion === 'retornar') {
            alert('Desea retornar')
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    // accionBtnItem(accion) {}

    //ESTRUCTURASS DE TABLA
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
            labelTooltip: 'Asignar Grado',
            text: 'Asignar ambientes',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

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
    columns = [
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
            field: 'cFase',
            header: 'Fase',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCiclo',
            header: 'Ciclo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cGrado',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '5rem',
            field: 'bConfigGradoEstado',
            header: 'Activo',
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
        // iConfigGradoId
        // iConfigId (opcional)
        // iCicloId
        // iGradoId
        // iFasesPromId
        // iYAcadId
        // iSedeId
        // bConfigGradoEstado
        // cConfigGradoObs
    ]

    // Datos del árbol

    // Secciones disponibles
    //seccion = ['A', 'B', 'C', 'D'];

    seccionesPorGrado = {
        '1° Grado': ['A', 'B'],
        '2° Grado': ['A'],
        '3° Grado': ['A', 'B', 'C'],
    }
}
