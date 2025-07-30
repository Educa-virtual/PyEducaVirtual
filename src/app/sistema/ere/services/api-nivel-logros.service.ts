import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs'; //catchError, , tap, throwError
import { ICurso } from '../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface';
// import { AdministradorModule } from '../../administrador/administrador.module'
//import { mapData } from '../sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
  providedIn: 'root',
})
export class ApiNivelLogrosService {
  private urlBackendApi = environment.backendApi;
  private urlBackend = environment.backend;
  private http = inject(HttpClient);
  constructor() {}

  obtenerListaNivelLogros(): Observable<any> {
    return this.http.get(`${this.urlBackendApi}/ere/nivel-logros`).pipe(map(resp => resp['data']));
  }

  registrarNivelLogrosArea(curso: ICurso, formulario: any): Observable<any> {
    return this.http.post(
      `${this.urlBackendApi}/ere/evaluaciones/${curso.iEvaluacionIdHashed}/areas/${curso.iCursosNivelGradId}/nivel-logros`,
      { formulario: formulario }
    );
  }

  obtenerNivelLogrosArea(curso: ICurso): Observable<any> {
    return this.http.get(
      `${this.urlBackendApi}/ere/evaluaciones/${curso.iEvaluacionIdHashed}/areas/${curso.iCursosNivelGradId}/nivel-logros`
    );
  }
}
