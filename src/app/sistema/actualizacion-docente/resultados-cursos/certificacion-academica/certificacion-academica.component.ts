import { PrimengModule } from '@/app/primeng.module'
import { CapacitacionesServiceService } from '@/app/servicios/cap/capacitaciones-service.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'

@Component({
    selector: 'app-certificacion-academica',
    standalone: true,
    templateUrl: './certificacion-academica.component.html',
    styleUrls: ['./certificacion-academica.component.scss'],
    imports: [PrimengModule, ContainerPageComponent, TablePrimengComponent],
})
export class CertificacionAcademicaComponent implements OnInit {
    @Output() volver = new EventEmitter<void>()
    @Input() id: string

    private _ConstantesService = inject(ConstantesService)
    private _capService = inject(CapacitacionesServiceService)

    datosCurso: any
    alumnos: any
    constructor() {}

    ngOnInit() {
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
            type: 'text',
            width: '4rem',
            field: '',
            header: 'Nota Final',
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
            labelTooltip: 'Descargar Certificado',
            icon: 'pi pi-file-pdf',
            accion: 'descargarPdf',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            // isVisible: (row) => ['1', '2', '3'].includes(row.iEstado),
        },
        {
            labelTooltip: 'Subir Certificado',
            icon: 'pi pi-cloud-upload',
            accion: 'denegar',
            type: 'item',
            class: 'p-button-rounded p-button-info p-button-text',
            // isVisible: (row) => row.iEstado === '1',
        },
    ]

    actionsContainer = [
        {
            labelTooltip: 'Regresar',
            text: 'Regresar',
            icon: 'pi pi-undo',
            accion: 'regresar',
            class: 'p-button-secondary',
        },
    ]
    // obtener las solicitudes del curso
    obtenerSolicitudesXCurso() {
        this.datosCurso = this.id
        const iCredId = this._ConstantesService.iCredId
        const data = {
            iCapacitacionId: this.datosCurso.iCapacitacionId,
            iCredId: iCredId,
        }
        this._capService.listarInscripcionxcurso(data).subscribe({
            next: (res: any) => {
                this.alumnos = res['data']
                // console.log('datos del Alumnos incritos', this.alumnos)
            },
        })
    }
    // asignar la accion a los botones de la tabla
    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'descargarPdf':
                this.descargarCestificado(item)
                break
            case 'denegar':
                // this.eliminarCapacitacion(item)
                break
            case 'mostrarComprobante':
                // this.mostrarVoucher(item)
                break
            case 'regresar':
                this.regresar()
                break
            case 'agregar':
                // this.mostrarInscripcion()
                break
        }
    }
    regresar() {
        this.volver.emit()
    }

    //descargar en pdf el certificado del estudiante
    descargarCestificado(item: any) {
        console.log('datos para descargar', item)
    }
}
