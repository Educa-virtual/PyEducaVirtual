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
    configuracion: any[]
    grados: any[] = [] // Asegúrate de inicializarlo

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
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }
    accionBtnItemTable({ accion, item }) {
        console.log(accion, 'table', item)
    }

    accionBtnItem(accion) {
        console.log(accion)
    }

    //ESTRUCTURASS DE TABLA
    //Maquetar tablas
    // handleActions(actions) {
    //     console.log(actions)
    // }
    accionesPrincipal: IActionContainer[] = [
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
}
