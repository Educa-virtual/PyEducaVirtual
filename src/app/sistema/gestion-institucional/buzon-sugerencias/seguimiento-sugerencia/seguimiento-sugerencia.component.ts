import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
    selector: 'app-seguimiento-sugerencia',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './seguimiento-sugerencia.component.html',
    styleUrl: './seguimiento-sugerencia.component.scss',
})
export class SeguimientoSugerenciaComponent implements OnInit {
    sede: any[]
    iSedeId: number
    iYAcadId: number

    visible: boolean = false //mostrar dialogo

    movimientos: any[]
    sugerencia_registrada: boolean = false

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.seguimientoSugerencia(1)
    }

    seguimientoSugerencia(data) {
        console.log(data, 'filtrar segun data')
        this.movimientos = [
            {
                fecha: '2024-01-01 15:00',
                operacion: 'REGISTRADO',
                encargado: 'Estudiante Carla Torres',
                detalle: 'Asunto original de la sugerencia',
                destino: 'Direccion',
            },
            {
                fecha: '2024-01-02 09:00',
                operacion: 'RECIBIDO',
                encargado: 'Director Juan Gomez',
                detalle: 'Fue leído por el director, se notifica al estudiante',
                destino: '',
            },
            {
                fecha: '2024-01-02 09:15',
                operacion: 'DERIVADO',
                encargado: 'Director Juan Gomez',
                detalle: 'Se deriva a los docentes con observaciones XYZ',
                destino: 'Profesora Maria Lopez',
            },
            {
                fecha: '2024-01-02 09:15',
                operacion: 'DERIVADO',
                encargado: 'Director Juan Gomez',
                detalle: 'Se deriva a los docentes con observaciones XYZ',
                destino: 'Profesor Luis Mariano',
            },
            {
                fecha: '2024-01-02 14:20',
                operacion: 'RECIBIDO',
                encargado: 'Profesora Maria Lopez',
                detalle: 'Fue leído por el profesor',
                destino: '',
            },
            {
                fecha: '2024-01-02 16:00',
                operacion: 'RECIBIDO',
                encargado: 'Profesor Luis Mariano',
                detalle: 'Fue leído por el profesor',
                destino: '',
            },
            {
                fecha: '2024-01-03 09:10',
                operacion: 'ATENDIDO',
                encargado: 'Profesor Luis Mariano',
                detalle:
                    'Se realizó las acciones ABC para atender la sugerencia',
                destino: 'Direccion',
            },
            {
                fecha: '2024-01-03 09:10',
                operacion: 'ATENDIDO',
                encargado: 'Profesor Luis Mariano',
                detalle:
                    'Se realizó las acciones ABC para atender la sugerencia',
                destino: 'Estudiante Carla Torres',
            },
        ]
    }

    salir() {
        this.router.navigate(['/gestion-institucional/gestionar-sugerencias'])
    }

    derivar() {
        this.visible = true
    }

    /**
     * Acciones para botones en cada fila de tabla
     * @param {object} accion accion seleccionada
     * @param {object} item datos de la fila seleccionada
     */
    accionBtnItemTable({ accion, item }) {
        if (accion === 'ver') {
            console.log(item, 'ver item')
        }
    }

    selectedItems = []

    /**
     * Definir botones de cada fila en la tabla
     * @type {IActionTable[]}
     */
    actions: IActionTable[] = [
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
            type: 'text',
            width: '3rem',
            field: 'operacion',
            header: 'Operación',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'encargado',
            header: 'Encargado',
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
            field: 'detalle',
            header: 'Detalle',
            text_header: 'center',
            text: 'left',
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
