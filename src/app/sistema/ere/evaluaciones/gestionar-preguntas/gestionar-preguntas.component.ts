import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { CardModule } from 'primeng/card'
import { DataView, DataViewModule } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { SplitButtonModule } from 'primeng/splitbutton'
import { ConstantesService } from '@/app/servicios/constantes.service'

import { PrimengModule } from '@/app/primeng.module'
import { GestionarPreguntasCardComponent } from '../../components/areas/gestionar-preguntas-card/gestionar-preguntas-card.component'

import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { environment } from '@/environments/environment.template'
import { ActivatedRoute } from '@angular/router'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'

export type Layout = 'list' | 'grid'

@Component({
    selector: 'app-gestionar-preguntas',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        CardModule,
        DataViewModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        ButtonModule,
        PrimengModule,
        SplitButtonModule,
        GestionarPreguntasCardComponent,
    ],
    templateUrl: './gestionar-preguntas.component.html',
    styleUrl: './gestionar-preguntas.component.scss',
})
export class GestionarPreguntasComponent implements OnInit {
    private constantesService = inject(ConstantesService)
    private evaluacionesService = inject(ApiEvaluacionesRService)

    iEvaluacionIdHashed: string = ''
    sortField: string = ''
    sortOrder: number = 0
    evaluacion: any = null
    cursos: ICurso[] = []
    cursosInicial: ICurso[] = []
    layout: Layout = 'grid'
    backend = environment.backend
    options = ['grid']

    //datos: any[] = []
    //iPersId: number = 10
    //iEvaluacionId: number = 799
    constructor(private route: ActivatedRoute) {}

    public onFilter(dv: DataView, event: Event) {
        const text = (event.target as HTMLInputElement).value.toLowerCase()
        this.cursos = this.cursosInicial
        if (text.length > 1) {
            this.cursos = this.cursos.filter((curso) =>
                curso.cCursoNombre.toLowerCase().includes(text)
            )
        }
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.iEvaluacionIdHashed = params['iEvaluacionId']
        })
        this.obtenerEvaluacion()
        this.obtenerAreasPorEvaluacionyEspecialista()
    }

    obtenerEvaluacion() {
        this.evaluacionesService
            .obtenerEvaluacionNuevo(this.iEvaluacionIdHashed)
            .subscribe({
                next: (resp: unknown) => {
                    this.evaluacion = resp
                },
                error: (error) => {
                    console.error('Error obteniendo datos', error)
                },
            })
    }

    obtenerAreasPorEvaluacionyEspecialista() {
        this.evaluacionesService
            .obtenerAreasPorEvaluacionyEspecialista(
                this.constantesService.iPersId,
                this.iEvaluacionIdHashed
            )
            .subscribe({
                next: (respuesta) => {
                    this.cursosInicial = respuesta.map((curso: ICurso) => ({
                        iCursoId: curso.idDocCursoId,
                        ...curso,
                    }))
                    this.cursos = this.cursosInicial
                },
                error: (error) => {
                    console.error('Error obteniendo datos', error)
                },
            })
    }
}
