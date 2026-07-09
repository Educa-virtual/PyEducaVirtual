import { ApiService } from '@/app/servicios/api.service';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable, shareReplay, of } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class CurriculasService {
  endPoint: string = `${baseUrl}/administrador`;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  curricula: any;
  parametros: any;
  parametros$?: Observable<any>;

  modalidades: Array<object>;
  tipos_cursos: Array<object>;

  setCurricula(curricula: any[]) {
    this.curricula = JSON.stringify(curricula);
    localStorage.setItem('curricula', this.curricula);
  }

  getCurricula(): string | null {
    if (!this.curricula) {
      this.curricula =
        localStorage.getItem('curricula') == 'null' ? null : localStorage.getItem('curricula');
    }
    return JSON.parse(this.curricula);
  }

  crearCurricula(data: any): Observable<any> {
    if (this.parametros) {
      return of(this.parametros);
    }

    if (!this.parametros$) {
      this.parametros$ = this.http.post(`${baseUrl}/acad/crearCurricula`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        }),
        shareReplay(1)
      );
    }

    return this.parametros$;
  }

  getModalidades(data: any) {
    if (!this.modalidades && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.modalidades = items.map(modalidad => ({
        value: Number(modalidad.iModalServId),
        label: modalidad.cModalServNombre,
      }));
      return this.modalidades;
    }
    return this.modalidades;
  }

  getTiposCursos(data: any) {
    if (!this.tipos_cursos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_cursos = items.map(tipo => ({
        value: Number(tipo.iTipoCursoId),
        label: tipo.cTipoCursoNombre,
      }));
      return this.tipos_cursos;
    }
    return this.tipos_cursos;
  }

  getCurriculas() {
    return this.apiService.getDataObs({
      esquema: 'acad',
      tabla: 'curriculas',
      campos: '*',
      where: '1=1',
    });
  }

  insCurriculas(data) {
    return this.http.post(this.endPoint + '/addCurriculas', {
      json: JSON.stringify(data),
      opcion: 'addCurriculas',
    });
  }

  updCurriculas(data) {
    return this.http.post(this.endPoint + '/updCurriculas', {
      json: JSON.stringify(data),
      opcion: 'updCurriculas',
    });
  }

  /**
   * FUNCIONES GENERALES
   */

  /**
   *
   * @param form El nombre del formulario
   * @param formControl El nombre del control del formulario
   * @param value El valor del control
   * @param tipo El tipo del control
   * @param groupControl El control por el que se agrupan los datos en el json, por defecto es null
   */
  formatearFormControl(
    form: FormGroup,
    formControl: string,
    value: any,
    tipo: 'number' | 'string' | 'json' | 'boolean' | 'date',
    groupControl: string | null = null
  ) {
    if (tipo === 'number') {
      if (!value || isNaN(Number(value))) {
        value = null;
      } else {
        value = Number(value);
      }
      form.get(formControl).patchValue(value);
    } else if (tipo === 'boolean') {
      if (!value || isNaN(Number(value))) value = 0;
      form.get(formControl)?.patchValue(value == 1 ? true : false);
    } else if (tipo === 'string') {
      if (!value) value = null;
      form.get(formControl)?.patchValue(value);
    } else if (tipo === 'date') {
      let fecha = null;
      if (value) {
        value = value.substring(0, 10);
        fecha = new Date(value + 'T00:00:00');
      }
      form.get(formControl)?.patchValue(fecha);
    } else if (tipo === 'json') {
      if (!value) {
        form.get(formControl)?.patchValue(null);
      } else {
        const json = JSON.parse(value);
        const items = [];
        for (let i = 0; i < json.length; i++) {
          if (groupControl) {
            items.push(json[i][groupControl]);
          } else {
            items.push(json[i][formControl]);
          }
        }
        form.get(formControl)?.patchValue(items);
      }
    } else {
      if (!value) value = null;
      form.get(formControl)?.patchValue(value);
    }
  }
}
