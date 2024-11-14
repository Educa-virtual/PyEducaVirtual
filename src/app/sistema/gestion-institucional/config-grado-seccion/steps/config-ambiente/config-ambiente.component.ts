import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { GeneralService } from '@/app/servicios/general.service'

import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

import { StepsModule } from 'primeng/steps'
import { DialogModule } from 'primeng/dialog'
import { InputSwitchModule } from 'primeng/inputswitch'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { MenuItem } from 'primeng/api'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import {
    StepConfirmationService,
    type informationMessage,
} from '@/app/servicios/confirm.service'

@Component({
    selector: 'app-config-ambiente',
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
    templateUrl: './config-ambiente.component.html',
    styleUrl: './config-ambiente.component.scss',
})
export class ConfigAmbienteComponent implements OnInit {
    form: FormGroup
    // iSedeId: number
    //iYAcadId: number
    items: MenuItem[]
    caption: string
    visible: boolean = false
    mensaje: string
    option: string
    anio: []
    tipo_ambiente: []
    tipo_ubicacion: []
    uso_ambiente: []
    piso_ambiente: []
    condicion_ambiente: []
    configuracion: any[]

    ambientes: any[]

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private msg: StepConfirmationService
    ) {
        //this.iSedeId = this.stepService.iSedeId
        this.items = this.stepService.itemsStep
        //this.iYAcadId = this.stepService.iYAcadId
        this.anio = this.stepService.anio
        this.configuracion = this.stepService.configuracion
    }

    ngOnInit(): void {
        console.log(this.configuracion, 'parametros de configuracion')
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
        this.getAmbientes() // devuelve arrays de tabla acad.ambientes
        this.getTipoAmbiente() // devuelve arrays de tabla acad.tipo_ambientes
        this.getTipoUbicacion() //devuelve arrays de tabla acad.ubiccion_ambientes
        this.getUsoAmbiente() // devuelve arrays de tabla acad.uso_ambientes
        this.getPisoAmbiente() // devuelve arrays de tabla acad.piso_ambientes
        this.getCondicionAmbiente() // devuelve arrays de tabla acad.estado_ambientes
    }
    //Consultyas a tablas
    getAmbientes() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iSedeId: this.stepService.configuracion[0].iSedeId,
                    iYAcadId: this.stepService.configuracion[0].iYAcadId,
                }),
                _opcion: 'getAmbientesSedeYear',
            })
            .subscribe({
                next: (data: any) => {
                    this.ambientes = data.data
                    this.stepService.ambientes = this.ambientes
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
    getTipoAmbiente() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'tipo_ambientes',
                campos: 'iTipoAmbienteId, cTipoAmbienteNombre',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.tipo_ambiente = data.data

                    console.log(this.tipo_ambiente)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getTipoUbicacion() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'ubicacion_ambientes',
                campos: 'iUbicaAmbId, cUbicaAmbNombre',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.tipo_ubicacion = data.data

                    console.log(this.tipo_ubicacion)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getUsoAmbiente() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'uso_ambientes',
                campos: 'iUsoAmbId, cUsoAmbNombre, cUsoAmbDescripcion',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.uso_ambiente = data.data

                    console.log(this.uso_ambiente)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getCondicionAmbiente() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'estado_ambientes',
                campos: 'iEstadoAmbId, cEstadoAmbNombre',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.condicion_ambiente = data.data

                    console.log(
                        this.condicion_ambiente,
                        'condicion de ambiente'
                    )
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getPisoAmbiente() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'piso_ambientes',
                campos: 'iPisoAmbid, cPisoAmbNombre, cPisoAmbDescripcion',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.piso_ambiente = data.data

                    console.log(this.piso_ambiente)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    // eventos de record set

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
            this.visible = true
            this.caption = 'Editar ambientes'
            this.option = 'editar'
            this.form.get('iIieeAmbienteId')?.setValue(item.iIieeAmbienteId)
            this.form.get('cAmbienteNombre')?.setValue(item.cAmbienteNombre)
            this.form
                .get('cAmbienteDescripcion')
                ?.setValue(item.cAmbienteDescripcion)
            this.form.get('iTipoAmbienteId')?.setValue(item.iTipoAmbienteId)
            this.form.get('iUbicaAmbId')?.setValue(item.iUbicaAmbId)
            this.form.get('iUsoAmbId')?.setValue(item.iUsoAmbId)
            this.form.get('iEstadoAmbId')?.setValue(item.iEstadoAmbId)
            this.form.get('iAmbienteAforo')?.setValue(item.iAmbienteAforo)
            this.form.get('iAmbienteArea')?.setValue(item.iAmbienteArea)
            this.form.get('iPisoAmbid')?.setValue(item.iPisoAmbid)
            this.form.get('cAmbienteObs')?.setValue(item.cAmbienteObs)
            this.form.get('bAmbienteEstado')?.setValue(item.bAmbienteEstado)
            if (item.bAmbienteEstado == 1) {
                this.form.get('bAmbienteEstado')?.setValue(1)
            } else {
                this.form.get('bAmbienteEstado')?.setValue(0)
            }
        }
        if (accion === 'agregar') {
            this.visible = true
            this.caption = 'Registrar ambientes'
            this.option = 'crear'
            this.clearForm()
        }
        if (accion === 'eliminar') {
            alert('Desea eliminar')
            const params = {
                esquema: 'acad',
                tabla: 'iiee_ambientes',
                campo: 'iIieeAmbienteId',
                valorId: item.iIieeAmbienteId,
            }
            this.query.deleteAcademico(params).subscribe({
                next: (data: any) => {
                    console.log(data.data)
                },
                error: (error) => {
                    console.error('Error fetching ambiente:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.getAmbientes()
                    this.visible = false
                    this.clearForm()
                },
            })
        }
        if (accion === 'retornar') {
            alert('Desea retornar')
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    accionBtnItem(accion) {
        if (accion === 'guardar') {
            this.visible = true
            this.caption = 'Registrar ambientes'
            if (this.form.valid) {
                console.log(this.form.value)
                //ALMACENAR LA INFORMACION
                console.log(this.form)
                this.query
                    .addAmbienteAcademico({
                        json: JSON.stringify(this.form.value),
                        _opcion: 'addAmbiente',
                    })
                    .subscribe({
                        next: (data: any) => {
                            console.log(data, 'id', data.data[0].id)
                            console.log(data.data)
                        },
                        error: (error) => {
                            console.error('Error fetching ambiente:', error)
                        },
                        complete: () => {
                            console.log('Request completed')
                            this.getAmbientes()
                            this.visible = false
                            this.clearForm()
                        },
                    })
            } else {
                console.log('Formulario no válido', this.form.invalid)
            }
        }
        //updateAcademico
        if (accion === 'editar') {
            alert('vas a modificar')
            if (this.form.valid) {
                const params = {
                    esquema: 'acad',
                    tabla: 'iiee_ambientes',
                    json: JSON.stringify({
                        iTipoAmbienteId:
                            this.form.get('iTipoAmbienteId')?.value,
                        iEstadoAmbId: this.form.get('iEstadoAmbId')?.value,
                        iUbicaAmbId: this.form.get('iUbicaAmbId')?.value,
                        iUsoAmbId: this.form.get('iUsoAmbId')?.value,
                        iPisoAmbid: this.form.get('iPisoAmbid')?.value,
                        iYAcadId: this.form.get('iYAcadId')?.value,
                        iSedeId: this.form.get('iSedeId')?.value,
                        bAmbienteEstado:
                            this.form.get('bAmbienteEstado')?.value,
                        cAmbienteNombre:
                            this.form.get('cAmbienteNombre')?.value,
                        cAmbienteDescripcion: this.form.get(
                            'cAmbienteDescripcion'
                        )?.value,
                        iAmbienteArea: this.form.get('iAmbienteArea')?.value,
                        iAmbienteAforo: this.form.get('iAmbienteAforo')?.value,
                        cAmbienteObs: this.form.get('cAmbienteObs')?.value,
                    }),
                    campo: 'iIieeAmbienteId',
                    condicion: this.form.get('iIieeAmbienteId')?.value,
                }

                console.log(params, 'parametros dem uodate')
                this.query.updateAcademico(params).subscribe({
                    next: (data: any) => {
                        console.log(data.data)
                    },
                    error: (error) => {
                        console.error('Error fetching ambiente:', error)
                    },
                    complete: () => {
                        console.log('Request completed')
                        this.getAmbientes()
                        this.visible = false
                        this.clearForm()
                    },
                })
            } else {
                console.log('Formulario no válido', this.form.invalid)
            }
        }
    }
    clearForm() {
        this.form.get('iIieeAmbienteId')?.setValue(0)
        this.form.get('cAmbienteNombre')?.setValue('')
        this.form.get('cAmbienteDescripcion')?.setValue('')
        this.form.get('iTipoAmbienteId')?.setValue(0)
        this.form.get('iUbicaAmbId')?.setValue(0)
        this.form.get('iUsoAmbId')?.setValue(0)
        this.form.get('iEstadoAmbId')?.setValue(0)
        this.form.get('iAmbienteAforo')?.setValue('')
        this.form.get('iAmbienteArea')?.setValue('')
        this.form.get('iPisoAmbid')?.setValue(0)
        this.form.get('cAmbienteObs')?.setValue('')
        this.form.get('bAmbienteEstado')?.setValue(0)
    }
    confirm() {
        console.log('confirmando')
        const message: informationMessage = {
            header: '¿Desea guardar información?',
            message: 'Por favor, confirme para continuar.',
            accept: {
                severity: 'success',
                summary: 'Año',
                detail: 'Se ha guardado correctamente.',
                life: 6000,
            },
            reject: {
                severity: 'warn',
                summary: 'Año',
                detail: 'Se ha cancelado guardar la información.',
                life: 3000,
            },
        }

        this.msg.confirmAction(
            {onAcceptCallbacks:[() => this.saveInformation(), () => this.nextPage()]},
            message
        )
    }
    saveInformation() {
        if (this.caption == 'create') {
            alert('Mensaje 0 save')
        } else {
            alert('Mensaje 1 save')
        }
    }
    nextPage() {
        alert('mensaje de next')
    }

    //ESTRUCTURASS DE TABLA
    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Crear Ambiente',
            text: 'Crear ambientes',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Retornar',
            text: 'Retornar',
            icon: 'pi pi-plus',
            accion: 'retornar',
            class: 'p-button-warning',
        },
        // {
        //     labelTooltip: 'Unificar Ambiente',
        //     text: 'Unificar ambientes',
        //     icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
        //     accion: 'unificar',
        //     class: 'p-button-secondary',
        // },
        // {
        //     labelTooltip: 'Dividir Ambiente',
        //     text: 'Dividir ambientes',
        //     icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
        //     accion: 'dividir',
        //     class: 'p-button-secondary',
        // },
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
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        // {
        //     type: 'checkbox',
        //     width: '2rem',
        //     field: 'checked',
        //     header: '',
        //     text_header: '',
        //     text: 'left',
        // },
        {
            type: 'text',
            width: '5rem',
            field: 'iIieeAmbienteId',
            header: 'Cod',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cAmbienteNombre',
            header: 'Ambiente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iAmbienteArea',
            header: 'Area m2',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iAmbienteAforo',
            header: 'Aforo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTipoAmbienteNombre',
            header: 'Tipo de ambiente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cEstadoAmbNombre',
            header: 'Condición',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cUbicaAmbNombre',
            header: 'Ubicación',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '5rem',
            field: 'bAmbienteEstado',
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
    ]
}
