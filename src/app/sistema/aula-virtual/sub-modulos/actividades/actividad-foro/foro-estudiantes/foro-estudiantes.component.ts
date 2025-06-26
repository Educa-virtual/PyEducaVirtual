import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Component, inject, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-foro-estudiantes',
    standalone: true,
    templateUrl: './foro-estudiantes.component.html',
    styleUrls: ['./foro-estudiantes.component.scss'],
    imports: [PrimengModule],
})
export class ForoEstudiantesComponent implements OnInit {
    @Input() id: number
    @Input() iIeCursoId
    @Input() iSeccionId
    @Input() iNivelGradoId

    private _aulaService = inject(ApiAulaService)
    private _constantesService = inject(ConstantesService)

    estudiantes: any
    modelaCalificacionComen: boolean = false
    descripcionContrctva: string
    estudianteSelect: string
    estudianteSelectData: any
    resptDocente: any
    comentarioDocente: string

    constructor() {}

    ngOnInit() {
        this.getEstudiantesMatricula()
    }
    cerrarmodal() {
        this.modelaCalificacionComen = false
    }
    // consulta para obtener los estudiantes
    getEstudiantesMatricula() {
        this._aulaService
            .obtenerReporteFinalDeNotas({
                iIeCursoId: this.iIeCursoId,
                iYAcadId: this._constantesService.iYAcadId,
                iSedeId: this._constantesService.iSedeId,
                iSeccionId: this.iSeccionId,
                iNivelGradoId: this.iNivelGradoId,
            })
            .subscribe((Data) => {
                this.estudiantes = Data['data']
                this.estudiantes = Data['data'].map((item: any) => {
                    return {
                        ...item,
                        cTitulo: item.completoalumno,
                    }
                })
                // console.log('matriculados', this.estudiantes)
            })
    }
    // funcion para mostrar el modal para agregar un conclución descriptiva
    openModalCalificacion(data: any) {
        this.estudianteSelect = data.completoalumno
        this.estudianteSelectData = data
        console.log(this.estudianteSelectData)
        this.modelaCalificacionComen = true
        this.obtenerResptDocente()
    }
    // función para guardar calificación
    calificarComntEstudiante() {
        console.log(this.estudianteSelectData)
        const data = {
            iEstudianteId: this.estudianteSelectData.iEstudianteId,
            iForoId: this.id,
            cForoRptDocente: this.descripcionContrctva,
        }
        console.log(data)
        this._aulaService.calificarForoDocente(data).subscribe((resp: any) => {
            if (resp?.validated) {
                this.modelaCalificacionComen = false
                // this.getRespuestaF()
                console.log(resp)
            }
        })
    }

    // obtener retroalimentacion de docente a estudiante x su comentario
    obtenerResptDocente() {
        const data = {
            iEstudianteId: this.estudianteSelectData.iEstudianteId,
            iForoId: this.id,
        }

        this._aulaService.obtenerResptDocente(data).subscribe((Data) => {
            // cForoRptaDocente
            this.resptDocente = Data['data']
            // console.log(this.resptDocente)
            this.comentarioDocente = this.resptDocente?.[0]?.cForoRptaDocente

            this.descripcionContrctva = this.comentarioDocente
            // console.log('respuesta docente', this.comentarioDocente)
        })
    }
    // calificacion: any
    // mostrarCalificacion() {
    //     const userId = 1
    //     this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
    //         this.calificacion = Data['data']
    //         console.log('Mostrar escala',this.calificacion)
    //     })
    // }
}
