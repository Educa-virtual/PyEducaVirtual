import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'

interface PreguntaRespuesta {
    id: number
    pregunta: string
    totalRespuestas: number
    tipo: 'chart' | 'pie'
    datos: any[]
}

interface Seccion {
    titulo: string
    preguntas: PreguntaRespuesta[]
    expandida: boolean
}

@Component({
    selector: 'app-respuesta-preguntas-encuesta',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './respuesta-preguntas-encuesta.component.html',
    styleUrl: './respuesta-preguntas-encuesta.component.scss',
})
export class RespuestaPreguntasEncuestaComponent implements OnInit {
    participantesSeleccionados: string = 'Todos'
    totalRespuestas: number = 58

    participantesOptions = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Participantes Activos', value: 'Activos' },
        { label: 'Participantes Inactivos', value: 'Inactivos' },
    ]

    secciones: Seccion[] = [
        {
            titulo: 'SECCIÓN 1: DATOS GENERALES',
            expandida: true,
            preguntas: [
                {
                    id: 1,
                    pregunta:
                        '¿Cuáles son los planes específicos con que cuenta?',
                    totalRespuestas: 9,
                    tipo: 'chart',
                    datos: [
                        { label: 'ZXCZXC', value: 1, color: '#3B82F6' },
                        { label: 'ZCXZXC', value: 1, color: '#EF4444' },
                        { label: 'Columna 3', value: 1, color: '#F59E0B' },
                    ],
                },
                {
                    id: 2,
                    pregunta: '¿Cuenta con planes específicos de monitoreo?',
                    totalRespuestas: 5,
                    tipo: 'pie',
                    datos: [
                        { label: 'Opción 1', value: 20, color: '#10B981' },
                        { label: 'SXS', value: 30, color: '#EF4444' },
                        { label: 'XSX', value: 25, color: '#F59E0B' },
                        { label: 'XS', value: 25, color: '#8B5CF6' },
                    ],
                },
            ],
        },
        {
            titulo: 'SECCIÓN 2: MONITOREO Y SEGUIMIENTO',
            expandida: false,
            preguntas: [],
        },
        {
            titulo: 'SECCIÓN 3: EVALUACIÓN Y RESULTADOS',
            expandida: false,
            preguntas: [],
        },
    ]

    ngOnInit() {
        console.log('RespuestaPreguntasEncuestaComponent initialized')
    }

    exportarExcel() {
        console.log('Exportando a Excel...')
    }

    exportarPDF() {
        console.log('Exportando a PDF...')
    }

    onSeccionToggle(index: number) {
        this.secciones[index].expandida = !this.secciones[index].expandida
    }

    getChartData(datos: any[]) {
        return {
            labels: datos.map((d) => d.label),
            datasets: [
                {
                    data: datos.map((d) => d.value),
                    backgroundColor: datos.map((d) => d.color),
                    borderWidth: 0,
                },
            ],
        }
    }

    getPieData(datos: any[]) {
        return {
            labels: datos.map((d) => d.label),
            datasets: [
                {
                    data: datos.map((d) => d.value),
                    backgroundColor: datos.map((d) => d.color),
                    borderWidth: 0,
                },
            ],
        }
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top' as const,
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 0.5,
                    },
                },
            },
        }
    }

    getPieOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right' as const,
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                    },
                },
            },
        }
    }
}
