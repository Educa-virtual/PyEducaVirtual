import { Component, OnInit } from '@angular/core'
import { ContainerPageComponent } from '../../../../../shared/container-page/container-page.component'
import { DataViewModule } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { AreasEstudiosComponent } from '../../../../docente/areas-estudios/areas-estudios.component'
import { CursoCardComponent } from '../../../../aula-virtual/sub-modulos/cursos/components/curso-card/curso-card.component'
import { ButtonModule } from 'primeng/button'
import { ApiService } from '@/app/servicios/api.service'
import { ActivatedRoute } from '@angular/router'
import { RouterModule } from '@angular/router'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-examen-ere',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ContainerPageComponent,
        DataViewModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        AreasEstudiosComponent,
        CursoCardComponent,
        ButtonModule,
    ],
    templateUrl: './examen-ere.component.html',
    styleUrl: './examen-ere.component.scss',
})
export class ExamenEreComponent implements OnInit {
    cursos = []
    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(async (params) => {
            const response = await this.apiService.getData({
                esquema: 'ere',
                tabla: 'V_EvaluacionFechasCursos',
                campos: '*',
                where: 'iEvaluacionId=' + params['cIEvaluacion'],
            })

            // Mapear la respuesta de la API para que coincida con ICurso
            if (response && response[0] && response[0].cursos_niveles) {
                this.cursos = response[0].cursos_niveles.map((curso: any) => ({
                    iExamCurId: curso.iExamCurId,
                    iCursoNivelGradId: curso.iCursoNivelGradId,
                    dtExamenFechaInicio: curso.dtExamenFechaInicio,
                    dtExamenFechaFin: curso.dtExamenFechaFin,
                    cCursoNombre: curso.cCursoNombre,
                    cCursoImagen:
                        curso.cCursoImagen || 'cursos/images/no-image.jpg',
                    iGradoId: curso.iGradoId,
                    cGradoAbreviacion: curso.cGradoAbreviacion,
                    cGradoNombre: curso.cGradoNombre,
                    iNivelTipoId: curso.iNivelTipoId,
                    cNivelTipoNombre: curso.cNivelTipoNombre,
                }))
            } else {
                this.cursos
            }

            console.log('Cursos:', this.cursos)
        })
    }
    backend = environment.backend
    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }
}
