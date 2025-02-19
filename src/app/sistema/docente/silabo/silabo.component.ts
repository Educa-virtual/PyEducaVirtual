import { PrimengModule } from '@/app/primeng.module'
import { BtnLoadingComponent } from '@/app/shared/btn-loading/btn-loading.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { RecursosDidacticosComponent } from '../areas-estudios/components/recursos-didacticos/recursos-didacticos.component'
import { ActividadesAprendizajeEvaluacionComponent } from '../areas-estudios/components/actividades-aprendizaje-evaluacion/actividades-aprendizaje-evaluacion.component'
import { EvaluacionComponent } from '../areas-estudios/components/evaluacion/evaluacion.component'
import { BibliografiaComponent } from '../areas-estudios/components/bibliografia/bibliografia.component'
import { Router } from '@angular/router'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { FormBuilder, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { MetodologiaComponent } from './components/metodologia/metodologia.component'
import { Subject, takeUntil } from 'rxjs'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-silabo',
    standalone: true,
    imports: [
        ContainerPageComponent,
        PrimengModule,
        BtnLoadingComponent,
        TablePrimengComponent,
        RecursosDidacticosComponent,
        ActividadesAprendizajeEvaluacionComponent,
        EvaluacionComponent,
        BibliografiaComponent,
        MetodologiaComponent,
    ],
    templateUrl: './silabo.component.html',
    styleUrl: './silabo.component.scss',
})
export class SilaboComponent implements OnInit, OnDestroy {
    @Input() idDocCursoId: string

    activeStepper: number = 0
    nivelTipo: string
    private unsubscribe$ = new Subject<boolean>()

    constructor(
        private router: Router,
        private GeneralService: GeneralService,
        private ConstantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.nivelTipo = this.ConstantesService.nivelTipo
    }

    silabo = [
        { iSilabo: 1, cSilaboTitle: 'Información General', icon: 'pi-info' },
        {
            iSilabo: 2,
            cSilaboTitle: 'Unidad Didáctica, Capacidad y Metodología',
            icon: 'pi-list-check',
        },
        { iSilabo: 3, cSilaboTitle: 'Recursos Didácticos', icon: 'pi-gift' },
        {
            iSilabo: 4,
            cSilaboTitle:
                'Desarrollo de Actividades de Aprendizaje y de Evaluación',
            icon: 'pi-clipboard',
        },
        { iSilabo: 5, cSilaboTitle: 'Evaluación', icon: 'pi-check-square' },
        { iSilabo: 6, cSilaboTitle: 'Bibliografía', icon: 'pi-address-book' },
    ]

    ngOnInit() {
        this.getSilabo(this.activeStepper, true, [])
        this.getTipoMetodologias()
    }
    dataInformation = []
    dataSilabo = this.fb.group({
        opcion: ['', Validators.required],
        iSilaboId: [''],
        iSemAcadId: [''],
        iYAcadId: [''],
        idDocCursoId: [''],
        dtSilabo: [''],
        cSilaboDescripcionCurso: ['', Validators.required],
        cSilaboCapacidad: ['', Validators.required],

        iCredId: [this.ConstantesService.iCredId, Validators.required],
    })

    tipoMetodologias

    async getSilabo(index, api: boolean, data) {
        let params = {}
        switch (index) {
            case 0:
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'docente-cursos',
                    ruta: 'list',
                    data: {
                        opcion: 'CONSULTARxidDocCursoIdxiYAcadIdxiDocenteIdxiIeCursoId',
                        iCredId: this.ConstantesService.iCredId,
                        idDocCursoId: this.idDocCursoId,
                        iSemAcadId: null,
                        iYAcadId: this.ConstantesService.iYAcadId,
                        iDocenteId: this.ConstantesService.iDocenteId,
                        iIeCursoId: null,
                    },
                    params: { skipSuccessMessage: true },
                }
                if (api) {
                    this.getInformation(index, params)
                } else {
                    this.dataInformation = data
                    this.dataSilabo.controls.iSilaboId.setValue(
                        this.dataInformation[0]?.iSilaboId
                    )
                }
                break
            case 1:
                this.dataSilabo.controls.opcion.setValue(
                    'CONSULTARxidDocCursoIdxiSemAcadIdxiYAcadId'
                )
                this.dataSilabo.controls.idDocCursoId.setValue(
                    this.idDocCursoId
                )
                this.dataSilabo.controls.iSemAcadId.setValue(null)
                this.dataSilabo.controls.iYAcadId.setValue(
                    this.ConstantesService.iYAcadId
                )
                this.dataSilabo.controls.dtSilabo.setValue(null)
                if (!this.dataSilabo.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Formulario no validado',
                    })
                }
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabos',
                    ruta: 'list',
                    data: this.dataSilabo.value,
                    params: { skipSuccessMessage: true },
                }
                api
                    ? this.getInformation(index, params)
                    : this.dataSilabo.patchValue(data[0])
                break
            case 2:
                break
            case 3:
                break
            case 4:
                break
            case 5:
                break
            case 6:
                break
            case 'tipo_metodologias':
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'tipo-metodologias',
                    ruta: 'list',
                    data: {
                        opcion: 'CONSULTAR',
                    },
                    params: { skipSuccessMessage: true },
                }
                api
                    ? this.getInformation(index, params)
                    : (this.tipoMetodologias = data)
                break
            default:
                break
        }
    }

    getInformation(index, params) {
        this.GeneralService.getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Data) => {
                    this.getSilabo(index, false, response.data)
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    getTipoMetodologias() {
        this.getSilabo('tipo_metodologias', true, [])
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
