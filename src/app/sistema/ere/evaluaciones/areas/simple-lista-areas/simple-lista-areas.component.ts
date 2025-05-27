import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'
import { ConfigurarNivelLogroComponent } from '../configurar-nivel-logro/configurar-nivel-logro.component'

interface AreaDetalle {
    id: number
    area: string
    cuadernillo: string
    hojaRespuestas: string
    matriz: string
    estado: string
}

interface Column {
    field: string
    header: string
}

interface EstadoAreaDetalle {
    label: string
    icon: string
    severity:
        | 'success'
        | 'info'
        | 'warning'
        | 'danger'
        | 'help'
        | 'primary'
        | 'secondary'
        | 'contrast'
    accion: string
}

@Component({
    selector: 'app-simple-lista-areas',
    standalone: true,
    imports: [
        PrimengModule,
        DialogGenerarCuadernilloComponent,
        ConfigurarNivelLogroComponent,
    ],
    templateUrl: './simple-lista-areas.component.html',
    styleUrl: './simple-lista-areas.component.scss',
})
export class SimpleListaAreasComponent implements OnInit {
    title: string = 'Lista de áreas de PRUEBA DE INICIO 2025 - nivel Inicio'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}

    // Datos de área detalle
    areasDetalle: AreaDetalle[] = []
    areasDetalle4to: AreaDetalle[] = []
    areasDetalle6to: AreaDetalle[] = []

    // Datos filtrados
    datosAreaDetalleFiltrados: AreaDetalle[] = []
    datosAreaDetalle4toFiltrados: AreaDetalle[] = []
    datosAreaDetalle6toFiltrados: AreaDetalle[] = []

    // Configuración de tabla
    cols: Column[] = []
    terminoBusqueda: string = ''

    //dialog
    mostrarDialogoEdicion: boolean = false
    visible: boolean = false

    // Estados de área detalle
    estadosAreaDetalle: { [key: string]: EstadoAreaDetalle } = {
        completo: {
            label: 'Completo',
            icon: 'pi pi-eye',
            severity: 'success',
            accion: 'ver',
        },
        pendiente: {
            label: 'Pendiente',
            icon: 'pi pi-arrow-right',
            severity: 'warning',
            accion: 'completar',
        },
    }

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.initializeBreadcrumb()
        this.initializeData()
        this.initializeColumns()
        this.applyFilters()
    }

    private initializeBreadcrumb(): void {
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }
        this.breadCrumbItems = [{ label: 'Lista Simple de Áreas' }]
    }

    private initializeData(): void {
        // Datos para 2do grado
        this.areasDetalle = [
            {
                id: 1,
                area: 'Matemática',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
            {
                id: 2,
                area: 'Comunicación',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'completo',
            },
        ]

        // Datos para 4to grado
        this.areasDetalle4to = [
            {
                id: 1,
                area: 'Matemática',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
            {
                id: 2,
                area: 'Comunicación',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'completo',
            },
        ]

        // Datos para 6to grado
        this.areasDetalle6to = [
            {
                id: 1,
                area: 'Matemática',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
            {
                id: 2,
                area: 'Comunicación',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'completo',
            },
        ]
    }

    private initializeColumns(): void {
        this.cols = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz' },
            { field: 'estado', header: 'Estado' },
        ]
    }

    // Filtrar área detalle
    filtrarAreaDetalle(): void {
        this.applyFilters()
    }

    private applyFilters(): void {
        if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
            this.datosAreaDetalleFiltrados = [...this.areasDetalle]
            this.datosAreaDetalle4toFiltrados = [...this.areasDetalle4to]
            this.datosAreaDetalle6toFiltrados = [...this.areasDetalle6to]
        } else {
            const termino = this.terminoBusqueda.toLowerCase().trim()

            this.datosAreaDetalleFiltrados = this.areasDetalle.filter(
                (areaDetalle) =>
                    areaDetalle.area.toLowerCase().includes(termino)
            )

            this.datosAreaDetalle4toFiltrados = this.areasDetalle4to.filter(
                (areaDetalle) =>
                    areaDetalle.area.toLowerCase().includes(termino)
            )

            this.datosAreaDetalle6toFiltrados = this.areasDetalle6to.filter(
                (areaDetalle) =>
                    areaDetalle.area.toLowerCase().includes(termino)
            )
        }
    }

    // Limpiar búsqueda
    limpiarBusqueda(): void {
        this.terminoBusqueda = ''
        this.applyFilters()
    }

    // Descargar PDF
    descargarPDF(tipo: string, areaDetalle: AreaDetalle): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${areaDetalle.area}`,
        })
    }

    // Ejecutar acción según el estado
    ejecutarAccion(accion: string, areaDetalle: AreaDetalle): void {
        switch (accion) {
            case 'completar':
                this.completarEvaluacion(areaDetalle)
                break
            case 'ver':
                this.verResultados(areaDetalle)
                break
        }
    }

    completarEvaluacion(areaDetalle: AreaDetalle): void {
        // Cambiar estado directamente sin abrir diálogo
        areaDetalle.estado = 'completo'

        /*this.messageService.add({
            severity: 'success',
            summary: 'Estado actualizado',
            detail: `${areaDetalle.area} marcado como completo`,
        });
        */
    }

    private verResultados(areaDetalle: AreaDetalle): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Ver resultados',
            detail: `Viendo resultados de ${areaDetalle.area}`,
        })
    }

    // Obtener configuración del estado
    obtenerConfiguracionEstado(estado: string): EstadoAreaDetalle {
        return (
            this.estadosAreaDetalle[estado] || {
                label: estado,
                icon: 'pi pi-question',
                severity: 'secondary',
                accion: 'ver',
            }
        )
    }

    abrirDialogoEdicion(areaDetalle: AreaDetalle): void {
        console.log('Abriendo diálogo para:', areaDetalle.area) // Usar el parámetro
        this.mostrarDialogoEdicion = true
    }

    abrirDialogoGenerarCuadernillo(areaDetalle: AreaDetalle): void {
        console.log(
            'Abriendo diálogo para generar cuadernillo:',
            areaDetalle.area
        )
        this.mostrarDialogoEdicion = true
    }
}
