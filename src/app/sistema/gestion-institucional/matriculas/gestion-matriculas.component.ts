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
    selector: 'app-gestion-matriculas',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        InputNumberModule,
        TablePrimengComponent,
    ],
    templateUrl: './gestion-matriculas.component.html',
    styleUrl: './gestion-matriculas.component.scss',
})
export class GestionMatriculasComponent implements OnInit {
    formMatricula: FormGroup
    formEstudiante: FormGroup
    formRepresentante: FormGroup

    activeStep: number = 0 // Paso activo
    totalSteps = 3 // Total de pasos del stepper

    sede: any[]
    iSedeId: number
    iYAcadId: number
    matriculas: any[]
    option: boolean = false

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

    tipo_documentos: Array<object>
    nivel_grados: Array<object>
    turnos: Array<object>
    secciones: Array<object>
    tipo_matriculas: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private store: LocalStoreService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
    }

    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }

    ngOnInit(): void {
        this.iYAcadId = this.store.getItem('dremoiYAcadId')

        this.searchMatriculas()
        this.getTipoDocumento()
        this.getNivelGrados()
        this.getTurnos()
        this.getEstadosCiviles()
        this.getTipoMatricula()
        this.sexos = [
            { nombre: 'MASCULINO', id: 'M' },
            { nombre: 'FEMENINO', id: 'F' },
        ]

        try {
            this.formMatricula = this.fb.group({
                iMatrId: [0], // PK tabla matricula
                iEstudianteId: [{ value: 0, disabled: true }], // FK tabla grl.persona para estudiante
                iNivelGradoId: [0, Validators.required], // FK tabla acad.nivel_grados
                iTurnoId: [0, Validators.required], // FK tabla acad.turno
                iSeccionId: [0, Validators.required], // FK tabla acad.seccion
                dtMatrFecha: ['', Validators.required],
                iTipoMatrId: [0, Validators.required], // FK tabla acad.tipo_matricula
                bMatrDiscap: [false],
                bMatrPariente: [false],
                cObservacion: [''],
            })
            this.formEstudiante = this.fb.group({
                iEstudianteId: [{ value: 0, disabled: true }], // FK tabla grl.persona para estudiante
                iPersIdEstudiante: [{ value: 0, disabled: true }], // FK tabla grl.persona para estudiante
                iTipoIdentIdEstudiante: [0, Validators.required],
                cPersDocumentoEstudiante: ['', Validators.required],
                cPersNombreEstudiante: ['', Validators.required],
                cPersPaternoEstudiante: ['', Validators.required],
                cPersMaternoEstudiante: [''],
                dPersNacimientoEstudiante: ['', Validators.required],
                cPersSexoEstudiante: ['', Validators.required],
                iTipoEstCivIdEstudiante: [0],
            })
            this.formRepresentante = this.fb.group({
                iPersIdRepresentante: [{ value: 0, disabled: true }], // FK tabla grl.persona para representante
                iTipoIdentIdRepresentante: [0, Validators.required],
                cPersDocumentoRepresentante: ['', Validators.required],
                cPersNombreRepresentante: ['', Validators.required],
                cPersPaternoRepresentante: ['', Validators.required],
                cPersMaternoRepresentante: [''],
                dPersNacimientoRepresentante: ['', Validators.required],
                cPersSexoRepresentante: ['', Validators.required],
                iTipoEstCivIdRepresentante: [0],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.c_accion = accion
            this.caption = 'Editar solicitud'
            this.visible = true
        }
        if (accion === 'agregar') {
            this.c_accion = accion
            this.formMatricula.get('iMatrId')?.enable()
            this.caption = 'Registrar solicitud'
            this.clearForm()
            this.visible = true
        }
        if (accion === 'eliminar') {
            this.confirmSolicitud(item.iMatrId)
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'validar_estudiante':
                this.validarEstudiante()
                break
            case 'validar_representante':
                this.validarRepresentante()
                break
            case 'guardar':
                this.addSolicitud()
                this.visible = false
                break
            case 'editar':
                this.updateSolicitud()
                this.getTipoDocumento()
                this.visible = false
                break
        }
    }

    onTipoIdentificacionSeleccionado(event: any): void {
        // const id = event.value
        console.log(event)
        // validar longitud de documento de identificacion
    }

    searchMatriculas() {
        this.query
            .searchMatriculas({
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    this.matriculas = data.data
                    console.log(this.matriculas, 'matriculas')
                },
                error: (error) => {
                    console.error('Error al obtener matriculas:', error)
                },
                complete: () => {},
            })
    }

    // Función para manejar el botón de "Siguiente"
    handleNext() {
        if (this.activeStep === 0) {
            if (this.formEstudiante.invalid) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Rellenar los campos',
                    detail: 'Rellene todos los campos para continuar',
                })
                // Marca los campos como tocados para que se muestren los errores
                this.formEstudiante.markAllAsTouched()
                return
            }
        } else if (this.activeStep === 1) {
            if (this.formRepresentante.invalid) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Rellenar los campos',
                    detail: 'Rellene todos los campos para continuar',
                })
                // Marca los campos como tocados para que se muestren los errores
                this.formRepresentante.markAllAsTouched()
                return
            }
        } else if (this.activeStep === 2) {
            if (this.formMatricula.invalid) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Rellenar los campos',
                    detail: 'Rellene todos los campos para registrar la matrícula',
                })
                // Marca los campos como tocados para que se muestren los errores
                this.formMatricula.markAllAsTouched()
                return
            }
        }

        // Pasar al siguiente paso
        if (this.activeStep < this.totalSteps - 1) {
            this.activeStep++
            return
        }
    }
    // Función para manejar el botón "Atrás"
    handlePrevious() {
        if (this.activeStep > 0) {
            this.activeStep--
        }
    }

    addSolicitud() {
        this.query
            .guardarMatricula({
                matricula: JSON.stringify({
                    iMatrId: this.formMatricula.value.iMatrId,
                    iTipoMatrId: this.formMatricula.value.iTipoMatrId,
                    iNivelGradoId: this.formMatricula.value.iGradoId,
                    iTurnoId: this.formMatricula.value.iTurnoId,
                    iSeccionId: this.formMatricula.value.iSeccionId,
                    iEstudianteId: this.formMatricula.value.iEstudianteId,
                }),
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'agregar solicitud')
                },
                error: (error) => {
                    console.error('Error agregando solicitud:', error)
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
    updateSolicitud() {
        if (this.formMatricula.valid) {
            const params = {
                esquema: 'acad',
                tabla: 'matricula',
                json: JSON.stringify({
                    iGradoId: this.formMatricula.value.iGradoId,
                    iTipoMatrId: this.formMatricula.value.iTipoMatrId,
                    iTurnoId: this.formMatricula.value.iTurnoId,
                }),
                campo: 'iMatrId',
                condicion: this.formMatricula.get('iMatrId')?.value,
            }

            console.log(params, 'parametros update')
            this.query.updateAcademico(params).subscribe({
                next: (data: any) => {
                    console.log(data.data)
                },
                error: (error) => {
                    console.log(error, 'error al actualizar')
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
            console.log('Formulario no válido', this.formMatricula.invalid)
        }
    }

    confirmSolicitud(recordId: number) {
        this._confirmService.openConfirm({
            message: '¿Estás seguro de que deseas eliminar esta solicitud?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteSolicitud(recordId)
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }
    deleteSolicitud(id: number) {
        const params = {
            esquema: 'acad',
            tabla: 'matricula',
            campo: 'iMatrId',
            valorId: id,
        }
        this.query.deleteMatricula(params).subscribe({
            next: (data: any) => {
                console.log(data.data)
            },
            error: (error) => {
                console.error('Error eliminando solicitud de matricula:', error)
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Registro eliminado correctamente',
                })
                console.log('Request completed')
            },
        })
    }
    clearForm() {
        this.formEstudiante.reset()
        this.formRepresentante.reset()
        this.formMatricula.reset()
        this.formMatricula.get('iMatrId')?.setValue(0)
        this.formMatricula.get('iEstudianteId')?.setValue(0)
        this.formEstudiante.get('iPersIdEstudiante')?.setValue(0)
        this.formRepresentante.get('iPersIdRepresentante')?.setValue(0)
    }

    getTipoDocumento() {
        this.query.getTipoIdentificaciones({}).subscribe({
            next: (data: any) => {
                const item = data.data
                this.tipo_documentos = item.map((tipo_documento) => ({
                    iTipoIdentId: tipo_documento.iTipoIdentId,
                    cTipoIdentNombre: tipo_documento.cTipoIdentNombre,
                    cTipoIdentSigla: tipo_documento.cTipoIdentSigla,
                }))
                console.log(this.tipo_documentos, 'tipos de documentos')
            },
            error: (error) => {
                console.error('Error procedimiento BD:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }

    getNivelGrados() {
        this.query
            .searchGradoCiclo({
                iNivelTipoId: 3,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.nivel_grados = item.map((grado) => ({
                        iNivelGradoId: grado.iNivelGradoId,
                        cGradoNombre: grado.cGradoNombre,
                        cGradoAbreviacion: grado.cGradoAbreviacion,
                        cNivelGrado:
                            grado.cNivelTipoNombre +
                            ' ' +
                            grado.cGradoAbreviacion +
                            ' (' +
                            grado.cGradoNombre +
                            ')',
                    }))
                    console.log(this.nivel_grados, 'nivel grados')
                },
                error: (error) => {
                    console.error('Error consultando nivel grados:', error)
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

    getTurnos() {
        this.query.getTurnos({}).subscribe({
            next: (data: any) => {
                const item = data.data.turnos
                this.turnos = item.map((turno) => ({
                    iTurnoId: turno.iTurnoId,
                    cTurnoNombre: turno.cTurnoNombre,
                }))
                console.log(this.turnos, 'turnos')
            },
            error: (error) => {
                console.error('Error obteniendo turnos:', error)
            },
            complete: () => {},
        })
    }

    getEstadosCiviles() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'tipos_estados_civiles',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.estados_civiles = item.map((estado_civil) => ({
                        iTipoEstCivId: estado_civil.iTipoEstCivId,
                        cTipoEstCivilNombre: estado_civil.cTipoEstCivilNombre,
                    }))
                    console.log(this.estados_civiles, 'estados civiles')
                },
                error: (error) => {
                    console.error('Error obteniendo estados civiles:', error)
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

    getTipoMatricula() {
        this.query
            .searchTablaXwhere({
                esquema: 'acad',
                tabla: 'tipo_matriculas',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.tipo_matriculas = item.map((tipo_matricula) => ({
                        iTipoMatrId: tipo_matricula.iTipoMatrId,
                        cTipoMatrNombre: tipo_matricula.cTipoMatrNombre,
                    }))
                    console.log(this.tipo_matriculas, 'tipos de matriculas')
                },
                error: (error) => {
                    console.error(
                        'Error obteniendo tipos de matriculas:',
                        error
                    )
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

    validarEstudiante() {
        this.query
            .validarEstudiante({
                iTipoIdentId: this.formEstudiante.value.iTipoIdentIdEstudiante,
                cPersDocumento:
                    this.formEstudiante.value.cPersDocumentoEstudiante,
            })
            .subscribe({
                next: (data: any) => {
                    const persona = data.data.persona
                    const estudiante = data.data.estudiante
                    this.formEstudiante
                        .get('iEstudianteId')
                        ?.setValue(estudiante.iEstudianteId)
                    this.formEstudiante
                        .get('iPersIdEstudiante')
                        ?.setValue(persona.iPersId)
                    this.formEstudiante
                        .get('cPersNombreEstudiante')
                        ?.setValue(persona.cPersNombre)
                    this.formEstudiante
                        .get('cPersPaternoEstudiante')
                        ?.setValue(persona.cPersPaterno)
                    this.formEstudiante
                        .get('cPersMaternoEstudiante')
                        ?.setValue(persona.cPersMaterno)
                    this.formEstudiante
                        .get('dPersNacimientoEstudiante')
                        ?.setValue(
                            persona ? new Date(persona.dPersNacimiento) : null
                        )
                    this.formEstudiante
                        .get('cPersSexoEstudiante')
                        ?.setValue(persona.cPersSexo)
                    this.formEstudiante
                        .get('iTipoEstCivIdEstudiante')
                        ?.setValue(persona.iTipoEstCivId)
                },
                error: (error) => {
                    console.error('Error validando estudiante:', error)
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

    validarRepresentante() {
        this.query
            .validarRepresentante({
                iTipoIdentId:
                    this.formRepresentante.value.iTipoIdentIdRepresentante,
                cPersDocumento:
                    this.formRepresentante.value.cPersDocumentoRepresentante,
            })
            .subscribe({
                next: (data: any) => {
                    const persona = data.data.persona
                    this.formRepresentante
                        .get('iPersIdRepresentante')
                        ?.setValue(persona.iPersId)
                    this.formRepresentante
                        .get('cPersNombreRepresentante')
                        ?.setValue(persona.cPersNombre)
                    this.formRepresentante
                        .get('cPersPaternoRepresentante')
                        ?.setValue(persona.cPersPaterno)
                    this.formRepresentante
                        .get('cPersMaternoRepresentante')
                        ?.setValue(persona.cPersMaterno)
                    this.formRepresentante
                        .get('dPersNacimientoRepresentante')
                        ?.setValue(
                            persona ? new Date(persona.dPersNacimiento) : null
                        )
                    this.formRepresentante
                        .get('cPersSexoRepresentante')
                        ?.setValue(persona.cPersSexo)
                    this.formRepresentante
                        .get('iTipoEstCivIdRepresentante')
                        ?.setValue(persona.iTipoEstCivId)
                    console.log(data.data, 'datos del representante')
                },
                error: (error) => {
                    console.error('Error validando representante:', error)
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
            labelTooltip: 'Registrar solicitud',
            text: 'Registrar solicitud',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
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
            labelTooltip: 'Registrar',
            icon: 'pi pi-plus',
            accion: 'registrar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
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
            width: '5rem',
            field: 'cTurnoNombre',
            header: 'Turno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cGradoAbreviacion',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'cSeccionNombre',
            header: 'Seccion',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'iDetConfCantEstudiantes',
            header: 'Vacantes',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'inscritos',
            header: 'Matriculados',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'boolean',
            width: '5rem',
            field: 'bAmbienteEstado',
            header: 'Estado',
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
