import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'
import { ConstantesService } from '../constantes.service'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class BancoPreguntasService {
    private _ConstantesService = inject(ConstantesService)
    constructor(private http: HttpClient) {}

    obtenerBancoPreguntasxiCursoIdxiDocenteId(
        iEvaluacionId: string | number,
        iCursoId: string | number,
        params = {
            iCredId: this._ConstantesService.iCredId,
        }
    ): Observable<any> {
        return this.http.get(
            `${baseUrl}/evaluaciones/banco-preguntas/${iEvaluacionId}/curso/${iCursoId}/docente/${this._ConstantesService.iDocenteId}`,
            {
                params,
            }
        )
    }

    importarBancoPreguntas(data): Observable<any> {
        return this.http.post(
            `${baseUrl}/evaluaciones/banco-preguntas/importar`,
            data
        )
    }
}
