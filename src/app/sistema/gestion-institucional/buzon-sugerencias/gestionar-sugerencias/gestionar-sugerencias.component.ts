import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DatosSugerenciaService } from '../../services/datos.sugerencia.service'
import { Router } from '@angular/router'
import { DerivarSugerenciaComponent } from '../derivar-sugerencia/derivar-sugerencia.component'
import { RegistrarSugerenciaComponent } from '../registrar-sugerencia/registrar-sugerencia.component'

@Component({
    selector: 'app-gestionar-sugerencias',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        DerivarSugerenciaComponent,
        RegistrarSugerenciaComponent,
    ],
    templateUrl: './gestionar-sugerencias.component.html',
    styleUrl: './gestionar-sugerencias.component.scss',
})
export class GestionarSugerenciasComponent implements OnInit {
    form: FormGroup
    sede: any[]
    iSedeId: number
    iYAcadId: number

    registrar_visible: boolean = false
    derivar_visible: boolean = false
    caption: string = ''
    c_accion: string

    sugerencias: any[]
    sugerencia_registrada: boolean = false
    prioridades: Array<object>
    destinos: Array<object>
    dialog_header: string
    uploadedFiles: any[] = []
    perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'))
    es_estudiante: boolean = this.perfil.iPerfilId == 80
    disable_form: boolean = false

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private fb: FormBuilder,
        private datosSugerenciaService: DatosSugerenciaService,
        private router: Router
    ) {}

    ngOnInit(): void {
        console.log(this.es_estudiante)
        try {
            this.form = this.fb.group({
                iPrioridadId: [null, Validators.required],
                iDestinoId: [null, Validators.required],
                cAsunto: [null, Validators.required],
                cSugerencia: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.buscarPrioridades()
        this.buscarDestinos()
        this.buscarSugerencias()
    }

    registroVisible(event: any) {
        return (this.registrar_visible = event.value)
    }

    derivacionVisible(event: any) {
        return (this.derivar_visible = event.value)
    }

    /**
     * Buscar sugerencias segun criterios de busqueda
     */
    buscarSugerencias() {
        this.sugerencias = [
            {
                id: 1,
                destino_id: [1, 3],
                fecha: '2024-01-01',
                asunto: 'Notificarme cuando el profesar ponga nota a mi examen',
                estado_id: 2,
                estado: 'RECIBIDO',
                prioridad: 'MEDIA',
                prioridad_id: 2,
                sugerencia:
                    '<h1>Notificarme cuando el profesar ponga nota a mi examen</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
            {
                id: 2,
                destino_id: [1],
                fecha: '2024-01-02',
                asunto: 'Opciones de preguntas deben ser mas grandes en celular',
                estado_id: 1,
                estado: 'PENDIENTE',
                prioridad: 'BAJA',
                prioridad_id: 1,
                sugerencia:
                    '<h1>Opciones de preguntas deben ser mas grandes en celular</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
            {
                id: 3,
                destino_id: [1, 2],
                fecha: '2024-01-03',
                asunto: 'Explicar como se calcula promedio final',
                estado_id: 3,
                estado: 'ATENDIDO',
                prioridad: 'ALTA',
                prioridad_id: 3,
                sugerencia:
                    '<h1>Explicar como se calcula promedio final</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
            {
                id: 4,
                destino_id: [4],
                fecha: '2024-01-04',
                asunto: 'Mas explicaciones en examenes de matematica',
                estado_id: 4,
                estado: 'DERIVADO',
                prioridad: 'BAJA',
                prioridad_id: 2,
                sugerencia:
                    '<h1>Mas explicaciones en examenes de matematica</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
        ]
    }

    buscarDestinos() {
        this.destinos = [
            { id: 1, nombre: 'EQUIPO TECNICO' },
            { id: 2, nombre: 'DIRECCION' },
            { id: 3, nombre: 'PROFESORES' },
            { id: 4, nombre: 'ESPECIALISTAS' },
        ]
    }

    buscarPrioridades() {
        this.prioridades = [
            { id: 1, nombre: 'BAJA' },
            { id: 2, nombre: 'MEDIA' },
            { id: 3, nombre: 'ALTA' },
        ]
    }

    /**
     * Mostrar modal para agregar nueva sugerencia
     */
    agregarSugerencia() {
        this.dialog_header = 'Registrar sugerencia'
        this.disable_form = false
        this.registrar_visible = true
        this.resetearInputs()
        this.disableForm(false)
    }

    /**
     * Enviar datos de nueva sugerencia a backend
     */
    guardarSugerencia() {
        this.datosSugerenciaService
            .guardarSugerencia(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.sugerencia_registrada = true
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estudiante registrado',
                    })
                    console.log(data, 'agregar estudiante')
                    this.registrar_visible = false
                },
                error: (error) => {
                    console.error('Error guardando estudiante:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    /**
     * Eliminar sugerencia segun id
     * @param item sugerencia a eliminar
     */
    eliminarSugerencia(item: any) {
        this._confirmService.openConfirm({
            header: 'Eliminar sugerencia',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro de eliminar la sugerencia seleccionada?',
            accept: () => {
                this.datosSugerenciaService.eliminarSugerencia(item).subscribe({
                    next: (data: any) => {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Sugerencia eliminada',
                        })
                        console.log(data, 'eliminar sugerencia')
                        this.sugerencias = this.sugerencias.filter(
                            (sug: any) =>
                                sug.iSugerenciaId !== item.iSugerenciaId
                        )
                    },
                    error: (error) => {
                        console.error('Error eliminando sugerencia:', error)
                        this._MessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error,
                        })
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
            },
        })
    }

    /**
     * Mostrar modal para editar sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    editarSugerencia(item: any) {
        this.dialog_header = 'Editar sugerencia'
        this.disable_form = false
        this.setFormSugerencia(item)
        this.registrar_visible = true
    }

    /**
     * Mostrar modal para ver sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    mostrarSugerencia(item: any) {
        this.dialog_header = 'Ver sugerencia'
        this.disable_form = true
        this.setFormSugerencia(item)
        this.registrar_visible = true
        this.disableForm(true)
    }

    /**
     * Actualizar sugerencia segun formulario
     */
    actualizarSugerencia() {
        this.datosSugerenciaService
            .actualizarSugerencia(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Sugerencia eliminada',
                    })
                    console.log(data, 'actualizar sugerencia')
                },
                error: (error) => {
                    console.error('Error actualizando sugerencia:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    /**
     * Ir a vista para dar seguimiento a sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    seguimientoSugerencia(item: any) {
        console.log(item, 'seguimientoSugerencia')
    }

    /**
     * Limpiar formulario
     */
    resetearInputs() {
        this.form.reset()
    }

    /**
     * Deshabilitar inputs de formulario
     * @param disable booleano para deshabilitar o habilitar
     */
    disableForm(disable: boolean) {
        if (disable) {
            this.form.get('cAsunto')?.disable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.disable()
            this.form.get('iPrioridadId')?.disable()
        } else {
            this.form.get('cAsunto')?.enable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.enable()
            this.form.get('iPrioridadId')?.enable()
        }
    }

    /**
     * Rellenar formulario con datos de sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    setFormSugerencia(item: any) {
        this.form.get('cAsunto')?.setValue(item.asunto)
        this.form.get('cSugerencia')?.setValue(item.sugerencia)
        this.form.get('iDestinoId')?.setValue(item.destino_id)
        this.form.get('iPrioridadId')?.setValue(item.prioridad_id)
        this.registrar_visible = true
    }

    onUpload(event: any) {
        this.uploadedFiles = event.files
    }

    /**
     * Acciones para botones en cada fila de tabla
     * @param {object} accion accion seleccionada
     * @param {object} item datos de la fila seleccionada
     */
    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.editarSugerencia(item)
        }
        if (accion === 'ver') {
            this.mostrarSugerencia(item)
        }
        if (accion === 'seguimiento') {
            this.router.navigate([
                '/gestion-institucional/seguimiento-sugerencia',
            ])
        }
        if (accion === 'derivar') {
            this.derivar_visible = true
        }
        if (accion === 'anular') {
            this.eliminarSugerencia(item)
        }
    }

    selectedItems = []

    /**
     * Definir botones de cada fila en la tabla
     * @type {IActionTable[]}
     */
    actions: IActionTable[] = [
        {
            labelTooltip: 'Derivar',
            icon: 'pi pi-send',
            accion: 'derivar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            isVisible: (row) => {
                return row.estado_id === 1
            },
        },
        {
            labelTooltip: 'Anular sugerencia',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
            isVisible: (row) => {
                return row.estado_id === 1 && 2 == this.perfil.iCredId
            },
        },
        {
            labelTooltip: 'Ver sugerencia',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Seguimiento',
            icon: 'pi pi-search',
            accion: 'seguimiento',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
    ]

    actionsLista: IActionTable[]

    /**
     * Columnas de la tabla
     * @type {any[]}
     */
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'Item',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'date',
            width: '3rem',
            field: 'fecha',
            header: 'Fecha',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'asunto',
            header: 'Asunto',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'tag',
            width: '5rem',
            field: 'estado',
            header: 'Estado',
            styles: {
                PENDIENTE: 'danger', // REGISTRADO/PENDIENTE
                RECIBIDO: 'success', // RECIBIDO
                DERIVADO: 'secondary', // DERIVADO
                ATENDIDO: 'info', // ATENDIDO
            },
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'prioridad',
            header: 'Prioridad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'right',
        },
    ]
}
