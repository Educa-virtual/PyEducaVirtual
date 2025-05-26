import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'

interface Recurso {
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

interface EstadoRecurso {
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
    imports: [PrimengModule, DialogGenerarCuadernilloComponent],
    templateUrl: './simple-lista-areas.component.html',
    styleUrl: './simple-lista-areas.component.scss',
})
export class SimpleListaAreasComponent implements OnInit {
    title: string = 'Lista de áreas de PRUEBA DE INICIO 2025 - nivel Inicio'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}

    // Datos de recursos
    recursos: Recurso[] = []
    recursos4to: Recurso[] = []
    recursos6to: Recurso[] = []

    // Datos filtrados
    datosRecursosFiltrados: Recurso[] = []
    datosRecursos4toFiltrados: Recurso[] = []
    datosRecursos6toFiltrados: Recurso[] = []

    // Configuración de tabla
    cols: Column[] = []
    terminoBusqueda: string = ''

    mostrarDialogoEdicion: boolean = false

    // Estados de recursos
    estadosRecurso: { [key: string]: EstadoRecurso } = {
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
        this.recursos = [
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
        this.recursos4to = [
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
        this.recursos6to = [
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

    // Filtrar recursos
    filtrarRecursos(): void {
        this.applyFilters()
    }

    private applyFilters(): void {
        if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
            this.datosRecursosFiltrados = [...this.recursos]
            this.datosRecursos4toFiltrados = [...this.recursos4to]
            this.datosRecursos6toFiltrados = [...this.recursos6to]
        } else {
            const termino = this.terminoBusqueda.toLowerCase().trim()

            this.datosRecursosFiltrados = this.recursos.filter((recurso) =>
                recurso.area.toLowerCase().includes(termino)
            )

            this.datosRecursos4toFiltrados = this.recursos4to.filter(
                (recurso) => recurso.area.toLowerCase().includes(termino)
            )

            this.datosRecursos6toFiltrados = this.recursos6to.filter(
                (recurso) => recurso.area.toLowerCase().includes(termino)
            )
        }
    }

    // Limpiar búsqueda
    limpiarBusqueda(): void {
        this.terminoBusqueda = ''
        this.applyFilters()
    }

    // Descargar PDF
    descargarPDF(tipo: string, recurso: Recurso): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${recurso.area}`,
        })
    }

    // Ejecutar acción según el estado
    ejecutarAccion(accion: string, recurso: Recurso): void {
        switch (accion) {
            case 'completar':
                this.completarEvaluacion(recurso)
                break
            case 'ver':
                this.verResultados(recurso)
                break
        }
    }

    completarEvaluacion(recurso: Recurso): void {
        // Cambiar estado directamente sin abrir diálogo
        recurso.estado = 'completo'

        /*this.messageService.add({
            severity: 'success',
            summary: 'Estado actualizado',
            detail: `${recurso.area} marcado como completo`,
        });
        */
    }

    private verResultados(recurso: Recurso): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Ver resultados',
            detail: `Viendo resultados de ${recurso.area}`,
        })
    }

    // Obtener configuración del estado
    obtenerConfiguracionEstado(estado: string): EstadoRecurso {
        return (
            this.estadosRecurso[estado] || {
                label: estado,
                icon: 'pi pi-question',
                severity: 'secondary',
                accion: 'ver',
            }
        )
    }

    abrirDialogoEdicion(recurso: Recurso): void {
        console.log('Abriendo diálogo para:', recurso.area) // Usar el parámetro
        this.mostrarDialogoEdicion = true
    }

    abrirDialogoGenerarCuadernillo(recurso: Recurso): void {
        console.log('Abriendo diálogo para generar cuadernillo:', recurso.area)
        this.mostrarDialogoEdicion = true
    }
}
