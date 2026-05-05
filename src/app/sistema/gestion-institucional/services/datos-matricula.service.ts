import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DatosMatriculaService {
  private onDestroy$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public readonly ESTADO_DEFINITIVA = 1;
  public readonly ESTADO_TRASLADO = 2;
  public readonly ESTADO_ABANDONO = 3;
  public readonly ESTADO_PROCESO = 4;

  public readonly TIPO_REGULAR = 1;
  public readonly TIPO_REZAGADO = 2;
  public readonly TIPO_EXTEMPORANEA = 3;

  parametros: any;

  grado_seccion_turno: Array<object>;
  tipos_documentos: Array<object>;
  tipos_familiares: Array<object>;
  sexos: Array<object>;
  nacionalidades: Array<object>;
  nivel_grados: Array<object>;
  secciones: Array<object>;
  turnos: Array<object>;
  tipos_matriculas: Array<object>;
  estados_matriculas: Array<object>;

  crearMatricula(data: any) {
    if (!this.parametros) {
      this.parametros = this.http.post(`${baseUrl}/acad/matricula/crearMatricula`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        })
      );
      return this.parametros;
    }
    return of(this.parametros);
  }

  getGradoSeccionTurno(data: any) {
    if (!this.grado_seccion_turno && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.grado_seccion_turno = items.map(item => ({
        iNivelGradoId: Number(item.iNivelGradoId),
        cGradoAbreviacion: item.cGradoAbreviacion,
        cGradoNombre: item.cGradoNombre,
        iSeccionId: Number(item.iSeccionId),
        cSeccionNombre: item.cSeccionNombre,
        iTurnoId: Number(item.iTurnoId),
        cTurnoNombre: item.cTurnoNombre,
      }));
      return this.grado_seccion_turno;
    }
    return this.grado_seccion_turno;
  }

  getNivelGrados(data: any) {
    if (!this.nivel_grados && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.nivel_grados = items.reduce((prev: any, current: any) => {
        const x = prev.find(item => item.value === current.iNivelGradoId);
        if (!x) {
          return prev.concat([
            {
              value: Number(current.iNivelGradoId),
              label: current.cGradoNombre,
            },
          ]);
        } else {
          return prev;
        }
      }, []);
      return this.nivel_grados;
    }
    return this.nivel_grados;
  }

  filterSecciones(data: any, iNivelGradoId: any) {
    if (data) {
      const secciones = data.filter(item => item.iNivelGradoId === iNivelGradoId);
      this.secciones = secciones.map(item => ({
        label: item.cSeccionNombre,
        value: item.iSeccionId,
        iNivelGradoId: item.iNivelGradoId,
      }));
      return this.secciones;
    }
    return this.secciones;
  }

  filterTurnos(data: any, iNivelGradoId: any, iSeccionId: any) {
    if (data) {
      const turnos = data.filter(
        item => item.iNivelGradoId === iNivelGradoId && item.iSeccionId === iSeccionId
      );
      this.turnos = turnos.map(item => ({
        label: item.cTurnoNombre,
        value: item.iTurnoId,
        iNivelGradoId: item.iNivelGradoId,
        iSeccionId: item.iSeccionId,
      }));
      return this.turnos;
    }
    return this.turnos;
  }

  getTiposMatriculas(data: any) {
    if (!this.tipos_matriculas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_matriculas = items.map(tipo => ({
        value: Number(tipo.iTipoMatrId),
        label: tipo.cTipoMatrNombre,
      }));
      return this.tipos_matriculas;
    }
    return this.tipos_matriculas;
  }

  getEstadosMatriculas(data: any) {
    if (!this.estados_matriculas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.estados_matriculas = items.map(estado => ({
        value: Number(estado.iTipoEstadoMatricula),
        label: estado.cTipoEstadoMatricula,
      }));
      return this.estados_matriculas;
    }
    return this.estados_matriculas;
  }

  getTiposDocumentos(data: any) {
    if (!this.tipos_documentos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_documentos = items.map(tipo => ({
        value: Number(tipo.iTipoIdentId),
        label: tipo.cTipoIdentSigla + ' ' + tipo.cTipoIdentNombre,
      }));
      return this.tipos_documentos;
    }
    return this.tipos_documentos;
  }

  getNacionalidades(data: any) {
    if (!this.nacionalidades && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.nacionalidades = items.map(nacionalidad => ({
        value: Number(nacionalidad.iNacionId),
        label: nacionalidad.cNacionNombre,
      }));
      return this.nacionalidades;
    }
    return this.nacionalidades;
  }

  getTiposFamiliares(data: any) {
    if (!this.tipos_familiares && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_familiares = items.map(tipo => ({
        value: Number(tipo.iTipoFamiliarId),
        label: tipo.cTipoFamiliarDescripcion,
      }));
      return this.tipos_familiares;
    }
    return this.tipos_familiares;
  }

  getSexos() {
    if (!this.sexos) {
      this.sexos = [
        { label: 'MASCULINO', value: 'M' },
        { label: 'FEMENINO', value: 'F' },
      ];
    }
    return this.sexos;
  }

  /**
   * FUNCION LEGACY
   */
  searchGradoSeccionTurno(data: any) {
    return this.http.post(`${baseUrl}/acad/matricula/searchGradoSeccionTurnoConf`, data);
  }

  /**
   * FUNCIONES PARA GESTIONAR MATRICULAS
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

  validarPersona(data: any) {
    return this.http.post(`${baseUrl}/grl/validarPersona`, data);
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
        value = +value;
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
