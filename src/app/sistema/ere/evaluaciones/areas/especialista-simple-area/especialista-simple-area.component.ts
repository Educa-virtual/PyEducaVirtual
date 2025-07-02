import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'

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

interface Column {
    field: string
    header: string
}

interface AreaDetalle {
    id: number
    area: string
    cuadernillo: string
    hojaRespuestas: string
    matriz: string
    estado: string
}

@Component({
    selector: 'app-especialista-simple-area',
    standalone: true,
    imports: [PrimengModule, DialogGenerarCuadernilloComponent],
    templateUrl: './especialista-simple-area.component.html',
    styleUrl: './especialista-simple-area.component.scss',
})
export class EspecialistaSimpleAreaComponent implements OnInit {
    title: string = 'Lista de áreas de PRUEBA DE INICIO 2025 - nivel Inicio'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}

    // Configuracion tabla
    cols: Column[] = []
    terminoBusqueda: string = ''

    // Estados de áreas detalle
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

    // Datos de curso especialista
    datosCurso: AreaDetalle[] = []
    datosAreaDetalleFiltrados: AreaDetalle[] = []
    mostrarDialogoEdicion: boolean = false

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        console.log('log OnInit')

        // Inicializar breadcrumb
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }
        this.breadCrumbItems = [{ label: 'Especialistas' }]

        // Inicializar columnas
        this.cols = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            {
                field: 'cuadernilloEvaluacion',
                header: 'Cuadernillo de Evaluación',
            },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz de Evaluación' },
            { field: 'acciones', header: 'Acciones' },
        ]

        // Datos de ejemplo
        this.datosCurso = [
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

        this.datosAreaDetalleFiltrados = [...this.datosCurso]
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

    // Descargar PDF
    descargarPDF(tipo: string, areaDetalle: AreaDetalle): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${areaDetalle.area}`,
        })
    }

    // Abrir diálogo para generar cuadernillo
    abrirDialogoGenerarCuadernillo(areaDetalle: AreaDetalle): void {
        console.log(
            'Abriendo diálogo para generar cuadernillo:',
            areaDetalle.area
        )
        this.mostrarDialogoEdicion = true
    }
}
