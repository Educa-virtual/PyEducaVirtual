import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-detalle-inscripcion',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './detalle-inscripcion.component.html',
    styleUrl: './detalle-inscripcion.component.scss',
})
export class DetalleInscripcionComponent implements OnInit {
    @Input() id!: string
    @Output() volver = new EventEmitter<void>()

    cursos: any[]

    ngOnInit(): void {
        this.obtenerSolicitudesXCurso()
    }
    // mostrar los headr de las tablas
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: '',
            header: 'Apellidos y Nombre',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '2rem',
            field: '',
            header: '¿Es Docente?',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: '',
            header: 'DNI/CE',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: '',
            header: 'Celular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: '',
            header: 'Modalidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    // mostrar los botones de la tabla
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-succes p-button-text',
            isVisible: (row) => ['1', '2', '3'].includes(row.iEstado),
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: (row) => row.iEstado === '1',
        },
    ]
    // asignar la accion a los botones de la tabla
    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'editar':
                console.log(item)
                // this.modoFormulario = 'editar'
                // this.iCapacitacionId = item.iCapacitacionId
                // // console.log('Editar', item)
                // this.formNuevaCapacitacion.patchValue(item)
                // // this.selectedItems = []
                // // this.selectedItems = [item]
                break
            case 'eliminar':
                // this.eliminarCapacitacion(item)
                break
        }
    }
    // obtener las solicitudes del curso
    obtenerSolicitudesXCurso() {
        console.log('Id de la capacitacion:', this.id)
    }
    regresar() {
        this.volver.emit()
    }
}
