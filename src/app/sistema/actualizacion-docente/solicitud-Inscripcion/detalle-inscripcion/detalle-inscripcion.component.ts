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
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'

@Component({
    selector: 'app-detalle-inscripcion',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent],
    templateUrl: './detalle-inscripcion.component.html',
    styleUrl: './detalle-inscripcion.component.scss',
})
export class DetalleInscripcionComponent implements OnInit {
    @Input() id!: string
    @Output() volver = new EventEmitter<void>()

    private _capService = inject(CapacitacionesServiceService)
    private _ConstantesService = inject(ConstantesService)

    alumnos: any[]
    showModal: boolean = false
    alumnoSelect: any
    nombreAlumno: string

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
            labelTooltip: 'Aceptar ',
            icon: 'pi pi-check-circle',
            accion: 'aceptar',
            type: 'item',
            class: 'p-button-rounded p-button-succes p-button-text',
            // isVisible: (row) => ['1', '2', '3'].includes(row.iEstado),
        },
        {
            labelTooltip: 'Denegar',
            icon: 'pi pi-times-circle',
            accion: 'denegar',
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

    actionsContainer = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Regresar',
            text: 'Regresar',
            icon: 'pi pi-undo',
            accion: 'regresar',
            class: 'p-button-secondary',
        },
    ]

    // asignar la accion a los botones de la tabla
    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'aceptar':
                console.log(item)
                // this.modoFormulario = 'editar'
                // this.iCapacitacionId = item.iCapacitacionId
                // // console.log('Editar', item)
                // this.formNuevaCapacitacion.patchValue(item)
                // // this.selectedItems = []
                // // this.selectedItems = [item]
                break
            case 'denegar':
                // this.eliminarCapacitacion(item)
                break
            case 'mostrarComprobante':
                this.mostrarVoucher(item)
                break
            case 'regresar':
                this.regresar()
                break
        }
    }
    mostrarVoucher(voucher: any) {
        this.alumnoSelect = voucher
        this.nombreAlumno = voucher.cPersNombre
        console.log(this.alumnoSelect)
        this.showModal = true
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
                console.log('datos del Alumnos incritos', this.alumnos)
            },
        })
    }
    regresar() {
        this.volver.emit()
    }
}
