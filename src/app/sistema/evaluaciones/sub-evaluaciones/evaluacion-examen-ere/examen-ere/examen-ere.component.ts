import { Component, inject, Input, OnInit } from '@angular/core'
import { ContainerPageComponent } from '../../../../../shared/container-page/container-page.component'
import { Router, RouterModule } from '@angular/router'
import { environment } from '@/environments/environment'
import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MenuItem, MessageService } from 'primeng/api'

@Component({
    selector: 'app-examen-ere',
    standalone: true,
    imports: [RouterModule, ContainerPageComponent, PrimengModule],
    templateUrl: './examen-ere.component.html',
    styleUrl: './examen-ere.component.scss',
})
export class ExamenEreComponent implements OnInit {
    @Input() iEvaluacionId: string = ''
    @Input() cEvaluacionNombre: string = ''
    @Input() cursos: any = []

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem
    private router = inject(Router)
    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)

    backend = environment.backend

    ngOnInit(): void {
        this.breadCrumbItems = [{ label: 'Evaluación ERE' }]
        this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' }
    }

    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }
    verficarInicioExamen(curso) {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'verificacionInicioxiEvaluacionIdxiCursoNivelGradIdxiIieeId',
            data: {
                opcion: 'VERIFICAR-INICIO-EVALUACION-CURSO',
                iEvaluacionId: this.iEvaluacionId,
                iIieeId: this._ConstantesService.iIieeId,
                iCursoNivelGradId: curso.iCursoNivelGradId,
            },
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    const item = response.data[response.data.length - 1]
                    if (item.bInicio === '0') {
                        this._MessageService.add({
                            severity: 'info',
                            summary: 'Atención',
                            detail: item.cMensaje,
                        })
                    } else {
                        this.irMostrarEvaluacion(curso)
                    }
                }
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
    irMostrarEvaluacion(curso) {
        /*this.router.navigate([
            `ere/mostrar-evaluacion/${this.iEvaluacionId}/areas/${curso.iCursoNivelGradId}/${this.cEvaluacionNombre}/${curso.cCursoNombre}/${curso.cGradoNombre}`,
        ])*/
        this.router.navigate([
            `ere/evaluaciones/${this.iEvaluacionId}/areas/${curso.iCursoNivelGradId}/detalles`,
        ])
    }
}
