import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CompartirMatriculasService } from '@/app/sistema/gestion-institucional/services/compartir.matriculas.service'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { InputNumberModule } from 'primeng/inputnumber'

@Component({
    selector: 'app-familia',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        InputNumberModule,
        TablePrimengComponent,
    ],
    templateUrl: './familia.component.html',
    styleUrl: './familia.component.scss',
})
export class FamiliaComponent {
    form: FormGroup

    activeStep: number = 0 // Paso activo
    totalSteps = 3 // Total de pasos del stepper

    familiares: any[]
    option: boolean = false

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

    tipos_familiares: Array<object>
    tipos_documentos: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    tipos_contacto: Array<object>

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private store: LocalStoreService,
        private compartirMatriculasService: CompartirMatriculasService,
        private constantesService: ConstantesService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
    }

    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }

    ngOnInit(): void {
        this.compartirMatriculasService
            .getTiposFamiliares()
            .subscribe((data) => {
                this.tipos_familiares = data
            })
        this.compartirMatriculasService
            .getTiposDocumentos()
            .subscribe((data) => {
                this.tipos_documentos = data
            })
        this.compartirMatriculasService
            .getEstadosCiviles()
            .subscribe((data) => {
                this.estados_civiles = data
            })
        this.compartirMatriculasService
            .getNacionalidades()
            .subscribe((data) => {
                this.nacionalidades = data
            })
        this.compartirMatriculasService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })

        this.sexos = this.compartirMatriculasService.getSexos()
        this.lenguas = this.compartirMatriculasService.getLenguas()

        this.searchFamiliares()

        try {
            this.form = this.fb.group({
                iPersId: [{ value: 0, disabled: true }], // PK
                iTipoFamiliarId: [0, Validators.required],
                iTipoIdentId: [0, Validators.required],
                cPersDocumento: ['', Validators.required],
                cPersNombre: ['', Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                dPersNacimiento: [Validators.required],
                cPersSexo: [null, Validators.required],
                iTipoEstCivId: [0],
                iNacionId: [0],
                iDptoId: [0],
                iPrvnId: [0],
                iDsttId: [0],
                cPersDomicNombre: [''],
                iLenguaId: [0],
                iLenguaSecundariaId: [0],
                iTipoConId: [0],
                cPersConNombre: [0],
                iCredId: this.constantesService.iCredId,
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

        this.form.get('iDptoId').valueChanges.subscribe((value) => {
            this.getProvincias(value)
        })

        this.form.get('iPrvnId').valueChanges.subscribe((value) => {
            this.getDistritos(value)
        })
    }

    accionBtnItemTable({ accion }) {
        if (accion === 'editar') {
            this.c_accion = accion
            this.caption = 'Editar solicitud'
            this.visible = true
        }
        if (accion === 'agregar') {
            this.c_accion = accion
            this.form.get('iPersId')?.enable()
            this.caption = 'Registrar solicitud'
            this.clearForm()
            this.visible = true
        }
        if (accion === 'registrar') {
            this.router.navigate(['/matriculas/procesar'])
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'validar':
                this.validar()
                break
            case 'guardar':
                this.addSolicitud()
                this.visible = false
                break
            case 'editar':
                this.updateSolicitud()
                this.visible = false
                break
        }
    }

    onTipoIdentificacionSeleccionado(event: any): void {
        // const id = event.value
        console.log(event)
        // validar longitud de documento de identificacion
    }

    searchFamiliares() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'personas',
                campos: '*',
                condicion: "cPersDocumento LIKE '%9%'",
            })
            .subscribe({
                next: (data: any) => {
                    this.familiares = data.data
                    console.log(this.familiares, 'familiares')
                },
                error: (error) => {
                    console.error('Error al obtener familiares:', error)
                },
                complete: () => {},
            })
    }

    // Función para manejar el botón de "Siguiente"
    handleNext() {
        if (this.activeStep === 2) {
            if (this.form.invalid) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Rellenar los campos',
                    detail: 'Rellene todos los campos para registrar al familiar del estudiante',
                })
                // Marca los campos como tocados para que se muestren los errores
                this.form.markAllAsTouched()
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
                    iPersId: this.form.value.iPersId,
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
        if (this.form.valid) {
            const params = {
                esquema: 'acad',
                tabla: 'matricula',
                json: JSON.stringify({
                    iGradoId: this.form.value.iGradoId,
                    iTipoMatrId: this.form.value.iTipoMatrId,
                    iTurnoId: this.form.value.iTurnoId,
                }),
                campo: 'iMatrId',
                condicion: this.form.get('iMatrId')?.value,
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
            console.log('Formulario no válido', this.form.invalid)
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
        this.form.reset()
        this.form.get('iPersId')?.setValue(0)
    }

    getProvincias(iDptoId: number) {
        this.compartirMatriculasService.getProvincias(iDptoId).subscribe({
            next: (data) => {
                this.provincias = data
            },
        })
    }

    getDistritos(iPrvnId: number) {
        this.compartirMatriculasService.getDistritos(iPrvnId).subscribe({
            next: (data) => {
                this.distritos = data
            },
        })
    }

    validar() {
        this.query
            .validarEstudiante({
                iTipoIdentId: this.form.value.iTipoIdentId,
                cPersDocumento: this.form.value.cPersDocumento,
            })
            .subscribe({
                next: (data: any) => {
                    const persona = data.data.persona
                    const estudiante = data.data.estudiante
                    this.form
                        .get('iEstudianteId')
                        ?.setValue(estudiante.iEstudianteId)
                    this.form.get('iPersId')?.setValue(persona.iPersId)
                    this.form.get('cPersNombre')?.setValue(persona.cPersNombre)
                    this.form
                        .get('cPersPaterno')
                        ?.setValue(persona.cPersPaterno)
                    this.form
                        .get('cPersMaterno')
                        ?.setValue(persona.cPersMaterno)
                    this.form
                        .get('dPersNacimiento')
                        ?.setValue(
                            persona ? new Date(persona.dPersNacimiento) : null
                        )
                    this.form.get('cPersSexo')?.setValue(persona.cPersSexo)
                    this.form
                        .get('iTipoEstCivId')
                        ?.setValue(persona.iTipoEstCivId)
                },
                error: (error) => {
                    console.error('Error validando familiar:', error)
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
            labelTooltip: 'Registrar familiar',
            text: 'Registrar familiar',
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
            labelTooltip: 'Registrar en esta sección',
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
            type: 'radio',
            width: '5rem',
            field: '',
            header: 'Rep. Legal',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: '',
            header: 'Relación',
            text_header: 'left',
            text: 'left',
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
            width: '10rem',
            field: 'cPersNombre',
            header: 'Nombre Completo',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'boolean',
            width: '5rem',
            field: '',
            header: 'Celular',
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
