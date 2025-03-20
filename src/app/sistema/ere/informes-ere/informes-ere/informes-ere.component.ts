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
    data: any
    options: any
    resultados: Array<object>
    niveles_nombres: Array<any>
    niveles_resumen: Array<any>
    visible_chart: boolean = false

    evaluaciones_cursos_ies: Array<object>
    evaluaciones: Array<object>
    cursos: Array<object>
    nivel_tipos: Array<object>
    nivel_grados: Array<object>
    secciones: Array<object>

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
                iIieeId: this.constantesService.iIieeId,
                iEvaluacionId: [null, Validators.required],
                iCursoId: [null, Validators.required],
                iNivelTipoId: [null, Validators.required],
                iNivelGradoId: [null, Validators.required],
                iSeccionId: [null],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

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
                this.formFiltros.get('iCursoId')?.setValue(null)
                if (value) {
                    this.filterCursos(value)
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
                    this.resultados = data.data
                    this.mostrarEstadisticaNivel()
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
            this.visible_chart = false
            return
        }

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.visible_chart = true

        this.niveles_nombres = this.resultados.reduce(
            (prev: any, current: any) => {
                const x = prev.find((item) => item === current.nivel_alcanzado)
                if (!x) {
                    return prev.concat([current.nivel_alcanzado])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.niveles_nombres, 'niveles')

        this.niveles_resumen = this.resultados.reduce(
            (acumulador: any, item: any) => {
                const nivel = item.nivel_alcanzado
                if (acumulador[nivel]) {
                    acumulador[nivel]++
                } else {
                    acumulador[nivel] = 1
                }
                return acumulador
            },
            {}
        )
        console.log(this.niveles_resumen, 'nivel resumen')

        this.data = {
            labels: Object.keys(this.niveles_resumen),
            datasets: [
                {
                    data: Object.values(this.niveles_resumen),
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

        this.options = {
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
            text: 'center',
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
            field: 'nivel_alcanzado',
            header: 'Nivel',
            text_header: 'center',
            text: 'center',
        },
    ]
}
