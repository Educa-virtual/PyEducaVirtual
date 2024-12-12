import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { InputNumberModule } from 'primeng/inputnumber'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-ies-personal',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        InputNumberModule,
        TablePrimengComponent,
    ],
    templateUrl: './ies-personal.component.html',
    styleUrl: './ies-personal.component.scss',
})
export class IesPersonalComponent implements OnInit {
    form: FormGroup

    sede: any[]
    iSedeId: number
    iYAcadId: number
    personal_ies: any[]
    option: boolean = false

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

    personas: Array<object>
    docentes: Array<object>
    lista: Array<object>
    cargos: Array<object>

    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private store: LocalStoreService
        // private confirmationService: ConfirmationService,
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        // console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
        this.iYAcadId = this.store.getItem('dremoYear')
    }

    ngOnInit(): void {
        console.log('implemntacion')
        this.searchPersonal()
        this.getPersonas()
        this.getDocente()
        this.getCargos()

        try {
            this.form = this.fb.group({
                iPersIeId: [0], // PK tabla acad.personal_ies
                iPersId: [{ value: 0, disabled: true }], // FK tabla grl.persona
                iYAcadId: [this.iYAcadId], // FK tabla acad.year_academico
                iPersCargoId: [0], // FK tabla acad.personal_cargos
                iSedeId: [this.iSedeId], // FK tabla acad.sedes
                iHorasLabora: [
                    0,
                    [
                        Validators.pattern(/^\d+$/),
                        Validators.min(1),
                        Validators.max(40),
                    ],
                ],

                dtInicio: [''],
                dtFin: [''],
                cResolucion: [''],
                iCodigoNexus: [],
                cObservacion: [''],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.c_accion = accion
            this.caption = 'Editar cargo a personal'
            //cargar valores
            this.form.get('iPersId')?.setValue(item.iPersId)
            this.form.get('iPersId')?.disable()
            this.form.get('iPersIeId')?.setValue(item.iPersIeId)
            this.form.get('iPersCargoId')?.setValue(item.iPersCargoId)
            this.form.get('iHorasLabora')?.setValue(item.iHorasLabora)

            this.visible = true
            console.log(item, 'btnTable')
        }
        if (accion === 'agregar') {
            this.c_accion = accion
            this.form.get('iPersId')?.enable()
            this.caption = 'Asignar cargo a personal'
            this.clearForm()
            this.visible = true
        }
        if (accion === 'eliminar') {
            this.confirmPersonal(item.iPersIeId)
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                this.addPersonal()
                this.searchPersonal()
                this.visible = false
                break
            case 'editar':
                this.updatePersonal()
                this.searchPersonal()
                this.visible = false
                break
        }
    }

    onCargoSeleccionado(event: any): void {
        const id = event.value
        if (id == 3) {
            // 3 es id de docente
            this.lista = this.docentes
            this.form.get('iPersId')?.enable()
            this.option = true
        } else {
            this.lista = this.personas
            this.form.get('iPersId')?.enable()
            this.option = false
        }
    }

    searchPersonal() {
        this.query
            .searchPersonalIes({
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data

                    this.personal_ies = item.map((persona) => ({
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

                    console.log(this.personal_ies, 'personal ies')
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
    addPersonal() {
        this.query
            .addMaestro({
                esquema: 'acad',
                tabla: 'personal_ies',
                datosJSON: JSON.stringify({
                    iPersId: this.form.value.iPersId,
                    iYAcadId: this.form.value.iYAcadId,
                    iPersCargoId: this.form.value.iPersCargoId,
                    iSedeId: this.form.value.iSedeId,
                    iHorasLabora: this.form.value.iHorasLabora,
                }),
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'agregar personal')
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    updatePersonal() {
        if (this.form.valid) {
            const params = {
                esquema: 'acad',
                tabla: 'personal_ies',
                json: JSON.stringify({
                    iPersCargoId: this.form.value.iPersCargoId,
                    iHorasLabora: this.form.value.iHorasLabora,
                }),
                campo: 'iPersIeId',
                condicion: this.form.get('iPersIeId')?.value,
            }

            console.log(params, 'parametros dem uodate')
            this.query.updateAcademico(params).subscribe({
                next: (data: any) => {
                    console.log(data.data)
                },
                error: (error) => {
                    console.log(error, 'error al actualizar')
                    // if(error && error.message){
                    //   //  console.error(error?.message || 'Error en la respuesta del servicio');
                    // }
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                },
            })
        } else {
            console.log('Formulario no válido', this.form.invalid)
        }
    }

    confirmPersonal(recordId: number) {
        this._confirmService.openConfirm({
            message: '¿Estás seguro de que deseas eliminar este registro?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Acción para eliminar el registro
                this.deletePersonal(recordId)
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
    deletePersonal(id: number) {
        const params = {
            esquema: 'acad',
            tabla: 'personal_ies',
            campo: 'iPersIeId',
            valorId: id,
        }
        this.query.deleteAcademico(params).subscribe({
            next: (data: any) => {
                console.log(data.data)
            },
            error: (error) => {
                console.error('Error fetching ambiente:', error)
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Registro eliminado correctamente',
                })
                console.log('Request completed')
                this.searchPersonal()
            },
        })
    }
    clearForm() {
        // limpiar valores
        this.form.get('iPersId')?.setValue(0)
        this.form.get('iPersIeId')?.setValue(0)
        this.form.get('iPersCargoId')?.setValue(0)
        this.form.get('iHorasLabora')?.setValue(0)
    }

    getPersonas() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'personas',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.personas = item.map((persona) => ({
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
                    console.log(this.personas, 'personas')
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getDocente() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iDocenteId: 0,
                }),
                _opcion: 'getDocentes',
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
                    console.log(this.docentes, 'docentes')
                    //   console.log(this.seccionesAsignadas,' seccionesAsignadas')
                },
                error: (error) => {
                    console.error('Error fetching  seccionesAsignadas:', error)
                },
                complete: () => {},
            })
    }

    // detalleMaestro(){
    //     const datos= []
    //     this.query.searchTablaXwhere({
    //         Esquema: 'aula',
    //         TablaMaestra: 'foros',
    //         DatosJSONDetalles: JSON.stringify([ { iEstudianteId: 2, iDocenteId : 1},{ iEstudianteId: 24, iDocenteId : 1}]),
    //         TablaDetalle: 'foro_respuestas',
    //         DatosJSONMaestro: JSON.stringify({
    //             "cForoTitulo":datos.cForoTitulo,
    //             "cForoDescripcion": datos.cForoDescripcion,
    //             "iForoCatId": datos.iForoCatId,
    //             "dtForoInicio":new Date(datos.dtForoInicio),
    //             "iEstado":1,
    //             "dtForoPublicacion":new Date(datos.dtForoPublicacion),
    //             "dtForoFin": new Date(datos.dtForoFin),
    //             "cForoUrl": datos.cForoUrl,
    //             "cForoCatDescripcion":datos.cForoCatDescripcionl,
    //             "dtInicio": new Date(datos.dtInicio),
    //             "dtFin": new Date(datos.dtFin)}),
    //         campoFK : 'iForoId'
    //     })
    //     .subscribe({
    //         next: (data: any) => {
    //             this.cargos = data.data

    //             console.log(this.cargos, ' lista de cargos')
    //         },
    //         error: (error) => {
    //             console.error('Error fetching Años Académicos:', error)
    //         }
    //     })
    // }

    getCargos() {
        this.query
            .searchTablaXwhere({
                esquema: 'acad',
                tabla: 'personal_cargos',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    this.cargos = data.data

                    console.log(this.cargos, ' lista de cargos')
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Asignar personal',
            text: 'Asignar personal',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Clonar personal',
            text: 'Clonar personal',
            icon: 'pi pi-copy',
            accion: 'clonar',
            class: 'p-button-warning',
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
            width: '5rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPersCargoNombre',
            header: 'Cargo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
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
