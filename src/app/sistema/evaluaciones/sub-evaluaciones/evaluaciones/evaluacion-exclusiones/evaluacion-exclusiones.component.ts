import { PrimengModule } from '@/app/primeng.module'
import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { EvaluacionExclusionesService } from '../../../services/evaluacion-exclusiones.service'
import { MenuItem, MessageService } from 'primeng/api'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles'
import { TextFieldModule } from '@angular/cdk/text-field'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-evaluacion-exclusiones',
    standalone: true,
    imports: [PrimengModule, TextFieldModule, TablePrimengComponent],
    templateUrl: './evaluacion-exclusiones.component.html',
    styleUrl: './evaluacion-exclusiones.component.scss',
})
export class EvaluacionExclusionesComponent implements OnInit {
    @ViewChild('filtro') filtro: any
    cEvaluacionKey: string
    evaluacion: any
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem
    perfil: any

    formExclusion: FormGroup
    exclusiones: Array<any>
    exclusiones_filtradas: Array<any>
    exclusion_registrada: boolean = false
    exclusion_bloqueada: boolean = false

    dialog_header: string
    dialog_visible: boolean

    es_director: boolean = false

    longitud_documento = 7
    formato_documento = '99999999'
    tipos_documentos: Array<object>

    private _messageService = inject(MessageService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private exclusionesService: EvaluacionExclusionesService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private store: LocalStoreService,
        private cf: ChangeDetectorRef
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.es_director = Number(this.perfil.iPerfilId) === Number(DIRECTOR_IE)
        this.route.paramMap.subscribe((params) => {
            this.cEvaluacionKey = params.get('iEvaluacionId')
        })
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    ngOnInit() {
        try {
            this.formExclusion = this.fb.group({
                iCredEntPerfId: [
                    this.perfil.iCredEntPerfId,
                    Validators.required,
                ],
                iEvaluacionId: [null, Validators.required],
                iEvalExcluId: [null],
                cEvalExcluMotivo: [null, Validators.required],
                dEvalExcluArchivo: [null],
                cEstCodigo: [null],
                cIieeDatos: [null],
                cPersDatos: [null, Validators.required],
                iTipoIdentId: [null],
                cPersDocumento: [null],
                iMatrId: [null, Validators.required],
            })
        } catch (error) {
            console.error('Error al crear el formulario:', error)
        }

        this.exclusionesService.getTiposDocumentos().subscribe({
            next: (data: any) => {
                this.tipos_documentos = data.data.map((doc: any) => ({
                    value: doc.iTipoIdentId,
                    label: doc.cTipoIdentSigla + ' - ' + doc.cTipoIdentNombre,
                    longitud: doc.iTipoIdentLongitud,
                }))
                this.tipos_documentos.unshift({
                    value: 0,
                    label: 'CODIGO DE ESTUDIANTE',
                    longitud: 15,
                })
            },
            error: (error) => {
                console.error('Error obteniendo tipos de documentos:', error)
            },
        })

        if (this.cEvaluacionKey) {
            this.obtenerEvaluacion()
            this.listarExclusiones()
        }

        this.formExclusion
            .get('iTipoIdentId')
            .valueChanges.subscribe((value) => {
                const tipo_doc = this.tipos_documentos.find(
                    (item: any) => item.value === value
                )
                if (tipo_doc) {
                    const longitud =
                        this.formExclusion.get('cPersDocumento')?.value
                    if (longitud && longitud.length > tipo_doc['longitud']) {
                        this.formExclusion.get('cPersDocumento').setValue(null)
                    }
                    this.longitud_documento = tipo_doc['longitud']
                    this.formato_documento = '9'.repeat(this.longitud_documento)
                }
            })
    }

    obtenerEvaluacion() {
        this.exclusionesService.verEvaluacion(this.cEvaluacionKey).subscribe({
            next: (data: any) => {
                if (data.data) {
                    this.evaluacion = data.data
                    if (this.evaluacion) {
                        this.breadCrumbItems = [
                            {
                                label: 'Evaluaciones',
                                routerLink: ['/ere/evaluaciones'],
                            },
                            {
                                label: this.evaluacion?.cEvaluacionNombre,
                            },
                            {
                                label: 'Gestionar exclusiones',
                            },
                        ]
                    }
                }
            },
            error: (error) => {
                console.error('Error obteniendo evaluación:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                })
            },
        })
    }

    listarExclusiones() {
        this.exclusionesService
            .listarExclusiones({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEvaluacionId: this.cEvaluacionKey,
            })
            .subscribe({
                next: (data: any) => {
                    this.exclusiones = data.data
                    this.exclusiones_filtradas = this.exclusiones
                },
                error: (error) => {
                    console.error('Error obteniendo exclusiones:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    agregarExclusion() {
        this.dialog_header = 'Registrar exclusión'
        this.dialog_visible = true
        this.exclusion_bloqueada = false
    }

    dialogVisible(visible: boolean) {
        this.dialog_visible = visible
    }

    filtrarExclusiones() {
        const filtro = this.filtro.nativeElement.value.toLowerCase()
        this.exclusiones_filtradas = this.exclusiones.filter((ex) => {
            if (ex.cEstCodigo.toLowerCase().includes(filtro)) return ex
            if (ex.cPersNombreApellidos.toLowerCase().includes(filtro))
                return ex
            if (ex.cGradoNombre.toLowerCase().includes(filtro)) return ex
            if (ex.cSeccionNombre.toLowerCase().includes(filtro)) return ex
            if (ex.cIieeCodigoModular.toLowerCase().includes(filtro)) return ex
            if (ex.cIieeNombre.toLowerCase().includes(filtro)) return ex
            return null
        })
    }

    editarExclusion(data: any) {
        this.dialog_header = 'Editar exclusión'
        this.dialog_visible = true
        this.obtenerExclusion(data)
        this.exclusion_bloqueada = false
    }

    verExclusion(data: any) {
        this.dialog_header = 'Ver exclusión'
        this.dialog_visible = true
        this.obtenerExclusion(data)
        this.exclusion_bloqueada = true
    }

    obtenerExclusion(data: any) {
        this.exclusionesService
            .verExclusion({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEvalExcluId: data.iEvalExcluId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data) {
                        this.setFormExclusion(data.data)
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    handleArchivo(event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.formExclusion.patchValue({
            cEvalExcluArchivo: file,
        })
    }

    setFormExclusion(data: any) {
        const es_codigo = this.formExclusion.value.iTipoIdentId === 0
        this.formExclusion.reset()
        this.formExclusion.patchValue({
            iCredEntPerfId: this.perfil.iCredEntPerfId,
            iEvaluacionId: this.evaluacion.iEvaluacionId,
            iEvalExcluId: data ? data.iEvalExcluId : null,
            cPersDatos: data
                ? data?.cPersNombreApellidos +
                  ' (' +
                  data?.cGradoNombre +
                  ' ' +
                  data?.cSeccionNombre +
                  ')'
                : null,
            cIieeDatos: data
                ? data?.cIieeCodigoModular + ' ' + data?.cIieeNombre
                : null,
            cEvalExcluMotivo: data ? data?.cEvalExcluMotivo : null,
            dEvalExcluArchivo: data ? data?.dEvalExcluArchivo : null,
            iMatrId: data ? data?.iMatrId : null,
            iTipoIdentId: data ? (es_codigo ? 0 : data?.iTipoIdentId) : null,
            cPersDocumento: data
                ? es_codigo
                    ? data?.cEstCodigo
                    : data?.cPersDocumento
                : null,
        })
        this.exclusion_registrada = this.formExclusion.value.iEvalExcluId
            ? true
            : false
        this.exclusionesService.formMarkAsDirty(this.formExclusion)
        if (this.exclusion_bloqueada) {
            this.formExclusion.disable()
        } else {
            this.formExclusion.enable()
        }
        this.cf.detectChanges()
    }

    getFormData() {
        const formData: FormData = new FormData()
        formData.append(
            'cEvalExcluArchivo',
            this.formExclusion.controls['cEvalExcluArchivo'].value
        )
        formData.append('iCredEntPerfId', this.perfil.iCredEntPerfId)
        formData.append('iEvaluacionId', this.evaluacion.iEvaluacionId)
        formData.append(
            'iEvalExcluId',
            this.formExclusion.controls['iEvalExcluId'].value
        )
        formData.append(
            'cEvalExcluMotivo',
            this.formExclusion.controls['cEvalExcluMotivo'].value
        )
        formData.append(
            'dEvalExcluArchivo',
            this.formExclusion.controls['dEvalExcluArchivo'].value
        )
        formData.append('iMatrId', this.formExclusion.controls['iMatrId'].value)
        return formData
    }

    guardarExclusion() {
        if (this.formExclusion.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar todos los campos obligatorios',
            })
            this.exclusionesService.formMarkAsDirty(this.formExclusion)
            return
        }
        this.exclusionesService
            .guardarExclusion(this.formExclusion.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Registro exitoso',
                        detail: 'Se registraron los datos',
                    })
                    this.salir()
                    this.listarExclusiones()
                },
                error: (error) => {
                    console.error('Error guardando encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    actualizarExclusion() {
        if (this.formExclusion.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar todos los campos obligatorios',
            })
            this.exclusionesService.formMarkAsDirty(this.formExclusion)
            return
        }
        this.exclusionesService
            .actualizarExclusion(this.formExclusion.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    this.salir()
                    this.listarExclusiones()
                },
                error: (error) => {
                    console.error('Error actualizando encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    buscarMatricula() {
        const tipo_doc = Number(this.formExclusion.value.iTipoIdentId)
        this.exclusionesService
            .buscarMatricula({
                iYAcadId: this.store.getItem('dremoiYAcadId'),
                iSedeId: this.perfil?.iSedeId,
                cEstCodigo:
                    tipo_doc === 0
                        ? this.formExclusion.value.cPersDocumento
                        : null,
                iTipoIdentId:
                    tipo_doc > 0 ? this.formExclusion.value.iTipoIdentId : null,
                cPersDocumento:
                    tipo_doc > 0
                        ? this.formExclusion.value.cPersDocumento
                        : null,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data) {
                        this.setFormExclusion(data.data)
                    } else {
                        this.setFormExclusion(null)
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se encontró la matricula',
                        })
                    }
                },
                error: (error) => {
                    this.setFormExclusion(null)
                    console.error('Error obteniendo matricula:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    borrarExclusion(data: any) {
        this.exclusionesService
            .eliminarExclusion({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEvalExcluId: data.iEvalExcluId,
            })
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Eliminación exitosa',
                        detail: 'Se eliminaron los datos',
                    })
                    this.salir()
                },
                error: (error) => {
                    console.error('Error eliminando encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    resetear() {
        this.formExclusion.reset()
        this.formExclusion.patchValue({
            iCredEntPerfId: this.perfil.iCredEntPerfId,
            iEvaluacionId: this.evaluacion.iEvaluacionId,
        })
        this.exclusion_registrada = false
    }

    salir() {
        this.resetear()
        this.dialogVisible(false)
    }

    columnasTabla: any[] = [
        {
            field: 'cEstCodigo',
            type: 'text',
            width: '10%',
            header: 'Código',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombreApellidos',
            type: 'text',
            width: '35%',
            header: 'Estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cGradoNombre',
            type: 'text',
            width: '10%',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cSeccionNombre',
            type: 'text',
            width: '10%',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cIieeCodigoModular',
            type: 'text',
            width: '5%',
            header: 'I.E.',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cIieeNombre',
            type: 'text',
            width: '20%',
            header: 'I.E. Nombre',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: '',
            type: 'actions',
            width: '10%',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            isVisible: () => this.es_director,
        },
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            isVisible: () => !this.es_director,
        },
        {
            labelTooltip: 'Borrar',
            icon: 'pi pi-trash',
            accion: 'borrar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: () => this.es_director,
        },
    ]

    accionBnt(event: { accion: string; item: any }) {
        switch (event.accion) {
            case 'editar':
                this.editarExclusion(event.item)
                break
            case 'ver':
                this.verExclusion(event.item)
                break
            case 'borrar':
                this._confirmService.openConfirm({
                    header: '¿Realmente desea eliminar la exclución seleccionada?',
                    accept: () => {
                        this.borrarExclusion(event.item)
                    },
                })
                break
        }
    }
}
