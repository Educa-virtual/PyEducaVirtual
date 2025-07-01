import { ConstantesService } from '@/app/servicios/constantes.service'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { ApiAulaService } from '../../aula-virtual/services/api-aula.service'
import { CardCapacitacionesComponent } from '../solicitud-Inscripcion/card-capacitaciones/card-capacitaciones.component'
import { DropdownChangeEvent } from 'primeng/dropdown'
import { PaginatorModule } from 'primeng/paginator'
import { PrimengModule } from '@/app/primeng.module'
import { CertificacionAcademicaComponent } from './certificacion-academica/certificacion-academica.component'

@Component({
    selector: 'app-resultados-cursos',
    standalone: true,
    templateUrl: './resultados-cursos.component.html',
    styleUrls: ['./resultados-cursos.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        CardCapacitacionesComponent,
        PaginatorModule,
        CertificacionAcademicaComponent,
    ],
})
export class ResultadosCursosComponent implements OnInit {
    private _ConstantesService = inject(ConstantesService)
    private _aulaService = inject(ApiAulaService)

    iTipoCapId: any = 0
    data: any[] = [] //Información general de cursos
    capacitaciones: any[] = [] //Datos de capacitación
    capacitacionFiltrado: any[] = [] // variable de busqueda
    tipoCapacitacionSearch: any[] = [] // Datos de tipo de capacitación para búsqueda
    tipoCapacitacion: any[] = [] // Datos de tipo de capacitación
    detalleVisible = false
    idSeleccionado!: string
    paginator = {
        first: 0,
        rows: 5,
        total: 2,
        rowsPerPage: [],
    }

    constructor() {}

    ngOnInit() {
        this.obtenerCapacitaciones()
        this.obtenerTipoCapacitacion()
    }
    onPageChange(event: any): void {
        this.paginator.first = event.first
        this.paginator.rows = event.rows
        const start = event.first
        const end = event.first + event.rows
        this.data = this.capacitaciones?.slice(start, end)
    }

    // obtener y listar las capacitaciones
    obtenerCapacitaciones() {
        const iEstado = 2
        const iCredId = this._ConstantesService.iCredId
        const data = {
            iEstado: iEstado,
            iCredId: iCredId,
        }

        this._aulaService.obtenerCapacitacion(data).subscribe({
            next: (res: any) => {
                this.data = res['data']
                // console.log('Capacitaciones:', this.data)
                this.capacitaciones = [...this.data] // cargar desde servicio o mock
                this.paginator.total = this.capacitaciones.length
                this.onPageChange({ first: 0, rows: this.paginator.rows }) // inicial
                this.capacitacionFiltrado = [...this.data] // Hacer una copia para filtrar
            },
        })
    }
    // metodo para obtener tipo capacitación:
    obtenerTipoCapacitacion() {
        const userId = 1
        this._aulaService.obtenerTipoCapacitacion(userId).subscribe((Data) => {
            this.tipoCapacitacion = Data['data']
            this.tipoCapacitacionSearch = [...this.tipoCapacitacion]
            this.tipoCapacitacionSearch.unshift({
                iTipoCapId: 0,
                cTipoCapNombre: 'Todos los tipos',
            })
        })
    }
    onVerDetalle(id: any) {
        // console.log('onVerDetalle', id)
        this.idSeleccionado = id
        this.detalleVisible = true
    }

    volverALista() {
        this.detalleVisible = false
        this.idSeleccionado = ''
    }
    filtrarCapacitaciones(event: DropdownChangeEvent) {
        const iTipoCapId = event.value
        this.data = [...this.capacitacionFiltrado]
        if (!iTipoCapId || !this.data) return
        if (iTipoCapId === '0') {
            this.data = [...this.capacitacionFiltrado] // Mostrar todas las capacitaciones
        } else {
            this.data = this.capacitacionFiltrado.filter(
                (capacitacion: any) => capacitacion.iTipoCapId === iTipoCapId
            )
        }
    }
}
