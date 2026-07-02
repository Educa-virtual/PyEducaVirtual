import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, Observable, of, shareReplay, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class CurriculasService {
  private onDestroy$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  parametros: any;
  parametros$?: Observable<any>;

  modalidades: Array<object>;
  tipos_cursos: Array<object>;

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

  /**
   * FUNCIONES PARA GESTIONAR CURRICULAS
   */

  verMatricula(data: any) {
    return this.http.post(`${baseUrl}/acad/matricula/verMatricula`, data);
  }

  listarMatriculas(data: any) {
    return this.http.post(`${baseUrl}/acad/matricula/listarMatriculas`, data);
  }

  guardarMatricula(data: any) {
    return this.http.post(`${baseUrl}/acad/matricula/guardarMatricula`, data);
  }

  actualizarMatricula(data: any) {
    return this.http.post(`${baseUrl}/acad/matricula/actualizarMatricula`, data);
  }

  borrarMatricula(data: any) {
    return this.http.post(`${baseUrl}/acad/matricula/borrarMatricula`, data);
  }

  verEstudiante(data: any) {
    return this.http.post(`${baseUrl}/acad/estudiante/verEstudiante`, data);
  }

  buscarPersonaApoderado(data: any) {
    return this.http.post(`${baseUrl}/apo/buscarPersonaApoderado`, data);
  }

  listarApoderados(data: any) {
    return this.http.post(`${baseUrl}/apo/listarApoderados`, data);
  }

  verApoderado(data: any) {
    return this.http.post(`${baseUrl}/apo/verApoderado`, data);
  }

  guardarApoderado(data: any) {
    return this.http.post(`${baseUrl}/apo/guardarApoderado`, data);
  }

  actualizarApoderado(data: any) {
    return this.http.post(`${baseUrl}/apo/actualizarApoderado`, data);
  }
  actualizarApoderadoEstado(data: any) {
    return this.http.post(`${baseUrl}/apo/actualizarApoderadoEstado`, data);
  }

  borrarApoderado(data: any) {
    return this.http.post(`${baseUrl}/apo/borrarApoderado`, data);
  }

  listarDeserciones(data: any) {
    return this.http.post(`${baseUrl}/acad/desercion/listarDeserciones`, data);
  }

  verDesercion(data: any) {
    return this.http.post(`${baseUrl}/acad/desercion/verDesercion`, data);
  }

  guardarDesercion(data: any) {
    return this.http.post(`${baseUrl}/acad/desercion/guardarDesercion`, data);
  }

  actualizarDesercion(data: any) {
    return this.http.post(`${baseUrl}/acad/desercion/actualizarDesercion`, data);
  }

  borrarDesercion(data: any) {
    return this.http.post(`${baseUrl}/acad/desercion/borrarDesercion`, data);
  }

  /**
   * IMPORTAR DATOS EN JSON PARA MATRICULA MASIVA
   */
  subirArchivoMatriculas(data: any) {
    return this.http.post(`${baseUrl}/acad/estudiante/importarEstudiantesMatriculasExcel`, data, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
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
