import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { ExamenEreComponent } from '../../sub-evaluaciones/evaluacion-examen-ere/examen-ere/examen-ere.component'

@Component({
    selector: 'app-areas-rendir-examen',
    standalone: true,
    imports: [NoDataComponent, ExamenEreComponent],
    templateUrl: './areas-rendir-examen.component.html',
    styleUrl: './areas-rendir-examen.component.scss',
})
export class AreasRendirExamenComponent implements OnInit {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private router = inject(Router)
    private _ConstantesService = inject(ConstantesService)

    iEvaluacionId: string = ''
    cEvaluacionNombre: string = ''
    cursos: [] = []
    ngOnInit() {
        this.obtenerEvaluacionActiva()
    }

    obtenerEvaluacionActiva() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTAR-ESTADO-ULTIMO-ACTIVO',
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    obtenerEstudianteAreasEvaluacion() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'obtenerEstudianteAreasEvaluacion',
            data: {
                opcion: 'OBTENER-ESTUDIANTE-AREAS-EVALUACION',
                iEstudianteId: this._ConstantesService.iEstudianteId,
                iEvaluacionId: this.iEvaluacionId,
                iYAcadId: this._ConstantesService.iYAcadId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }
    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                //console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
    bMensaje: boolean = true // 0:No hay evaluación - 1: Si hay evaluación
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'CONSULTAR-ESTADO-ULTIMO-ACTIVO':
                if (!item.length) {
                    this.bMensaje = false
                    return
                }
                this.cEvaluacionNombre = item[0]['cEvaluacionNombre']
                this.iEvaluacionId = item[0]['iEvaluacionId']
                this.obtenerEstudianteAreasEvaluacion()
                break
            case 'OBTENER-ESTUDIANTE-AREAS-EVALUACION':
                if (!item.length) {
                    this.bMensaje = false
                    return
                }
                this.cursos = item
                break
        }
    }
}
