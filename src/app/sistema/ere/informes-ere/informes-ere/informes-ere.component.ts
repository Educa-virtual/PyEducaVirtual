import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosInformesService } from '../../services/datos-informes.service'
import { MenuItem, MessageService } from 'primeng/api'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ChartOptions } from 'chart.js'
import {
    ADMINISTRADOR_DREMO,
    ESPECIALISTA_UGEL,
    ESPECIALISTA_DREMO,
} from '@/app/servicios/seg/perfiles'

@Component({
    selector: 'app-informes-ere',
    standalone: true,
    templateUrl: './informes-ere.component.html',
    styleUrls: ['./informes-ere.component.scss'],
    imports: [PrimengModule, ChartModule, TablePrimengComponent],
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
    niveles: Array<object>

    niveles_nombres: Array<any>
    niveles_resumen: Array<any>
    hay_resultados: boolean = false

    es_especialista: boolean = false

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
        private datosInformes: DatosInformesService
    ) {}

    ngOnInit() {
        const perfiles_permitidos = [
            ADMINISTRADOR_DREMO,
            ESPECIALISTA_DREMO,
            ESPECIALISTA_UGEL,
        ]
        if (
            perfiles_permitidos.includes(+this.datosInformes.perfil.iPerfilId)
        ) {
            this.es_especialista = true
        }
        try {
            this.formFiltros = this.fb.group({
                iYAcadId: [this.datosInformes.iYAcadId, Validators.required],
                iCredEntPerfId: [
                    this.datosInformes.perfil.iCredEntPerfId,
                    Validators.required,
                ],
                iEvaluacionId: [null, Validators.required],
                iCursoId: [null, Validators.required],
                iNivelTipoId: [null, Validators.required],
                iNivelGradoId: [null, Validators.required],
                iDsttId: [null],
                iIieeId: [null],
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

    btn_exportar: Array<MenuItem> = [
        {
            label: 'PDF',
            icon: 'pi pi-fw pi-file-pdf',
            command: () => {
                this.exportar(1)
            },
        },
        {
            label: 'EXCEL',
            icon: 'pi pi-fw pi-file-excel',
            command: () => {
                this.exportar(2)
            },
        },
    ]

    filterEvaluaciones() {
        this.evaluaciones = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iEvaluacionId &&
                        item.label == current.cEvaluacionNombre
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
    }

    filterCursos(iEvaluacionId: any) {
        this.cursos = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iCursoId &&
                        item.label == current.cCursoNombre
                )
                if (!x && current.iEvaluacionId == iEvaluacionId) {
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
    }

    filterNivelTipos() {
        this.nivel_tipos = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iNivelTipoId &&
                        item.label == current.cNivelTipoNombre
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
    }

    filterGrados(iNivelTipoId: any) {
        this.nivel_grados = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iNivelGradoId &&
                        item.label == current.cGradoNombre
                )
                if (!x && current.iNivelTipoId == iNivelTipoId) {
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
    }

    filterDistritos(iEvaluacionId: any) {
        this.distritos = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iDsttId &&
                        item.label == current.cDsttNombre
                )
                if (!x && current.iEvaluacionId == iEvaluacionId) {
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
    }

    filterIes(iDsttId: any) {
        this.ies = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iIieeId &&
                        item.label == current.cIieeNombre
                )
                if (!x && current.iDsttId == iDsttId) {
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
    }

    filterSecciones(iNivelGradoId: any) {
        this.secciones = this.evaluaciones_cursos_ies.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.value == current.iSeccionId &&
                        item.label == current.cSeccionNombre
                )
                if (!x && current.iNivelGradoId == iNivelGradoId) {
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
                    this.resultados = data.data[1]
                    this.niveles = data.data[2]
                    this.resumen = data.data[3]
                    this.matriz = data.data[4]
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
        if (!this.resultados || this.resultados.length == 0) {
            this.hay_resultados = false
            this.promedio = []
            return
        }

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.hay_resultados = true

        const niveles_nombres = this.niveles.map(
            (item: any) => item.nivel_logro
        )
        const niveles_valores = this.niveles.map((item: any) => item.cantidad)
        const total = niveles_valores.reduce((a, b) => Number(a) + Number(b), 0)

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
                title: {
                    display: true,
                    text: 'Total de Estudiantes: ' + total,
                    font: {
                        size: 12,
                    },
                },
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
                    backgroundColor:
                        documentStyle.getPropertyValue('--blue-500'),
                    hoverBackgroundColor:
                        documentStyle.getPropertyValue('--blue-400'),
                    data: aciertos,
                },
                {
                    label: '% DE DESACIERTOS',
                    backgroundColor:
                        documentStyle.getPropertyValue('--red-500'),
                    hoverBackgrounfColor:
                        documentStyle.getPropertyValue('--red-400'),
                    data: desaciertos,
                },
                {
                    label: '% DE BLANCOS',
                    backgroundColor:
                        documentStyle.getPropertyValue('--yellow-500'),
                    hoverBackgroundColor:
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
                    ticks: {
                        stepSize: 1,
                    },
                },
                y: {
                    max: 100,
                },
            },
        }
    }

    mostrarPromedio(niveles, valores) {
        const total = valores.reduce((acc, cur) => Number(acc) + Number(cur))
        const porcentajes = valores.map((valor) =>
            ((Number(valor) / Number(total)) * 100).toFixed(2)
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

    exportar(tipo: number) {
        if (this.formFiltros.invalid) {
            this._MessageService.add({
                severity: 'warning',
                summary: 'Advertencia',
                detail: 'Debe seleccionar los filtros requeridos',
            })
            return
        }
        if (tipo == 1) {
            this.datosInformes.exportarPdf(this.formFiltros.value).subscribe({
                next: (response) => {
                    const blob = new Blob([response], {
                        type: 'application/pdf',
                    })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.target = '_blank'
                    // link.download = 'INFORME-ERE.pdf'
                    link.click()
                    // window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    console.log(error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
            })
        } else {
            this.datosInformes.exportarExcel(this.formFiltros.value).subscribe({
                next: (response) => {
                    const blob = new Blob([response], {
                        type: 'application/vnd.ms-excel',
                    })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'Resultados-ERE.xlsx'
                    link.target = '_blank'
                    link.click()
                    window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
            })
        }
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
            width: '5%',
            field: 'item',
            header: '#',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'cod_ie',
            header: 'I.E.',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'distrito',
            header: 'DISTRITO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'seccion',
            header: 'SECCIÓN',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '25%',
            field: 'estudiante',
            header: 'ESTUDIANTE',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'aciertos',
            header: 'ACIERTOS',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'desaciertos',
            header: 'DESACIERTOS',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'blancos',
            header: 'BLANCOS',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'nivel_logro',
            header: 'NIVEL',
            text_header: 'center',
            text: 'center',
        },
    ]

    columns_resumen = [
        {
            type: 'text',
            width: '50%',
            field: 'metrica',
            header: 'ITEMS',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'pregunta_1',
            header: '1',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'pregunta_2',
            header: '2',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'pregunta_3',
            header: '3',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'pregunta_4',
            header: '4',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'pregunta_5',
            header: '5',
            text_header: 'center',
            text: 'center',
        },
    ]

    columns_matriz = [
        {
            type: 'text',
            width: '5%',
            field: 'pregunta_nro',
            header: '#',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '15%',
            field: 'competencia',
            header: 'COMPETENCIA',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '15%',
            field: 'capacidad',
            header: 'CAPACIDAD',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '25%',
            field: 'desempeno',
            header: 'DESEMPEÑO',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'aciertos',
            header: 'ACIERTOS',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'desaciertos',
            header: 'DESACIERTOS',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
            field: 'porcentaje_aciertos',
            header: '% DE ACIERTOS',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '10%',
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
