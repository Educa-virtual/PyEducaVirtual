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
    // campos para especialista
    archivoSubido?: boolean
    fechaSubido?: string
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

interface GradoConfig {
    grado: string
    areas: AreaDetalle[]
    areasFiltradas: AreaDetalle[]
    esEspecialista?: boolean
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
    //private _ConstantesService = inject(ConstantesService)

    title: string = 'Lista de áreas de PRUEBA DE INICIO 2025 - nivel Inicio'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}

    // DATOS UNIFICADOS - Reemplaza areasDetalle, areasDetalle4to, areasDetalle6to
    gradosConfig: GradoConfig[] = []
    terminoBusqueda: string = ''

    // Configuración de tabla
    cols: Column[] = []
    colsEspecialista: Column[] = []

    // Diálogos
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
        this.initializeColumns()
        this.initializeData()
        this.applyFilters()
    }

    private initializeBreadcrumb(): void {
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }
        this.breadCrumbItems = [{ label: 'Lista Simple de Áreas' }]
    }

    private initializeColumns(): void {
        // Columnas para tablas de grados
        this.cols = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz' },
            { field: 'estado', header: 'Estado' },
        ]

        // Columnas para tabla de especialista
        this.colsEspecialista = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz' },
            { field: 'acciones', header: 'Acciones' },
        ]
    }

    private initializeData(): void {
        // Datos base
        const areasBase: AreaDetalle[] = [
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

        // Configurar grados
        this.gradosConfig = [
            {
                grado: '2°',
                areas: [...areasBase],
                areasFiltradas: [...areasBase],
            },
            {
                grado: '4°',
                areas: [...areasBase],
                areasFiltradas: [...areasBase],
            },
            {
                grado: '6°',
                areas: [...areasBase],
                areasFiltradas: [...areasBase],
            },
            {
                grado: '2°',
                areas: [...areasBase],
                areasFiltradas: [...areasBase],
                esEspecialista: true,
            },
        ]
    }

    // Filtrado unificado
    filtrarAreaDetalle(): void {
        this.applyFilters()
    }

    private applyFilters(): void {
        if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
            // Sin filtro: copiar todas las áreas
            this.gradosConfig.forEach((grado) => {
                grado.areasFiltradas = [...grado.areas]
            })
        } else {
            // Con filtro: aplicar a todos los grados
            const termino = this.terminoBusqueda.toLowerCase().trim()

            this.gradosConfig.forEach((grado) => {
                grado.areasFiltradas = grado.areas.filter((area) =>
                    area.area.toLowerCase().includes(termino)
                )
            })
        }
    }

    limpiarBusqueda(): void {
        this.terminoBusqueda = ''
        this.applyFilters()
    }

    descargarPDF(tipo: string, areaDetalle: AreaDetalle): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${areaDetalle.area}`,
        })
    }

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
        areaDetalle.estado = 'completo'
    }

    private verResultados(areaDetalle: AreaDetalle): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Ver resultados',
            detail: `Viendo resultados de ${areaDetalle.area}`,
        })
    }

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
        console.log('Abriendo diálogo para:', areaDetalle.area)
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
