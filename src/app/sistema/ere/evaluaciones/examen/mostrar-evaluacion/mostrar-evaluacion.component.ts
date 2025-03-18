import {
    Component,
    inject,
    Input,
    OnInit,
    AfterViewChecked,
    ChangeDetectorRef,
} from '@angular/core'
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
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { TimeComponent } from '@/app/shared/time/time.component'

@Component({
    selector: 'app-mostrar-evaluacion',
    standalone: true,
    templateUrl: './mostrar-evaluacion.component.html',
    styleUrls: ['./mostrar-evaluacion.component.scss'],
    imports: [
        PrimengModule,
        ContainerPageComponent,
        IconComponent,
        TimeComponent,
    ],
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
export class MostrarEvaluacionComponent implements OnInit, AfterViewChecked {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private router = inject(Router)
    private _ChangeDetectorRef = inject(ChangeDetectorRef)

    constructor(private store: LocalStoreService) {}

    @Input() iEvaluacionId: string = ''
    @Input() iCursoNivelGradId: string = ''
    @Input() cEvaluacionNombre: string = ''
    @Input() cCursoNombre: string = ''
    @Input() cGradoNombre: string = ''

    iniciarEvaluacion: boolean = false
    evaluacion
    tiempoActual = new Date()
    bEstadoTiempo: boolean

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
                valorBusqueda: this.iCursoNivelGradId,
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
                this.store.setItem('evaluacion', this.evaluacion)
                break
            case 'CONSULTAR-ESTADOxiEvaluacionId':
                if (this.bEstadoTiempo) {
                    return
                }
                item.length
                    ? item[0]['iEstado']
                        ? this.router.navigate([
                              `ere/rendir-examen/${this.iEvaluacionId}/areas/${this.iCursoNivelGradId}/${this.cEvaluacionNombre}/${this.cCursoNombre}/${this.cGradoNombre}`,
                          ])
                        : null
                    : null
                break
            case 'tiempo-finalizado':
                this.bEstadoTiempo = false
                break
            case 'tiempo-espera':
                this.bEstadoTiempo = true
                break
        }
    }

    ngAfterViewChecked() {
        this._ChangeDetectorRef.detectChanges()
    }
}
