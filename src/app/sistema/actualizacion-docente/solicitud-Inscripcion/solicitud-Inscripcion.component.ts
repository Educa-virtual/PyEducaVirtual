import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core'
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component'
import { CardCapacitacionesComponent } from './card-capacitaciones/card-capacitaciones.component'
import { AperturaCursoComponent } from '../apertura-curso/apertura-curso.component'
import { ApiAulaService } from '../../aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { PaginatorModule } from 'primeng/paginator'
import { DetalleInscripcionComponent } from './detalle-inscripcion/detalle-inscripcion.component'
@Component({
    selector: 'app-solicitud-inscripcion',
    standalone: true,
    templateUrl: './solicitud-Inscripcion.component.html',
    styleUrls: ['./solicitud-Inscripcion.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        TabsPrimengComponent,
        CardCapacitacionesComponent,
        AperturaCursoComponent,
        PaginatorModule,
        DetalleInscripcionComponent,
    ],
})
export class SolicitudInscripcionComponent implements OnInit, AfterViewInit {
    private _aulaService = inject(ApiAulaService)
    private _ConstantesService = inject(ConstantesService)
    @ViewChild('gridContainer') gridContainer!: ElementRef

    activeIndex: number = 1
    cursoSeleccionado
    detalleVisible = false
    idSeleccionado!: string
    tabs = [
        {
            title: 'Apertura de Curso',
            icon: 'pi pi-book',
            tab: 'contenido',
        },
        {
            title: 'Solicitud de Inscripción',
            icon: 'pi pi-home',
            tab: 'inicio',
        },
    ]

    updateTab(tab): void {
        this.activeIndex = tab
    }

    data: any[] = []

    capacitaciones
    paginator = {
        first: 0,
        rows: 5,
        total: 2,
        rowsPerPage: [],
    }
    onPageChange(event: any): void {
        this.paginator.first = event.first
        this.paginator.rows = event.rows
        const start = event.first
        const end = event.first + event.rows
        this.data = this.capacitaciones?.slice(start, end)
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.calculateRows(), 0) // Esperar renderizado
        window.addEventListener('resize', () => this.calculateRows())
    }

    ngOnInit() {
        this.obtenerCapacitaciones()
    }
    // obtener y listar las capacitaciones
    obtenerCapacitaciones() {
        const iEstado = 1
        const iCredId = this._ConstantesService.iCredId
        const data = {
            iEstado: iEstado,
            iCredId: iCredId,
        }

        this._aulaService.obtenerCapacitacion(data).subscribe({
            next: (res: any) => {
                this.data = res['data']
                this.capacitaciones = [...this.data] // cargar desde servicio o mock
                this.paginator.total = this.capacitaciones.length
                this.onPageChange({ first: 0, rows: this.paginator.rows }) // inicial
            },
        })
    }

    calculateRows(): void {
        const container = this.gridContainer.nativeElement as HTMLElement
        const containerWidth = container.clientWidth
        const containerHeight =
            window.innerHeight - container.getBoundingClientRect().top

        const cardWidth = 250 + 32 // ancho tarjeta + gap (ajusta según tu CSS)
        const cardHeight = 300 + 32 // alto tarjeta + gap (ajusta también)

        const columns = Math.floor(containerWidth / cardWidth)
        const rows = Math.floor(containerHeight / cardHeight)

        const itemsPerPage = columns * rows || 1 // al menos 1

        this.paginator.rows = itemsPerPage
        this.paginator.rowsPerPage = [itemsPerPage]
        this.onPageChange({ first: 0, rows: itemsPerPage })
    }

    onVerDetalle(id: string) {
        this.idSeleccionado = id
        this.detalleVisible = true
    }

    volverALista() {
        this.detalleVisible = false
        this.idSeleccionado = ''
    }
}
