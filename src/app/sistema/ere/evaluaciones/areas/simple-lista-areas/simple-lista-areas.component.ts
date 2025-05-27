import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'
import { ConfigurarNivelLogroComponent } from '../configurar-nivel-logro/configurar-nivel-logro.component'

interface Curso {
    id: number
    area: string
    cuadernillo: string
    hojaRespuestas: string
    matriz: string
    estado: string
    archivoSubido?: boolean
    fechaSubido?: string
}

interface Column {
    field: string
    header: string
}

interface EstadoCurso {
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
    cursos: Curso[]
    cursosFiltrados: Curso[]
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

    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}

    gradosConfig: GradoConfig[] = []
    terminoBusqueda: string = ''

    cols: Column[] = []
    colsEspecialista: Column[] = []

    mostrarDialogoEdicion: boolean = false
    visible: boolean = false

    estadosCurso: { [key: string]: EstadoCurso } = {
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
        this.cols = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz' },
            { field: 'estado', header: 'Estado' },
        ]

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
        const cursosBase: Curso[] = [
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

        this.gradosConfig = [
            {
                grado: '2°',
                cursos: [...cursosBase],
                cursosFiltrados: [...cursosBase],
            },
            {
                grado: '4°',
                cursos: [...cursosBase],
                cursosFiltrados: [...cursosBase],
            },
            {
                grado: '6°',
                cursos: [...cursosBase],
                cursosFiltrados: [...cursosBase],
            },
            {
                grado: '2°',
                cursos: [...cursosBase],
                cursosFiltrados: [...cursosBase],
                esEspecialista: true,
            },
        ]
    }

    filtrarCurso(): void {
        this.applyFilters()
    }

    private applyFilters(): void {
        if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
            this.gradosConfig.forEach((grado) => {
                grado.cursosFiltrados = [...grado.cursos]
            })
        } else {
            const termino = this.terminoBusqueda.toLowerCase().trim()

            this.gradosConfig.forEach((grado) => {
                grado.cursosFiltrados = grado.cursos.filter((curso) =>
                    curso.area.toLowerCase().includes(termino)
                )
            })
        }
    }

    limpiarBusqueda(): void {
        this.terminoBusqueda = ''
        this.applyFilters()
    }

    descargarPDF(tipo: string, curso: Curso): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${curso.area}`,
        })
    }

    ejecutarAccion(accion: string, curso: Curso): void {
        switch (accion) {
            case 'completar':
                this.completarEvaluacion(curso)
                break
            case 'ver':
                this.verResultados(curso)
                break
        }
    }

    completarEvaluacion(curso: Curso): void {
        curso.estado = 'completo'
    }

    private verResultados(curso: Curso): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Ver resultados',
            detail: `Viendo resultados de ${curso.area}`,
        })
    }

    obtenerConfiguracionEstado(estado: string): EstadoCurso {
        return (
            this.estadosCurso[estado] || {
                label: estado,
                icon: 'pi pi-question',
                severity: 'secondary',
                accion: 'ver',
            }
        )
    }

    abrirDialogoEdicion(curso: Curso): void {
        console.log('Abriendo diálogo para:', curso.area)
        this.mostrarDialogoEdicion = true
    }

    abrirDialogoGenerarCuadernillo(curso: Curso): void {
        console.log('Abriendo diálogo para generar cuadernillo:', curso.area)
        this.mostrarDialogoEdicion = true
    }
}
