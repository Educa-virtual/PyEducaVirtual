import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { DatosSeguimientoBienestarService } from '../services/datos-seguimiento-bienestar.service'
import { TextFieldModule } from '@angular/cdk/text-field'
import { FuncionesBienestarService } from '../services/funciones-bienestar.service'
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes'
import { Dropdown } from 'primeng/dropdown'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-seguimiento-bienestar',
    standalone: true,
    imports: [PrimengModule, TextFieldModule, TablePrimengComponent],
    templateUrl: './seguimiento-bienestar.component.html',
    styleUrl: './seguimiento-bienestar.component.scss',
})
export class SeguimientoBienestarComponent implements OnInit {
    @ViewChild('filtro') filtro: ElementRef
    @ViewChild('filtro_tipo') filtro_tipo: Dropdown
    @ViewChild('filtro_persona') filtro_persona: ElementRef

    perfil: any
    iYAcadId: number

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    visibleDialog: boolean = false
    formSeguimiento: any
    seguimientos: Array<object> = []
    seguimientos_filtrados: Array<object> = []
    seguimiento_registrado: boolean = false
    seguimiento_bloqueado: boolean = false

    visibleDialogPersona: boolean = false
    seguimientos_persona: Array<object> = []
    seguimientos_persona_filtrados: Array<object> = []

    nivel_tipos: Array<object>
    ies: Array<object>

    es_director: boolean = false
    longitud_documento: number = 10
    formato_documento: string = '9999999999'
    tipos_documentos: Array<object>

    tipos_seguimiento: Array<object>
    SEGUIMIENTO_ESTUDIANTE: number =
        this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE
    SEGUIMIENTO_DOCENTE: number = this.datosSeguimiento.SEGUIMIENTO_DOCENTE
    SEGUIMIENTO_DIRECTIVO: number = this.datosSeguimiento.SEGUIMIENTO_DIRECTIVO

    prioridades: Array<object>
    PRIORIDAD_NORMAL: number = this.datosSeguimiento.PRIORIDAD_NORMAL
    PRIORIDAD_ALERTA: number = this.datosSeguimiento.PRIORIDAD_ALERTA
    PRIORIDAD_URGENTE: number = this.datosSeguimiento.PRIORIDAD_URGENTE

    fases: Array<object>
    FASE_ATENDIDO: number = this.datosSeguimiento.FASE_ATENDIDO
    FASE_PENDIENTE: number = this.datosSeguimiento.FASE_PENDIENTE
    FASE_DERIVADO: number = this.datosSeguimiento.FASE_DERIVADO

