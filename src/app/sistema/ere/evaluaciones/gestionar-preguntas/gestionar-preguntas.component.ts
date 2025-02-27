import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { DataView } from 'primeng/dataview'

import { PrimengModule } from '@/app/primeng.module'
import { GestionarPreguntasCardComponent } from '../../components/areas/gestionar-preguntas-card/gestionar-preguntas-card.component'

import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { environment } from '@/environments/environment.template'
import { ActivatedRoute } from '@angular/router'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { MessagesModule } from 'primeng/messages'
import { Message } from 'primeng/api'
import { ApiEspecialistasService } from '@/app/sistema/ere/services/api-especialistas.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

export type Layout = 'list' | 'grid'

@Component({
    selector: 'app-gestionar-preguntas',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        PrimengModule,
        MessagesModule,
        GestionarPreguntasCardComponent,
    ],
    templateUrl: './gestionar-preguntas.component.html',
    styleUrl: './gestionar-preguntas.component.scss',
})
export class GestionarPreguntasComponent implements OnInit {
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private especialistasService = inject(ApiEspecialistasService)
    private store = new LocalStoreService()
    private _ConstantesService = inject(ConstantesService)

    iEvaluacionIdHashed: string = ''
    sortField: string = ''
    sortOrder: number = 0
    evaluacion: any = null
    cursos: ICurso[] = []
    cursosInicial: ICurso[] = []
    layout: Layout = 'grid'
    backend = environment.backend
    options = ['grid']
    mostrarMensajeVacio: boolean = false
    mensajeInfo: Message[] | undefined

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
        this.mensajeInfo = [
            {
                severity: 'info',
                detail: 'No hay áreas seleccionables para el usuario actual',
            },
        ]
        this.route.params.subscribe((params) => {
            this.iEvaluacionIdHashed = params['iEvaluacionId']
        })
        this.obtenerEvaluacion()
        this.obtenerAreasPorEvaluacionyEspecialista()
    }

    obtenerEvaluacion() {
        this.evaluacionesService
            .obtenerEvaluacionPorId(this.iEvaluacionIdHashed)
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
        this.especialistasService
            .obtenerAreasPorEvaluacionyEspecialista(
                this.iEvaluacionIdHashed,
                this.store.getItem('dremoUser').iPersId,
                this._ConstantesService.iPerfilId
            )
            .subscribe({
                next: (respuesta) => {
                    this.cursosInicial = respuesta.map((curso: ICurso) => ({
                        ...curso,
                    }))
                    this.cursos = this.cursosInicial
                    this.mostrarMensajeVacio = false
                },
                error: (error) => {
                    this.mostrarMensajeVacio = true
                    console.error('Error obteniendo datos', error)
                },
            })
    }
}
