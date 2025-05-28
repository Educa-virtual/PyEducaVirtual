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
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
import { SheetToMatrix } from '@/app/sistema/gestion-institucional/sincronizar-archivo/bulk-data-import/utils/sheetToMatrix'
@Component({
    selector: 'app-informes-ere',
    standalone: true,
    templateUrl: './informes-ere.component.html',
    styleUrls: ['./informes-ere.component.scss'],
    imports: [
        PrimengModule,
        ChartModule,
        TablePrimengComponent,
        NoDataComponent,
    ],
})
export class InformesEreComponent implements OnInit {
    formFiltros: FormGroup
    data_doughnut: any
    options_doughnut: any
    data_bar: any
    options_bar: ChartOptions
    hide_filters: boolean = false

    resultados: Array<object>
    resumen: Array<object>
    matriz: Array<object>
    promedio: Array<object>
    niveles: Array<object>
    agrupado: Array<object>

    niveles_nombres: Array<any>
    niveles_resumen: Array<any>
    hay_resultados: boolean = false

    es_especialista: boolean = false

    evaluaciones_cursos_ies: Array<object>
    evaluaciones: Array<object>
    areas: Array<object>
    nivel_tipos: Array<object>
    nivel_grados: Array<object>
    distritos: Array<object>
    ies: Array<object>
    secciones: Array<object>
    sexos: Array<object>
    zonas: Array<object>
    tipo_sectores: Array<object>
    ugeles: Array<object>
    tipos_reportes: Array<object>

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
                iZonaId: [null],
                iTipoSectorId: [null],
                iUgelId: [null],
                iDsttId: [null],
                iIieeId: [null],
                iSeccionId: [null],
                cPersSexo: [null],
                cTipoReporte: ['ESTUDIANTES', Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.sexos = this.datosInformes.getSexos()
        this.tipos_reportes = this.datosInformes.getTiposReportes()
        this.datosInformes
            .obtenerParametros(this.formFiltros.value)
            .subscribe((data: any) => {
                this.evaluaciones = this.datosInformes.getEvaluaciones(
                    data?.evaluaciones
                )
                this.distritos = this.datosInformes.getDistritos(
                    data?.distritos
                )
                this.secciones = this.datosInformes.getSecciones(
                    data?.secciones
                )
                this.zonas = this.datosInformes.getZonas(data?.zonas)
                this.tipo_sectores = this.datosInformes.getTipoSectores(
                    data?.tipo_sectores
                )
                this.ugeles = this.datosInformes.getUgeles(data?.ugeles)
                this.nivel_tipos = this.datosInformes.getNivelesTipos(
                    data?.nivel_tipos
                )
                this.ies = this.datosInformes.getInstitucionesEducativas(
                    data?.instituciones_educativas
                )
                this.datosInformes.getNivelesGrados(data?.nivel_grados)
                this.datosInformes.getAreas(data?.areas)
            })

        this.formFiltros.get('iNivelTipoId').valueChanges.subscribe((value) => {
            this.formFiltros.get('iNivelGradoId')?.setValue(null)
            this.nivel_grados = null
            this.filterNivelesGrados(value)

            this.formFiltros.get('iCursoId')?.setValue(null)
            this.areas = null
            this.filterAreas(value)

            this.formFiltros.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formFiltros.get('iDsttId').valueChanges.subscribe(() => {
            this.formFiltros.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formFiltros.get('iZonaId').valueChanges.subscribe(() => {
            this.formFiltros.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formFiltros.get('iTipoSectorId').valueChanges.subscribe(() => {
            this.formFiltros.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formFiltros.get('iUgelId').valueChanges.subscribe(() => {
            this.formFiltros.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
    }

    filterNivelesTipos() {
        this.nivel_tipos = this.datosInformes.filterNivelesTipos()
    }

    filterNivelesGrados(iNivelTipoId: number) {
        this.nivel_grados = this.datosInformes.filterNivelesGrados(iNivelTipoId)
    }

    filterAreas(iNivelTipoId: number) {
        this.areas = this.datosInformes.filterAreas(iNivelTipoId)
    }

    filterInstitucionesEducativas() {
        const iEvaluacionId = this.formFiltros.get('iEvaluacionId')?.value
        const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value
        const iDsttId = this.formFiltros.get('iDsttId')?.value
        const iZonaId = this.formFiltros.get('iZonaId')?.value
        const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value
        const iUgelId = this.formFiltros.get('iUgelId')?.value
        this.ies = this.datosInformes.filterInstitucionesEducativas(
            iEvaluacionId,
            iNivelTipoId,
            iDsttId,
            iZonaId,
            iTipoSectorId,
            iUgelId
        )
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

    fullData
    searchResultados() {
        if (this.formFiltros.invalid) {
            this._MessageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar los filtros obligatorios',
            })
            return
        }
        this.datosInformes
            .obtenerInformeResumen(this.formFiltros.value)
            .subscribe({
                next: (data: any) => {
                    if (data.data.length == 0) {
                        this.sinDatos()
                    } else {
                        this.hide_filters = true
                        this.fullData = data.data
                        this.resultados = data.data[1]
                        this.niveles = data.data[2]
                        this.resumen = data.data[3]
                        this.matriz = data.data[4]
                        this.mostrarEstadisticaNivel()
                        this.generarColumnas(this.resumen)
                        if (this.es_especialista) {
                            this.agrupado = data.data[5]
                            this.agrupado = this.agrupado.map((item: any) => {
                                let sumatoria = 0
                                this.niveles.forEach((nivel: any) => {
                                    sumatoria += Number(
                                        item[nivel.nivel_logro_id] ?? 0
                                    )
                                })
                                this.niveles.forEach((nivel: any) => {
                                    item[nivel.nivel_logro_id] = Number(
                                        (Number(
                                            item[nivel.nivel_logro_id] ?? 0
                                        ) /
                                            sumatoria) *
                                            100
                                    ).toFixed(2)
                                })
                                item.total = sumatoria
                                return item
                            })
                            this.generarColumnasAgrupado()
                        }
                        this.mostrarEstadisticaPregunta()
                    }
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

    sinDatos() {
        this.hay_resultados = false
        this.promedio = []
        this.resultados = []
        this.niveles = []
        this.resumen = []
        this.matriz = []
        this.agrupado = []
        this.mostrarEstadisticaNivel()
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

    generarColumnasAgrupado() {
        if (this.niveles.length == 0) {
            return
        }
        const columnas = [
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
                width: '20%',
                field: 'agrupado',
                header: 'IE',
                text_header: 'left',
                text: 'left',
            },
            {
                type: 'text',
                width: '10%',
                field: 'ugel',
                header: 'UGEL',
                text_header: 'left',
                text: 'left',
            },
            {
                type: 'text',
                width: '10%',
                field: 'distrito',
                header: 'Distrito',
                text_header: 'left',
                text: 'left',
            },
            {
                type: 'text',
                width: '10%',
                field: 'total',
                header: 'Total',
                text_header: 'left',
                text: 'left',
            },
            {
                type: 'text',
                width: '10%',
                field: 'puntaje',
                header: 'Puntaje',
                text_header: 'left',
                text: 'left',
            },
        ]
        this.niveles.forEach((item: any) => {
            columnas.push({
                type: 'text',
                width: '1rem',
                field: `${item.nivel_logro_id}`,
                header: `% ${item.nivel_logro}`,
                text_header: 'center',
                text: 'center',
            })
        })
        this.columns_group = columnas
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
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar los filtros obligatorios',
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
            this.exportarExcelLocal()
            // this.exportarExcelAPI()
        }
    }

    exportarExcelLocal() {
        // Formatear parametros
        const parametros = []
        const params = this.fullData[0][0]
        for (const index in params) {
            let index_formateado = index
            if (['autor', 'year_oficial'].includes(index)) continue
            switch (index) {
                case 'cod_ie':
                    index_formateado = 'institucion educativa'
                    break
                case 'curso':
                    index_formateado = 'area'
                    break
                case 'tipo_reporte':
                    index_formateado = 'tipo de reporte'
                    break
            }
            parametros.push({
                titulo: index_formateado.toUpperCase(),
                valor: params[index],
            })
        }

        // formatear columnas de preguntas
        const preguntas = this.fullData[3]
        const preguntas_count = Object.keys(preguntas[0]).length - 1
        const columnas_preguntas = [{ key: 'metrica', header: 'PREGUNTA' }]
        for (let i = 1; i <= preguntas_count; i++) {
            columnas_preguntas.push({
                key: `${i}`,
                header: `${i}`,
            })
        }

        // formatear columnas de agrupado
        const columnas_agrupado = [
            { key: 'index', header: 'ITEM' },
            { key: 'agrupado', header: 'AGRUPADO' },
            { key: 'ugel', header: 'UGEL' },
            { key: 'distrito', header: 'DISTRITO' },
            { key: 'total', header: 'TOTAL' },
        ]
        this.niveles.forEach((item: any) => {
            columnas_agrupado.push({
                key: `${item.nivel_logro_id}`,
                header: `% ${item.nivel_logro}`,
            })
        })

        // Formatear hojas y columnas
        const worksheets = [
            {
                sheetName: 'Parametros',
                data: parametros,
                columns: [
                    { key: 'titulo', header: 'Parámetro' },
                    { key: 'valor', header: 'Valor' },
                ],
            },
            {
                sheetName: 'Resumen',
                data: this.fullData[2],
                columns: [
                    { key: 'nivel_logro', header: 'Nivel de logro' },
                    { key: 'cantidad', header: 'Cantidad' },
                ],
            },
            {
                sheetName: 'Detalle',
                data: this.fullData[1],
                columns: [
                    { key: 'index', header: 'ITEM' },
                    { key: 'cod_ie', header: 'I.E.' },
                    { key: 'distrito', header: 'Distrito' },
                    { key: 'seccion', header: 'Sección' },
                    { key: 'estudiante', header: 'Estudiante' },
                    { key: 'aciertos', header: 'Aciertos' },
                    { key: 'desaciertos', header: 'Desaciertos' },
                    { key: 'blancos', header: 'Blancos' },
                    { key: 'docente', header: 'DOCENTE' },
                    { key: 'nivel_logro', header: 'NIVEL DE LOGRO' },
                ],
            },
            {
                sheetName: 'Preguntas',
                data: this.fullData[3],
                columns: columnas_preguntas,
            },
            {
                sheetName: 'Matriz',
                data: this.fullData[4],
                columns: [
                    { key: 'competencia', header: 'COMPETENCIA' },
                    { key: 'capacidad', header: 'CAPACIDAD' },
                    { key: 'desempeno', header: 'DESEMPEÑO' },
                    { key: 'pregunta_nro', header: 'PREGUNTAS' },
                    { key: 'aciertos', header: 'ACIERTOS' },
                    { key: 'desaciertos', header: 'DESACIERTOS' },
                    { key: 'porcentaje_aciertos', header: '% ACIERTOS' },
                    {
                        key: 'porcentaje_desaciertos',
                        header: '% DESACIERTOS',
                    },
                ],
            },
            {
                sheetName: 'Agrupado',
                data: this.fullData[5],
                columns: columnas_agrupado,
            },
        ]

        SheetToMatrix.exportToExcel(worksheets)
    }

    exportarExcelAPI() {
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

    accionBtnItemTable({ accion, item }) {
        console.log(accion, item)
    }
    selectedItems = []

    actions: IActionTable[] = []

    actionsLista: IActionTable[]

    columns = []

    columns_estudiantes = [
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
            header: 'Nivel de logro',
            text_header: 'center',
            text: 'center',
        },
    ]

    columns_group = [
        {
            type: 'text',
            width: '5%',
            field: 'item',
            header: '#',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '20%',
            field: 'agrupado',
            header: 'IE',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'ugel',
            header: 'UGEL',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'distrito',
            header: 'Distrito',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'total',
            header: 'Total',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'puntaje',
            header: 'Puntaje',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'nivel_logro',
            header: 'Nivel',
            text_header: 'left',
            text: 'left',
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
