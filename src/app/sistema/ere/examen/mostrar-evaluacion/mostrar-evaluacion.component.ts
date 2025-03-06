import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { provideIcons } from '@ng-icons/core'
import {
    matHideSource,
    matCalendarMonth,
    matMessage,
    matStar,
    matRule,
    matListAlt,
    matAccessTime,
} from '@ng-icons/material-icons/baseline'
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
    selector: 'app-mostrar-evaluacion',
    standalone: true,
    templateUrl: './mostrar-evaluacion.component.html',
    styleUrls: ['./mostrar-evaluacion.component.scss'],
    imports: [PrimengModule, ContainerPageComponent, IconComponent],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class MostrarEvaluacionComponent implements OnInit {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private router = inject(Router)

    iEvaluacionId: string = '854'
    iCursosNivelGradId: string =
        'ZMDNgoXjdk9Qz0ZyWKra3B1PQ3nRG54pY2lwq78vEAeVbmLJx1' //'BL5XB8NQmabwA3zDlgW710Jn0bPxMYeRVory4jKZvpGEkq2d90' //ZMDNgoXjdk9Qz0ZyWKra3B1PQ3nRG54pY2lwq78vEAeVbmLJx1
    iniciarEvaluacion: boolean = false
    evaluacion

    ngOnInit() {
        this.obtenerEvaluacionxiEvaluacionId()
    }
    obtenerEvaluacionxiEvaluacionId() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTARxiEvaluacionId',
                iEvaluacionId: this.iEvaluacionId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    rendirExamen() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTAR-ESTADOxiEvaluacionId',
                iEvaluacionId: this.iEvaluacionId,
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

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'CONSULTARxiEvaluacionId':
                this.evaluacion = item.length ? item[0] : null
                break
            case 'CONSULTAR-ESTADOxiEvaluacionId':
                item.length
                    ? item[0]['iEstado']
                        ? this.router.navigate([
                              `ere/rendir-examen/${this.iEvaluacionId}/areas/${this.iCursosNivelGradId}/${this.evaluacion?.cEvaluacionNombre}/${this.evaluacion?.cCursoNombre}`,
                          ])
                        : null
                    : null
                break
        }
    }
}