    private _confirmService = inject(ConfirmationModalService)
    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private datosSeguimiento: DatosSeguimientoBienestarService,
        private funcionesBienestar: FuncionesBienestarService,
        private cf: ChangeDetectorRef
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.es_director = Number(this.perfil.iPerfilId) === Number(DIRECTOR_IE)
        this.breadCrumbItems = [
            {
                label: 'Bienestar Social',
            },
            {
                label: 'Seguimiento de bienestar',
            },
        ]
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    ngOnInit(): void {
        this.formSeguimiento = this.fb.group({
            iCredEntPerfId: [this.perfil.iCredEntPerfId, Validators.required],
            iYAcadId: [this.iYAcadId, Validators.required],
            iNivelTipoId: [null, Validators.required],
            iSedeId: [null, Validators.required],
            iSeguimId: [null],
            iPersId: [null, Validators.required],
            iMatrId: [null],
            iPersIeId: [null],
            iTipoSeguimId: [null, Validators.required],
            iPrioridad: [null, Validators.required],
            iFase: [null],
            dSeguimFecha: [null, Validators.required],
            cSeguimArchivo: [null],
            cSeguimDescripcion: [null],
            cInstitucionDatos: [null],
            iTipoIdentId: [null, Validators.required],
            cPersDocumento: [null, Validators.required],
            cPersDatos: [null],
        })

        this.tipos_seguimiento = this.datosSeguimiento.getTiposSeguimiento()
        this.prioridades = this.datosSeguimiento.getPrioridades()
        this.fases = this.datosSeguimiento.getFases()

        this.datosSeguimiento
            .getSeguimientoParametros({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe((data: any) => {
                this.nivel_tipos = this.datosSeguimiento.getNivelesTipos(
                    data?.nivel_tipos
                )
                this.ies = this.datosSeguimiento.getInstitucionesEducativas(
                    data?.instituciones_educativas
                )
                this.tipos_documentos =
                    this.datosSeguimiento.getTiposDocumentos(
                        data?.tipos_documentos
                    )
                if (this.es_director) {
                    const nivel_tipo =
                        this.nivel_tipos && this.nivel_tipos.length > 0
                            ? this.nivel_tipos[0]['value']
                            : null
                    const ie =
                        this.ies && this.ies.length > 0
                            ? this.ies[0]['value']
                            : null
                    this.formSeguimiento
                        .get('iNivelTipoId')
                        ?.setValue(nivel_tipo)
                    this.filterInstitucionesEducativas()
                    this.formSeguimiento.get('iSedeId')?.setValue(ie)
                }
            })

        this.formSeguimiento.get('iNivelTipoId').valueChanges.subscribe(() => {
            this.formSeguimiento.get('iSedeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
            if (this.es_director) {
                const ie =
                    this.ies && this.ies.length > 0
                        ? this.ies[0]['value']
                        : null
                this.formSeguimiento.get('iSedeId')?.setValue(ie)
            }
        })

        this.formSeguimiento
            .get('iTipoIdentId')
            .valueChanges.subscribe((value) => {
                const tipo_doc = this.tipos_documentos.find(
                    (item: any) => item.value === value
                )
                if (tipo_doc) {
                    const longitud =
                        this.formSeguimiento.get('cPersDocumento')?.value
                    if (longitud && longitud.length > tipo_doc['longitud']) {
                        this.formSeguimiento
                            .get('cPersDocumento')
                            .setValue(null)
                    }
                    this.longitud_documento = tipo_doc['longitud']
                    this.formato_documento = '9'.repeat(this.longitud_documento)
                }
            })

        this.formSeguimiento
            .get('iTipoSeguimId')
            .valueChanges.subscribe((value) => {
                this.obtenerTiposDocumento(value)
            })

        this.verSeguimientos()
    }

    verSeguimientos() {
        this.datosSeguimiento
            .listarSeguimientos({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.seguimientos = data.data
                        this.seguimientos_filtrados = this.seguimientos
                    } else {
                        this.seguimientos = null
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo seguimientos:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    obtenerTiposDocumento(tipo_seguimiento: any) {
        if (tipo_seguimiento === this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE) {
            this.tipos_documentos.unshift({
                value: 0,
                label: 'CODIGO DE ESTUDIANTE',
                longitud: 15,
            })
        } else {
            this.tipos_documentos = this.tipos_documentos.filter((doc: any) => {
                return doc.value !== 0
            })
        }
    }

    filterInstitucionesEducativas() {
        const iNivelTipoId = this.formSeguimiento.get('iNivelTipoId')?.value
        this.datosSeguimiento
            .filterInstitucionesEducativas(iNivelTipoId)
            .subscribe((data: any) => {
                this.ies = data
            })
    }

    agregarSeguimiento() {
        this.visibleDialog = true
        this.seguimiento_bloqueado = false
        this.seguimiento_registrado = false
    }

    filtrarTabla() {
        const filtro = this.filtro.nativeElement.value.toLowerCase()
        const filtro_tipo = this.filtro_tipo.value
        this.seguimientos_filtrados = this.seguimientos.filter(
            (seguimiento: any) => {
                if (seguimiento?.iTipoSeguimId === filtro_tipo)
                    return seguimiento
                if (seguimiento?.cPersDocumento.toLowerCase().includes(filtro))
                    return seguimiento
                if (
                    seguimiento?.cPersNombreApellidos
                        .toLowerCase()
                        .includes(filtro)
                )
                    return seguimiento
                if (
                    seguimiento?.dSeguimFechaUltima
                        .toLowerCase()
                        .includes(filtro)
                )
                    return seguimiento
                return null
            }
        )
    }

    filtrarTablaPersona() {
        const filtro_persona =
            this.filtro_persona.nativeElement.value.toLowerCase()
        this.seguimientos_persona_filtrados = this.seguimientos.filter(
            (seguimiento: any) => {
                if (
                    seguimiento?.dSeguimFecha
                        .toLowerCase()
                        .includes(filtro_persona)
                )
                    return seguimiento
                if (
                    seguimiento?.cSeguimPrioridad
                        .toLowerCase()
                        .includes(filtro_persona)
                )
                    return seguimiento
                if (
                    seguimiento?.cIieeNombre
                        .toLowerCase()
                        .includes(filtro_persona)
                )
                    return seguimiento
                return null
            }
        )
    }

    handleArchivo(event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.formSeguimiento.patchValue({
            cSeguimArchivo: file,
        })
    }

    verSeguimiento(item: any) {
        this.datosSeguimiento
            .verSeguimiento({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
                iSeguimId: item.iSeguimId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data) {
                        this.setFormSeguimiento(data.data)
                    } else {
                        this.setFormSeguimiento(null)
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo seguimiento:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    setFormSeguimiento(data: any) {
        let datos_persona: string = ''
        switch (Number(data?.iTipoSeguimId)) {
            case this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE:
                datos_persona = data
                    ? data?.cPersNombreApellidos +
                      ' (' +
                      data?.cGradoNombre +
                      ' ' +
                      data?.cSeccionNombre +
                      ')'
                    : null
                break
            case this.datosSeguimiento.SEGUIMIENTO_DOCENTE:
            case this.datosSeguimiento.SEGUIMIENTO_DIRECTIVO:
                datos_persona = data ? data?.cPersNombreApellidos : null
                break
        }

        this.formSeguimiento.reset()
        this.formSeguimiento.patchValue({
            iCredEntPerfId: this.perfil.iCredEntPerfId,
            iYAcadId: data ? Number(data?.iYAcadId) : this.iYAcadId,
            iSeguimId: data ? data?.iSeguimId : null,
            iPersId: data ? data?.iPersId : null,
            iTipoSeguimId: data ? Number(data?.iTipoSeguimId) : null,
            iPrioridad: data ? Number(data?.iPrioridad) : null,
            iFase: data ? Number(data?.iFase) : null,
            dSeguimFecha: data
                ? this.funcionesBienestar.formaterarFormFecha(
                      data?.dSeguimFecha
                  )
                : null,
            cSeguimArchivo: data ? data?.cSeguimArchivo : null,
            cSeguimDescripcion: data ? data?.cSeguimDescripcion : null,
            iTipoIdentId: data ? Number(data?.iTipoIdentId) : null,
            cPersDocumento: data ? data?.cPersDocumento : null,
            cPersDatos: datos_persona,
            iNivelTipoId: data ? Number(data?.iNivelTipoId) : null,
        })
        this.datosSeguimiento
            .filterInstitucionesEducativas(data?.iNivelTipoId)
            .subscribe((data: any) => {
                this.formSeguimiento.patchValue({
                    iSedeId: data?.value,
                })
            })
        this.seguimiento_registrado = this.formSeguimiento.value.iSeguimId
            ? true
            : false
        this.funcionesBienestar.formMarkAsDirty(this.formSeguimiento)
        if (this.seguimiento_bloqueado) {
            this.formSeguimiento.disable()
        } else {
            this.formSeguimiento.enable()
        }
        this.cf.detectChanges()
    }

    buscarPersona() {
        if (
            this.formSeguimiento.value.iTipoSeguimId === null ||
            this.formSeguimiento.value.iNivelTipoId === null ||
            this.formSeguimiento.value.iSedeId === null ||
            this.formSeguimiento.value.iTipoIdentId === null ||
            this.formSeguimiento.value.cPersDocumento === null
        ) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe indicar el tipo de seguimiento, la sede y el documento de la persona',
            })
            this.formSeguimiento.get('iTipoSeguimId').markAsDirty()
            this.formSeguimiento.get('iNivelTipoId').markAsDirty()
            this.formSeguimiento.get('iSedeId').markAsDirty()
            this.formSeguimiento.get('iTipoIdentId').markAsDirty()
            this.formSeguimiento.get('cPersDocumento').markAsDirty()
            return
        }
        const tipo_doc = Number(this.formSeguimiento.value.iTipoIdentId)
        this.datosSeguimiento
            .verDatosPersona({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
                iSedeId: this.formSeguimiento.value.iSedeId,
                iTipoPers: this.formSeguimiento.value.iTipoSeguimId,
                cEstCodigo:
                    tipo_doc === 0
                        ? this.formSeguimiento.value.cPersDocumento
                        : null,
                iTipoIdentId:
                    tipo_doc > 0
                        ? this.formSeguimiento.value.iTipoIdentId
                        : null,
                cPersDocumento:
                    tipo_doc > 0
                        ? this.formSeguimiento.value.cPersDocumento
                        : null,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data) {
                        console.log(data.data, 'datos')
                        let datos_persona: string = ''
                        switch (this.formSeguimiento.value.iTipoSeguimId) {
                            case this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE:
                                datos_persona = data.data
                                    ? data.data?.cPersNombreApellidos +
                                      ' (' +
                                      data.data?.cGradoNombre +
                                      ' ' +
                                      data.data?.cSeccionNombre +
                                      ')'
                                    : null
                                break
                            case this.datosSeguimiento.SEGUIMIENTO_DOCENTE:
                            case this.datosSeguimiento.SEGUIMIENTO_DIRECTIVO:
                                datos_persona = data.data
                                    ? data.data?.cPersNombreApellidos
                                    : null
                                break
                        }
                        console.log(datos_persona, 'persona')
                        this.formSeguimiento.patchValue({
                            cPersDatos: datos_persona,
                            iPersId: data.data?.iPersId,
                        })
                    } else {
                        this.formSeguimiento.patchValue({
                            iPersId: null,
                            cPersDatos: null,
                        })
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se encontró la persona',
                        })
                    }
                },
                error: (error) => {
                    this.setFormSeguimiento(null)
                    console.error(
                        'Error obteniendo datos de la persona:',
                        error
                    )
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    guardarSeguimiento() {
        if (this.formSeguimiento.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            this.funcionesBienestar.formMarkAsDirty(this.formSeguimiento)
            return
        }
        this.datosSeguimiento
            .guardarSeguimiento(this.formSeguimiento.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Registro exitoso',
                        detail: 'Se registraron los datos',
                    })
                    this.verSeguimientos()
                    this.visibleDialog = false
                },
                error: (error) => {
                    console.error('Error guardando seguimiento:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message || 'Error al guardar datos',
                    })
                },
            })
    }

    actualizarSeguimiento() {
        if (this.formSeguimiento.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            this.funcionesBienestar.formMarkAsDirty(this.formSeguimiento)
            return
        }
        this.datosSeguimiento
            .actualizarSeguimiento(this.formSeguimiento.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Atualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    this.verSeguimientos()
                    this.visibleDialog = false
                },
                error: (error) => {
                    console.error('Error actualizando seguimiento:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error.error.message || 'Error al actualizar datos',
                    })
                },
            })
    }

    verHistorialSeguimiento(item: any): void {
        this.datosSeguimiento
            .verSeguimientosPersona({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
                iPersId: item.iPersId,
                iTipoSeguimId: item.iTipoSeguimId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data) {
                        this.seguimientos_persona = data.data
                        this.seguimientos_persona_filtrados =
                            this.seguimientos_persona
                    } else {
                        this.seguimientos_persona = null
                    }
                },
                error: (error) => {
                    console.error(
                        'Error obteniendo historial de seguimiento:',
                        error
                    )
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    descargarSeguimiento(item: any) {
        console.log(item, 'descarga')
    }

    clearForm() {
        this.setFormSeguimiento(null)
    }

    borrarSeguimiento(item: any) {
        this.datosSeguimiento
            .borrarSeguimiento({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iSeguimId: item.iSeguimId,
            })
            .subscribe({
                next: (data: any) => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Eliminación exitosa',
                        detail: 'Se eliminaron los datos',
                    })
                    if (data.data === true) {
                        this.seguimientos_filtrados =
                            this.seguimientos_filtrados.filter(
                                (seguimiento: any) =>
                                    item.iSeguimId != seguimiento.iSeguimId
                            )
                    }
                    this.visibleDialog = false
                },
            })
    }

    salir() {
        this.clearForm()
        this.visibleDialog = false
    }

    accionBnt({ accion, item }) {
        switch (accion) {
            case 'seguimiento':
                this.visibleDialogPersona = true
                this.verHistorialSeguimiento(item)
                break
            case 'editar':
                this.visibleDialog = true
                this.seguimiento_bloqueado = false
                this.verSeguimiento(item)
                break
            case 'ver':
                this.visibleDialog = true
                this.seguimiento_bloqueado = true
                this.verSeguimiento(item)
                break
            case 'descargar':
                this.descargarSeguimiento(item)
                break
            case 'borrar':
                this._confirmService.openConfirm({
                    header: '¿Realmente desea eliminar el seguimiento seleccionado?',
                    accept: () => {
                        this.borrarSeguimiento(item)
                    },
                })
                break
            default:
                console.warn('Acción no reconocida:', accion)
        }
    }

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Seguimiento',
            icon: 'pi pi-folder-open',
            accion: 'seguimiento',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    public columnasTabla: IColumn[] = [
        {
            field: 'item',
            header: 'N°',
            type: 'item',
            width: '5%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'CTipoSeguimNombre',
            header: 'Tipo',
            type: 'text',
            width: '15%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersDocumento',
            header: 'Documento',
            type: 'text',
            width: '15%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombreApellidos',
            header: 'Nombres',
            type: 'text',
            width: '40%',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'dSeguimFechaUltima',
            header: 'Actualizado en',
            type: 'date',
            width: '15%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            type: 'actions',
            width: '10%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public accionesTablaPersona: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'borrar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Descargar ficha',
            icon: 'pi pi-download',
            accion: 'descargar',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
        {
            labelTooltip: 'Ver seguimiento',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    public columnasTablaPersona: IColumn[] = [
        {
            field: 'item',
            header: 'N°',
            type: 'item',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'dSeguimFecha',
            header: 'Fecha',
            type: 'date',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cSeguimPrioridad',
            header: 'Prioridad',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cSeguimDescripcion',
            header: 'Descripción',
            type: 'text',
            width: '30%',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cIieeNombre',
            header: 'Institución',
            type: 'text',
            width: '30%',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '10%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]
}
