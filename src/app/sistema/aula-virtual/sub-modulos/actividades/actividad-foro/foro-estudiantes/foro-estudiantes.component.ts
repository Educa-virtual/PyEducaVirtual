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
    @Input() iIeCursoId
    @Input() iSeccionId
    @Input() iNivelGradoId

    private _aulaService = inject(ApiAulaService)
    private _constantesService = inject(ConstantesService)

    estudiantes: any
    modelaCalificacionComen: boolean = false

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
                console.log('matriculados', this.estudiantes)
            })
    }
    estudianteSelect: string
    openModalCalificacion(data: any) {
        this.estudianteSelect = data.completoalumno
        this.modelaCalificacionComen = true
    }
}
