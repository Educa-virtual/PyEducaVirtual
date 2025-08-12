import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DatosSeguimientoBienestarService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  parametros: any;
  tipos_documentos: Array<object>;
  nivel_tipos: Array<object>;
  sedes: Array<object>;

  tipos_seguimiento: Array<object>;
  public readonly SEGUIMIENTO_ESTUDIANTE = 1;
  public readonly SEGUIMIENTO_DOCENTE = 2;
  public readonly SEGUIMIENTO_DIRECTIVO = 3;

  prioridades: Array<object>;
  public readonly PRIORIDAD_NORMAL = 1;
  public readonly PRIORIDAD_ALERTA = 2;
  public readonly PRIORIDAD_URGENTE = 3;

  fases: Array<object>;
  public readonly FASE_ATENDIDO = 1;
  public readonly FASE_PENDIENTE = 2;
  public readonly FASE_DERIVADO = 3;

  constructor(private http: HttpClient) {}

  listarSeguimientos(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verSeguimientos`, data);
  }

  verSeguimiento(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verSeguimiento`, data);
  }

  verSeguimientosPersona(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verSeguimientosPersona`, data);
  }

  guardarSeguimiento(data: any) {
    return this.http.post(`${baseUrl}/bienestar/guardarSeguimiento`, data);
  }

  actualizarSeguimiento(data: any) {
    return this.http.post(`${baseUrl}/bienestar/actualizarSeguimiento`, data);
  }

  borrarSeguimiento(data: any) {
    return this.http.post(`${baseUrl}/bienestar/borrarSeguimiento`, data);
  }

  verDatosPersona(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verDatosPersona`, data);
  }

  getTiposSeguimiento() {
    if (!this.tipos_seguimiento) {
      this.tipos_seguimiento = [
        {
          label: 'ESTUDIANTES',
          value: this.SEGUIMIENTO_ESTUDIANTE,
        },
        {
          label: 'DOCENTES',
          value: this.SEGUIMIENTO_DOCENTE,
        },
        {
          label: 'ADMINISTRATIVOS',
          value: this.SEGUIMIENTO_DIRECTIVO,
        },
      ];
    }
    return this.tipos_seguimiento;
  }

  getPrioridades() {
    if (!this.prioridades) {
      this.prioridades = [
        {
          label: 'NORMAL',
          value: this.PRIORIDAD_NORMAL,
        },
        {
          label: 'ALERTA',
          value: this.PRIORIDAD_ALERTA,
        },
        {
          label: 'URGENTE',
          value: this.PRIORIDAD_URGENTE,
        },
      ];
    }
    return this.prioridades;
  }

  getFases() {
    if (!this.fases) {
      this.fases = [
        {
          label: 'ATENDIDO',
          value: this.FASE_ATENDIDO,
        },
        {
          label: 'PENDIENTE',
          value: this.FASE_PENDIENTE,
        },
        {
          label: 'DERIVADO',
          value: this.FASE_DERIVADO,
        },
      ];
    }
    return this.fases;
  }

  getSeguimientoParametros(data: any) {
    if (!this.parametros) {
      this.parametros = this.http.post(`${baseUrl}/bienestar/crearSeguimiento`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        })
      );
      return this.parametros;
    }
    return of(this.parametros);
  }

  getTiposDocumentos(data: any) {
    if (!this.tipos_documentos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_documentos = items.map(doc => ({
        vvalue: doc.iTipoIdentId,
        label: doc.cTipoIdentSigla + ' - ' + doc.cTipoIdentNombre,
        longitud: doc.iTipoIdentLongitud,
      }));
      return this.tipos_documentos;
    }
    return this.tipos_documentos;
  }

  getNivelesTipos(data: any) {
    if (!this.nivel_tipos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.nivel_tipos = items.map(nivel => ({
        value: nivel.iNivelTipoId,
        label: nivel.cNivelTipoNombre,
      }));
      return this.nivel_tipos;
    }
    return this.nivel_tipos;
  }

  getInstitucionesEducativas(data: any) {
    if (!this.sedes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.sedes = items.map(ie => ({
        value: ie.iSedeId,
        label: ie.cIieeNombre,
        iNivelTipoId: ie?.iNivelTipoId,
      }));
      return this.sedes;
    }
    return this.sedes;
  }

  filterInstitucionesEducativas2(iNivelTipoId: any) {
    let ies_tmp: Array<object> = this.sedes;
    if (!iNivelTipoId || !this.sedes) {
      return null;
    }
    if (iNivelTipoId) {
      ies_tmp = ies_tmp.filter((ie: any) => {
        if (ie.iNivelTipoId == iNivelTipoId) {
          return ie;
        }
        return null;
      });
    }
    return ies_tmp;
  }

  filterInstitucionesEducativas(iNivel: any): Observable<any[]> {
    return of(this.sedes).pipe(map(sedes => sedes.filter((sede: any) => sede.iNivel === iNivel)));
  }

  /**
   *
   * FUNCIONES PARA FORMATEAR DATOS EN FORMULARIOS
   *
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
      if (!value) value = null;
      const fecha = new Date(value);
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
