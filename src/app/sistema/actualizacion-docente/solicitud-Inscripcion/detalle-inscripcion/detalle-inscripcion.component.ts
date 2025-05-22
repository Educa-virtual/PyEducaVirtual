import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CapacitacionesServiceService } from '@/app/servicios/cap/capacitaciones-service.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

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

    private _capService = inject(CapacitacionesServiceService)
    private _ConstantesService = inject(ConstantesService)

    alumnos: any[]

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
            field: 'cNombresCompleto',
            header: 'Apellidos y Nombre',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'item-checkbox',
            width: '2rem',
            field: '',
            header: '¿Es Docente?',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'cPersDocumento',
            header: 'DNI/CE',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'cInscripCel',
            header: 'Celular',
            text_header: 'center',
            text: 'center',
        },
        // {
        //     type: 'text',
        //     width: '2rem',
        //     field: '',
        //     header: 'Modalidad',
        //     text_header: 'center',
        //     text: 'center',
        // },
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
            icon: 'pi pi-check-circle',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-succes p-button-text',
            // isVisible: (row) => ['1', '2', '3'].includes(row.iEstado),
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-times-circle',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            // isVisible: (row) => row.iEstado === '1',
        },
        {
            labelTooltip: 'Comprobante',
            icon: 'pi pi-file-pdf',
            accion: 'mostrarComprobante',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            // isVisible: (row) => row.iEstado === '1',
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
        const iCredId = this._ConstantesService.iCredId
        const data = {
            iCapacitacionId: this.id,
            iCredId: iCredId,
        }

        this._capService.listarInscripcionxcurso(data).subscribe({
            next: (res: any) => {
                this.alumnos = res['data']
                // this.data = res['data']
                // this.capacitaciones = [...this.data] // cargar desde servicio o mock
                // this.paginator.total = this.capacitaciones.length
                // this.onPageChange({ first: 0, rows: this.paginator.rows }) // inicial

                console.log('datos del Alumnos incritos', this.alumnos)
            },
        })
    }
    regresar() {
        this.volver.emit()
    }
}
