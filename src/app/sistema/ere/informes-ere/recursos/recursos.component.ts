import { PrimengModule } from '@/app/primeng.module'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

interface Recurso {
    id: number
    area: string
    cuadernillo: string
    hojaRespuestas: string
    matriz: string
    estado: string // Cambio 'resultado' por 'estado'
}

interface Column {
    field: string
    header: string
}

// Interface EstadoRecurso
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
    selector: 'app-recursos',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './recursos.component.html',
    styleUrl: './recursos.component.scss',
})
export class RecursosComponent implements OnInit {
    title: string = 'Lista de áreas de PRUEBA DE INICIO 2025 - nivel Inicio'
    segundoGrado: string = '2º Grado'
    cuartoGrado: string = '4º Grado'
    sextoGrado: string = '6º Grado'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    datosRecursosFiltrados: any[] = []
    datosRecursos4toFiltrados: any[] = []
    datosRecursos6toFiltrados: any[] = []

    // Definición de estados
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

    // Datos para la tabla 2do grado
    recursos!: Recurso[]

    // Datos para 4to grado
    recursos4to!: Recurso[]

    // Datos para 6to grado
    recursos6to!: Recurso[]

    cols!: Column[]
    terminoBusqueda: string = ''
    selectedItem: any

    constructor(
        private messageService: MessageService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit(): void {
        console.log('Inicializando componente Recursos')

        // home / breadcrumb
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }

        this.breadCrumbItems = [{ label: 'Recursos' }]

        // Inicializar datos de recursos 2do grado
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
                estado: 'pendiente',
            },
        ]

        // Inicializar datos de recursos 4to grado
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

        // Inicializar datos de recursos 6to grado
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
                estado: 'pendiente',
            },
        ]

        // Definir columnas
        this.cols = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo de Evaluación' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz de Evaluación' },
            { field: 'estado', header: 'Estado' },
        ]

        // Inicializar datos filtrados
        this.datosRecursosFiltrados = [...this.recursos]
        this.datosRecursos4toFiltrados = [...this.recursos4to]
        this.datosRecursos6toFiltrados = [...this.recursos6to]
    }

    // Filtrar recursos
    filtrarRecursos() {
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
    limpiarBusqueda() {
        this.terminoBusqueda = ''
        this.datosRecursosFiltrados = [...this.recursos]
        this.datosRecursos4toFiltrados = [...this.recursos4to]
        this.datosRecursos6toFiltrados = [...this.recursos6to]
    }

    // Ejecutar acciones según el estado
    ejecutarAccion(accion: string, recurso: Recurso) {
        switch (accion) {
            case 'completar':
                this.completarEvaluacion(recurso)
                break
            case 'ver':
                this.verResultados(recurso)
                break
        }
    }

    // Acciones de botones
    descargarPDF(tipo: string, recurso: Recurso) {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${recurso.area}`,
        })
    }

    completarEvaluacion(recurso: Recurso) {
        this.messageService.add({
            severity: 'info',
            summary: 'Completar',
            detail: `Completando evaluación de ${recurso.area}`,
        })

        // Cambiar estado a completo
        recurso.estado = 'completo'
    }

    verResultados(recurso: Recurso) {
        this.messageService.add({
            severity: 'info',
            summary: 'Ver resultados',
            detail: `Viendo resultados de ${recurso.area}`,
        })
    }
}
