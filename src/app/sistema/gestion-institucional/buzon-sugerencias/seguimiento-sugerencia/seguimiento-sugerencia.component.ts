import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosSugerenciaService } from '../../services/datos.sugerencia.service'

@Component({
    selector: 'app-seguimiento-sugerencia',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './seguimiento-sugerencia.component.html',
    styleUrl: './seguimiento-sugerencia.component.scss',
})
export class SeguimientoSugerenciaComponent implements OnInit {
    form: FormGroup
    sede: any[]
    iSedeId: number
    iYAcadId: number

    visible: boolean = false //mostrar dialogo

    movimientos: any[]
    prioridades: Array<object>
    destinos: Array<object>
    sugerencia_registrada: boolean = false
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
        try {
            this.form = this.fb.group({
                iDestinoId: [null, Validators.required],
                cProveido: [null, Validators.required],
                cSugerencia: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }
        this.seguimientoSugerencia(1)
    }

    seguimientoSugerencia(data) {
        console.log(data, 'filtrar segun data')
        this.movimientos = [
            {
                recibido: true,
                fecha: '2024-01-01 15:00',
                operacion: 'REGISTRADO',
                origen_id: 11,
                origen: 'Estudiante Carla Torres',
                detalle: 'Asunto original de la sugerencia',
                destino: 'Direccion',
            },
            {
                recibido: true,
                fecha: '2024-01-02 09:00',
                operacion: 'RECIBIDO',
                origen_id: 20,
                origen: 'Director Juan Gomez',
                proveido:
                    'Fue leído por el director, se notifica al estudiante',
                destino: '',
            },
            {
                recibido: true,
                fecha: '2024-01-02 09:15',
                operacion: 'DERIVADO',
                origen_id: 20,
                origen: 'Director Juan Gomez',
                proveido: 'Se deriva a los docentes con observaciones XYZ',
                destino: 'Profesora Maria Lopez',
            },
            {
                recibido: false,
                fecha: '2024-01-02 09:15',
                operacion: 'DERIVADO',
                origen: 'Director Juan Gomez',
                origen_id: 20,
                proveido: 'Se deriva a los docentes con observaciones XYZ',
                destino: 'Profesor Luis Mariano',
            },
            {
                recibido: true,
                fecha: '2024-01-02 16:00',
                operacion: 'RECIBIDO',
                origen_id: 30,
                origen: 'Profesor Luis Mariano',
                proveido: 'Fue leído por el profesor',
                destino: '',
            },
            {
                recibido: true,
                fecha: '2024-01-03 09:10',
                operacion: 'ATENDIDO',
                origen_id: 30,
                origen: 'Profesor Luis Mariano',
                proveido:
                    'Se realizó las acciones ABC para atender la sugerencia',
                destino: 'Direccion',
            },
        ]
    }

    salir() {
        this.router.navigate(['/gestion-institucional/gestionar-sugerencias'])
    }

    derivar() {
        this.visible = true
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
     * Mostrar modal para agregar nuevo movimiento
     */
    agregarMovimiento() {
        this.visible = true
        this.disable_form = false
        this.resetearInputs()
        this.disableForm(false)
    }

    /**
     * Enviar datos de nuevo movimiento a backend
     */
    guardarMovimiento() {
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
                    this.visible = false
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
     * Mostrar modal para agregar nuevo movimiento
     * @param item movimiento seleccionado en tabla
     */
    verMovimiento(item: any) {
        this.visible = true
        this.setFormMovimiento(item)
        this.disable_form = true
        this.disableForm(true)
    }

    /**
     * Eliminar sugerencia segun id
     * @param item sugerencia a eliminar
     */
    eliminarMovimiento(item: any) {
        this._confirmService.openConfirm({
            header: 'Eliminar derivación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro de eliminar la derivación seleccionada?',
            accept: () => {
                this.datosSugerenciaService.eliminarSugerencia(item).subscribe({
                    next: (data: any) => {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Sugerencia eliminada',
                        })
                        console.log(data, 'eliminar sugerencia')
                        this.movimientos = this.movimientos.filter(
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
            this.form.get('cProveido')?.disable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.disable()
        } else {
            this.form.get('cProveido')?.enable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.enable()
        }
    }

    /**
     * Rellenar formulario con datos de movimiento
     * @param item movimiento seleccionado en tabla
     */
    setFormMovimiento(item: any) {
        this.form.get('cProveido')?.setValue(item.proveido)
        this.form.get('cSugerencia')?.setValue(item.sugerencia)
        this.form.get('iDestinoId')?.setValue(item.destino_id)
        this.visible = true
    }

    /**
     * Acciones para botones en cada fila de tabla
     * @param {object} accion accion seleccionada
     * @param {object} item datos de la fila seleccionada
     */
    accionBtnItemTable({ accion, item }) {
        if (accion === 'ver') {
            this.verMovimiento(item)
        }
    }

    selectedItems = []

    /**
     * Definir botones de cada fila en la tabla
     * @type {IActionTable[]}
     */
    actions: IActionTable[] = [
        {
            labelTooltip: 'Anular derivación',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
            isVisible: (row) => {
                if (row.estado_id != 'DERIVADO') {
                    return false
                }
                if (this.es_estudiante) {
                    return false
                }
                if (row.origen_id != this.perfil.iCredId) {
                    return false
                }
                return true
            },
        },
        {
            labelTooltip: 'Ver detalle',
            icon: 'pi pi-search',
            accion: 'ver',
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
            type: 'datetime',
            width: '3rem',
            field: 'fecha',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'tag',
            width: '3rem',
            field: 'operacion',
            header: 'Operación',
            text_header: 'center',
            text: 'center',
            styles: {
                REGISTRADO: 'danger', // REGISTRADO/PENDIENTE
                RECIBIDO: 'success', // RECIBIDO
                DERIVADO: 'secondary', // DERIVADO
                ATENDIDO: 'info', // ATENDIDO
            },
        },
        {
            type: 'text',
            width: '5rem',
            field: 'origen',
            header: 'Origen',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'destino',
            header: 'Destino',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'proveido',
            header: 'Proveido',
            text_header: 'center',
            text: 'left',
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
