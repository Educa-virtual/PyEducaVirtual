import { Component, inject, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosInformesService } from '../../services/datos-informes.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MessageService } from 'primeng/api'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ChartOptions } from 'chart.js'
import { formatNumber } from '@angular/common'

@Component({
    selector: 'app-informes-ere',
    standalone: true,
    templateUrl: './informes-ere.component.html',
    styleUrls: ['./informes-ere.component.scss'],
    imports: [
        ContainerPageComponent,
        PrimengModule,
        ChartModule,
        TablePrimengComponent,
    ],
})
export class InformesEreComponent implements OnInit {
    formFiltros: FormGroup
    data_doughnut: any
    options_doughnut: any
    data_bar: any
    options_bar: ChartOptions

    resultados: Array<object>
    resumen: Array<object>
    matriz: Array<object>
    promedio: Array<object>

    niveles_nombres: Array<any>
    niveles_resumen: Array<any>
    hay_resultados: boolean = false

    evaluaciones_cursos_ies: Array<object>
    evaluaciones: Array<object>
    cursos: Array<object>
    nivel_tipos: Array<object>
    nivel_grados: Array<object>
    distritos: Array<object>
    ies: Array<object>
    secciones: Array<object>
    sexos: Array<object>

    private _MessageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private datosInformes: DatosInformesService,
        private constantesService: ConstantesService
    ) {}

    ngOnInit() {
        try {
            this.formFiltros = this.fb.group({
                iYAcadId: [
                    this.constantesService.iYAcadId,
                    Validators.required,
                ],
                iSesionId: [
                    this.constantesService.iCredId,
                    Validators.required,
                ],
                iEvaluacionId: [null, Validators.required],
                iCursoId: [null, Validators.required],
                iNivelTipoId: [null, Validators.required],
                iNivelGradoId: [null, Validators.required],
                iDsttId: [null],
                iIieeId: this.constantesService.iIieeId,
                iSeccionId: [null],
                cPersSexo: [null],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.sexos = this.datosInformes.getSexos()
        this.datosInformes
            .obtenerEvaluacionesCursosIes(this.formFiltros.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data.data, 'data evaluaciones')
                    this.evaluaciones_cursos_ies = data.data
                    this.filterEvaluaciones()
                    this.filterNivelTipos()
                },
                error: (error) => {
                    console.error(
                        'Error consultando datos de evaluaciones:',
                        error
                    )
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

        this.formFiltros
            .get('iEvaluacionId')
            .valueChanges.subscribe((value) => {
                this.cursos = []
                this.distritos = []
                this.formFiltros.get('iCursoId')?.setValue(null)
                this.formFiltros.get('iDsttId')?.setValue(null)
                if (value) {
                    this.filterCursos(value)
                    this.filterDistritos(value)
                }
            })
        this.formFiltros.get('iDsttId').valueChanges.subscribe((value) => {
            this.ies = []
            this.formFiltros.get('iIieeId')?.setValue(null)
            if (value) {
                this.filterIes(value)
            }
        })
        this.formFiltros.get('iNivelTipoId').valueChanges.subscribe((value) => {
            this.nivel_grados = []
            this.secciones = []
            this.formFiltros.get('iNivelGradoId')?.setValue(null)
            this.formFiltros.get('iSeccionId')?.setValue(null)
            if (value) {
                this.filterGrados(value)
            }
        })
        this.formFiltros
            .get('iNivelGradoId')
            .valueChanges.subscribe((value) => {
                this.secciones = []
                this.formFiltros.get('iSeccionId')?.setValue(null)
                if (value) {
                    this.filterSecciones(value)
                }
            })
    }

    filterEvaluaciones() {
        this.evaluaciones = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iEvaluacionId &&
                        item.label === current.cEvaluacionNombre
                )
                if (!x) {
                    return prev.concat([
                        {
                            value: current.iEvaluacionId,
                            label: current.cEvaluacionNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.evaluaciones, 'evaluaciones')
    }

    filterCursos(iEvaluacionId: any) {
        this.cursos = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iCursoId &&
                        item.label === current.cCursoNombre
                )
                if (!x && current.iEvaluacionId === iEvaluacionId) {
                    return prev.concat([
                        {
                            value: current.iCursoId,
                            label: current.cCursoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.cursos, 'cursos')
    }

    filterNivelTipos() {
        this.nivel_tipos = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iNivelTipoId &&
                        item.label === current.cNivelTipoNombre
                )
                if (!x) {
                    return prev.concat([
                        {
                            value: current.iNivelTipoId,
                            label: current.cNivelTipoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.nivel_grados, 'nivel grados')
    }

    filterGrados(iNivelTipoId: any) {
        this.nivel_grados = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iNivelGradoId &&
                        item.label === current.cGradoNombre
                )
                if (!x && current.iNivelTipoId === iNivelTipoId) {
                    return prev.concat([
                        {
                            value: current.iNivelGradoId,
                            label: current.cGradoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.nivel_grados, 'nivel grados')
    }

    filterDistritos(iEvaluacionId: any) {
        this.distritos = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iDsttId &&
                        item.label === current.cDsttNombre
                )
                if (!x && current.iEvaluacionId === iEvaluacionId) {
                    return prev.concat([
                        {
                            value: current.iDsttId,
                            label: current.cDsttNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.distritos, 'distritos')
    }

    filterIes(iDsstId: any) {
        this.ies = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iIieeId &&
                        item.label === current.cIieeNombre
                )
                if (!x && current.iDsstId === iDsstId) {
                    return prev.concat([
                        {
                            value: current.iIieeId,
                            label: current.cIieeNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.distritos, 'distritos')
    }

    filterSecciones(iNivelGradoId: any) {
        this.secciones = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value === current.iSeccionId &&
                        item.label === current.cSeccionNombre
                )
                if (!x && current.iNivelGradoId === iNivelGradoId) {
                    return prev.concat([
                        {
                            value: current.iSeccionId,
                            label: current.cSeccionNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        if (this.secciones.length === 1) {
            this.formFiltros
                .get('iSeccionId')
                ?.setValue(this.secciones[0]['id'])
        }
        console.log(this.secciones, 'secciones')
    }

    searchResultados() {
        if (this.formFiltros.invalid) {
            this._MessageService.add({
                severity: 'warning',
                summary: 'Advertencia',
                detail: 'Debe seleccionar los filtros requeridos',
            })
            return
        }
        this.datosInformes
            .obtenerInformeResumen(this.formFiltros.value)
            .subscribe({
                next: (data: any) => {
                    this.resultados = data.data[0]
                    this.resumen = data.data[1]
                    this.matriz = data.data[2]
                    this.mostrarEstadisticaNivel()
                    this.generarColumnas(this.resumen)
                    this.mostrarEstadisticaPregunta()
                },
                error: (error) => {
                    console.error('Error consultando resultados:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    mostrarEstadisticaNivel() {
        if (this.resultados.length == 0) {
            this.hay_resultados = false
            return
        }

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.hay_resultados = true

        this.niveles_nombres = this.resultados.reduce(
            (prev: any, current: any) => {
                const x = prev.find((item) => item === current.nivel_logro)
                if (!x) {
                    return prev.concat([current.nivel_logro])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.niveles_nombres, 'niveles')

        this.niveles_resumen = this.resultados.reduce(
            (acumulador: any, item: any) => {
                const nivel = item.nivel_logro
                if (acumulador[nivel]) {
                    acumulador[nivel]++
                } else {
                    acumulador[nivel] = 1
                }
                return acumulador
            },
            {}
        )

        const niveles_nombres = Object.keys(this.niveles_resumen)
        const niveles_valores = Object.values(this.niveles_resumen)

        this.data_doughnut = {
            labels: niveles_nombres,
            datasets: [
                {
                    data: niveles_valores,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                    ],
                },
            ],
        }

        this.options_doughnut = {
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                    },
                },
            },
        }

        this.mostrarPromedio(niveles_nombres, niveles_valores)
    }

    generarColumnas(data: any) {
        if (data.length == 0) {
            return
        }
        const columnas = [
            {
                type: 'text',
                width: '1rem',
                field: 'metrica',
                header: 'Items',
                text_header: 'left',
                text: 'left',
            },
        ]
        for (let col = 1, len = Object.keys(data[0]).length; col < len; col++) {
            columnas.push({
                type: 'text',
                width: '1rem',
                field: `${col}`,
                header: `${col}`,
                text_header: 'center',
                text: 'left',
            })
        }
        this.columns_resumen = columnas
    }

    mostrarEstadisticaPregunta() {
        if (this.resumen.length == 0) {
            return
        }

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        const preguntas = []
        const aciertos = []
        const fila_aciertos = this.resumen.findIndex(
            (item: any) => item.metrica == '% DE ACIERTOS'
        )
        const desaciertos = []
        const fila_desaciertos = this.resumen.findIndex(
            (item: any) => item.metrica == '% DE DESACIERTOS'
        )
        const blancos = []
        const fila_blancos = this.resumen.findIndex(
            (item: any) => item.metrica == '% DE BLANCOS'
        )
        for (let i = 1; i < Object.keys(this.resumen[0]).length; i++) {
            preguntas.push(i)
            aciertos.push(this.resumen[fila_aciertos][i])
            desaciertos.push(this.resumen[fila_desaciertos][i])
            blancos.push(this.resumen[fila_blancos][i])
        }

        this.data_bar = {
            labels: preguntas,
            datasets: [
                {
                    label: '% DE ACIERTOS',
                    backgroundColot:
                        documentStyle.getPropertyValue('--blue-500'),
                    hoverBackgroundColot:
                        documentStyle.getPropertyValue('--blue-400'),
                    data: aciertos,
                },
                {
                    label: '% DE DESACIERTOS',
                    backgroundColot:
                        documentStyle.getPropertyValue('--red-500'),
                    hoverBackgrounfColor:
                        documentStyle.getPropertyValue('--red-400'),
                    data: desaciertos,
                },
                {
                    label: '% DE BLANCOS',
                    backgroundColot:
                        documentStyle.getPropertyValue('--yellow-500'),
                    hoverBackgroundColot:
                        documentStyle.getPropertyValue('--yellow-400'),
                    data: blancos,
                },
            ],
        }

        this.options_bar = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        stepSize: 1,
                    },
                },
                y: {
                    max: 100,
                    stacked: true,
                },
            },
        }
    }

    mostrarPromedio(niveles, valores) {
        const total = valores.reduce((acc, cur) => acc + cur)
        const porcentajes = valores.map((valor) =>
            formatNumber((valor * 100) / total, 'es', '1.1-1')
        )
        const data = []
        for (let i = 0; i < niveles.length; i++) {
            data.push({
                nivel: niveles[i],
                valor: valores[i],
                porcentaje: porcentajes[i] + '%',
            })
        }
        this.promedio = data
    }

    accionBtnItemTable({ accion, item }) {
        console.log(accion, item)
    }
    selectedItems = []

    actions: IActionTable[] = []

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '#',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cod_ie',
            header: 'I.E.',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'distrito',
            header: 'Distrito',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'seccion',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'estudiante',
            header: 'Estudiante',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'aciertos',
            header: 'Aciertos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'desaciertos',
            header: 'Desaciertos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'blancos',
            header: 'Blancos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nivel_logro',
            header: 'Nivel',
            text_header: 'center',
            text: 'center',
        },
    ]

    columns_resumen = []

    columns_matriz = [
        {
            type: 'text',
            width: '1rem',
            field: 'pregunta_nro',
            header: '#',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'competencia',
            header: 'COMPETENCIA',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'desempeno',
            header: 'DESEMPEÑO',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'aciertos',
            header: 'ACIERTOS',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'desaciertos',
            header: 'DESACIERTOS',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'porcentaje_aciertos',
            header: '% DE ACIERTOS',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'porcentaje_desaciertos',
            header: '% DE DESACIERTOS',
            text_header: 'left',
            text: 'center',
        },
    ]

    columns_promedio = [
        {
            type: 'text',
            width: '15rem',
            field: 'nivel',
            header: 'NIVEL DE LOGRO',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'valor',
            header: 'NÚMERO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'porcentaje',
            header: 'PORCENTAJE',
            text_header: 'center',
            text: 'center',
        },
    ]
}
