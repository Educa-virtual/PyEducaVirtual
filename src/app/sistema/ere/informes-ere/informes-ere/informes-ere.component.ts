import { Component, inject, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosInformesService } from '../../services/datos-informes.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MessageService } from 'primeng/api'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { DatosMatriculaService } from '@/app/sistema/gestion-institucional/services/datos-matricula.service'

@Component({
    selector: 'app-informes-ere',
    standalone: true,
    templateUrl: './informes-ere.component.html',
    styleUrls: ['./informes-ere.component.scss'],
    imports: [ContainerPageComponent, PrimengModule, ChartModule],
})
export class InformesEreComponent implements OnInit {
    formFiltros: FormGroup
    data: any
    options: any
    resultados: Array<object>

    evaluaciones: Array<object>
    cursos: Array<object>
    grados_secciones_turnos: Array<object>
    nivel_tipos: Array<object>
    nivel_grados: Array<object>
    secciones: Array<object>

    private _MessageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private datosInformes: DatosInformesService,
        private constantesService: ConstantesService,
        private evaluacionesRService: ApiEvaluacionesRService,
        private datosMatriculaService: DatosMatriculaService
    ) {}

    ngOnInit() {
        try {
            this.formFiltros = this.fb.group({
                iYAcadId: this.constantesService.iYAcadId,
                iCredSesionId: this.constantesService.iCredId,
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

        this.evaluacionesRService.obtenerEvaluacion({}).subscribe({
            next: (data: any) => {
                this.evaluaciones = data.data.map((item) => ({
                    value: item.iEvaluacionId,
                    label: item.cEvaluacionNombre,
                }))
            },
        })

        this.searchGradoSeccionTurno()
        this.searchResultados()

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

    searchGradoSeccionTurno() {
        this.datosMatriculaService
            .searchGradoSeccionTurno({
                opcion: 'TODO',
                iSedeId: this.constantesService.iSedeId,
                iYAcadId: this.constantesService.iYAcadId,
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data.data)
                    this.grados_secciones_turnos = data.data
                    this.filterNivelTipos()
                },
                error: (error) => {
                    console.error('Error consultando nivel grados:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    filterNivelTipos() {
        this.nivel_tipos = this.grados_secciones_turnos.reduce(
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
        this.nivel_grados = this.grados_secciones_turnos.reduce(
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
        this.secciones = this.grados_secciones_turnos.reduce(
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
        this.datosInformes.obtenerInformeResumen(this.formFiltros).subscribe({
            next: (data: any) => {
                this.resultados = data.data
                this.mostrarEstadisticaNIvel()
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

    mostrarEstadisticaNIvel() {
        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.data = {
            labels: ['Satisfactorio', 'Inicio', 'Proceso'],
            datasets: [
                {
                    data: [70, 10, 20],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                    ],
                },
            ],
        }

        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
        }
    }
}
