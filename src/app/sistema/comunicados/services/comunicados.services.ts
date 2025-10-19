import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {
  ADMINISTRADOR_DREMO,
  APODERADO,
  DIRECTOR_IE,
  DOCENTE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  ESTUDIANTE,
} from '@/app/servicios/seg/perfiles';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ComunicadosService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public readonly ESTADO_BORRADOR = 1;
  public readonly ESTADO_APROBADA = 2;

  public readonly TIPO_REPORTE_LISTA = 1;
  public readonly TIPO_REPORTE_INDIVIDUAL = 2;

  public readonly GRAFICO_BARRA = 1;
  public readonly GRAFICO_CIRCULAR = 2;
  public readonly GRAFICO_NUBE = 3;

  public readonly USUARIO_ENCUESTADO = 1;
  public readonly USUARIO_ENCUESTADOR = 2;

  public readonly TIPO_PREG_TEXTO = 1;
  public readonly TIPO_PREG_SIMPLE = 3;
  public readonly TIPO_PREG_MULTIPLE = 4;

  public readonly CATEGORIA_SATISFACCION = 1;
  public readonly CATEGORIA_AUTOEVALUACION = 2;

  parametros: any;

  tipos_comunicados: Array<object>;
  prioridades: Array<object>;
  distritos: Array<object>;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  areas: Array<object>;
  secciones: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  instituciones_educativas: Array<object>;
  sexos: Array<object>;
  estados: Array<object>;
  recipientes: Array<object>;

  /**
   * CONEXIONES A LA API
   */

  listarComunicados(data: any) {
    return this.http.post(`${baseUrl}/enc/listarComunicados`, data);
  }

  verComunicado(data: any) {
    return this.http.post(`${baseUrl}/enc/verComunicado`, data);
  }

  guardarComunicado(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarComunicado`, data);
  }

  actualizarComunicado(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarComunicado`, data);
  }

  actualizarComunicadoEstado(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarComunicadoEstado`, data);
  }

  borrarComunicado(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarComunicado`, data);
  }

  obtenerGrupoCantidad(data: any) {
    return this.http.post(`${baseUrl}/enc/obtenerGrupoCantidad`, data);
  }

  /**
   * FORMATEAR PARAMETROS EN FORMULARIO
   */

  crearComunicado(data: any) {
    if (!this.parametros) {
      this.parametros = this.http.post(`${baseUrl}/com/crearComunicado`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        })
      );
      return this.parametros;
    }
    return of(this.parametros);
  }

  getTiposComunicados(data: any) {
    if (!this.tipos_comunicados && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_comunicados = items.map(tipo => ({
        value: tipo.iTipoComId,
        label: tipo.cTipoComNombre,
      }));
      return this.tipos_comunicados;
    }
    return this.tipos_comunicados;
  }

  getPrioridades(data: any) {
    if (!this.prioridades && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.prioridades = items.map(prioridad => ({
        value: prioridad.iPrioridadId,
        label: prioridad.cPrioridadNombre,
      }));
      return this.prioridades;
    }
    return this.prioridades;
  }

  getRecipientes(data: any, iPerfilId: number | null = null) {
    if (!this.recipientes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.recipientes = items.map(recipiente => ({
        value: recipiente.iPerfilId,
        label: recipiente.cPerfilNombre,
        disabled: iPerfilId
          ? !this.getRecipientesJurisdiccion(recipiente.iPerfilId, iPerfilId)
          : false,
      }));
      return this.recipientes;
    }
    return this.recipientes;
  }

  getRecipientesJurisdiccion(iPerfilIdRecipiente: number, iPerfilIdUsuario: number) {
    if (iPerfilIdUsuario === DIRECTOR_IE) {
      return [DOCENTE, ESTUDIANTE, APODERADO].includes(iPerfilIdRecipiente);
    } else if (iPerfilIdUsuario === ESPECIALISTA_UGEL) {
      return [DIRECTOR_IE, DOCENTE, ESTUDIANTE, APODERADO].includes(iPerfilIdRecipiente);
    } else if (iPerfilIdUsuario === ESPECIALISTA_DREMO) {
      return [ESPECIALISTA_UGEL, DIRECTOR_IE, DOCENTE, ESTUDIANTE, APODERADO].includes(
        iPerfilIdRecipiente
      );
    } else if (iPerfilIdUsuario === ADMINISTRADOR_DREMO) {
      return [
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        DIRECTOR_IE,
        DOCENTE,
        ESTUDIANTE,
        APODERADO,
      ].includes(iPerfilIdRecipiente);
    }
    return false;
  }

  getAreas(data: any) {
    if (!this.areas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.areas = items.map(area => ({
        value: area.iCursoId,
        label: area.cCursoNombre,
      }));
      return this.areas;
    }
    return this.areas;
  }

  getDistritos(data: any) {
    if (!this.distritos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.distritos = items.map(distrito => ({
        value: distrito.iDsttId,
        label: distrito.cDsttNombre,
        ugeles: distrito.ugeles,
      }));
      return this.distritos;
    }
    return this.distritos;
  }

  filterDistritos(iUgelId: any) {
    if (!iUgelId || !this.distritos) return this.distritos;
    return this.distritos.filter((distrito: any) => {
      const pertenece_ugel = distrito.ugeles.find((ugel: any) => ugel.iUgelId === iUgelId);
      if (pertenece_ugel) {
        return distrito;
      }
      return null;
    });
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

  filterNivelesTipos() {
    return this.nivel_tipos;
  }

  getNivelesGrados(data: any) {
    if (!this.nivel_grados && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.nivel_grados = items.map(nivel => ({
        value: nivel.iNivelGradoId,
        label: nivel.cGradoNombre,
        iNivelTipoId: nivel.iNivelTipoId,
      }));
      return this.nivel_grados;
    }
    return this.nivel_grados;
  }

  filterNivelesGrados(iNivelTipoId: any) {
    if (!iNivelTipoId || !this.nivel_grados) return null;
    return this.nivel_grados.filter((nivel_grado: any) => {
      if (nivel_grado.iNivelTipoId === iNivelTipoId) {
        return nivel_grado;
      }
      return null;
    });
  }

  getSeccionesEncuesta(data: any) {
    if (data) {
      this.secciones = data.map(seccion => ({
        value: Number(seccion.iSeccionId),
        label: seccion.iSeccionOrden + '. ' + seccion.cSeccionTitulo,
      }));
      return this.secciones;
    }
    return this.secciones;
  }

  getSeccionesPlantilla(data: any) {
    if (data) {
      this.secciones = data.map(seccion => ({
        value: Number(seccion.iPlanSeccionId),
        label: seccion.iPlanSeccionOrden + '. ' + seccion.cPlanSeccionTitulo,
      }));
      return this.secciones;
    }
    return this.secciones;
  }

  getSecciones(data: any) {
    if (!this.secciones && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.secciones = items.map(seccion => ({
        value: seccion.iSeccionId,
        label: seccion.cSeccionNombre,
      }));
      return this.secciones;
    }
    return this.secciones;
  }

  getZonas(data: any) {
    if (!this.zonas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.zonas = items.map(zona => ({
        value: zona.iZonaId,
        label: zona.cZonaNombre,
      }));
      return this.zonas;
    }
    return this.zonas;
  }

  getTipoSectores(data: any) {
    if (!this.tipo_sectores && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipo_sectores = items.map(tipo_sector => ({
        value: tipo_sector.iTipoSectorId,
        label: tipo_sector.cTipoSectorNombre,
      }));
      return this.tipo_sectores;
    }
    return this.tipo_sectores;
  }

  getUgeles(data: any) {
    if (!this.ugeles && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.ugeles = items.map(ugel => ({
        value: ugel.iUgelId,
        label: ugel.cUgelNombre,
      }));
      return this.ugeles;
    }
    return this.ugeles;
  }

  getInstitucionesEducativas(data: any) {
    if (!this.instituciones_educativas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.instituciones_educativas = items.map(ie => ({
        value: ie.iIieeId,
        label: ie.cIieeNombre,
        iDsttId: ie?.iDsttId,
        iNivelTipoId: ie?.iNivelTipoId,
        iZonaId: ie?.iZonaId,
        iTipoSectorId: ie?.iTipoSectorId,
        iUgelId: ie?.iUgelId,
        evaluaciones: ie?.evaluaciones,
      }));
      return this.instituciones_educativas;
    }
    return this.instituciones_educativas;
  }

  filterInstitucionesEducativas(
    iNivelTipoId: any,
    iDsttId: any,
    iZonaId: any,
    iTipoSectorId: any,
    iUgelId: any
  ) {
    let ies_tmp: Array<object> = this.instituciones_educativas;
    if (!iNivelTipoId || !this.instituciones_educativas) {
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
    if (iDsttId) {
      ies_tmp = ies_tmp.filter((ie: any) => {
        if (ie.iDsttId == iDsttId) {
          return ie;
        }
        return null;
      });
    }
    if (iZonaId) {
      ies_tmp = ies_tmp.filter((ie: any) => {
        if (ie.iZonaId == iZonaId) {
          return ie;
        }
        return null;
      });
    }
    if (iTipoSectorId) {
      ies_tmp = ies_tmp.filter((ie: any) => {
        if (ie.iTipoSectorId == iTipoSectorId) {
          return ie;
        }
        return null;
      });
    }
    if (iUgelId) {
      ies_tmp = ies_tmp.filter((ie: any) => {
        if (ie.iUgelId == iUgelId) {
          return ie;
        }
        return null;
      });
    }
    return ies_tmp;
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

  getEstados() {
    if (!this.estados) {
      this.estados = [
        { label: 'BORRADOR', value: this.ESTADO_BORRADOR },
        { label: 'APROBADA', value: this.ESTADO_APROBADA },
      ];
    }
    return this.estados;
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
      let fecha = new Date(value + 'T00:00:00');
      if (!value) fecha = null;
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

  formControlJsonStringify(
    form: FormGroup,
    formJson: string,
    formControlName: string | string[] | null,
    groupControl: string | null = null
  ): void {
    form.get(formJson).setValue(null);
    if (!formControlName) {
      return null;
    }
    const items = [];
    if (typeof formControlName === 'string') {
      formControlName = [formControlName];
    }
    formControlName.forEach(control => {
      if (form.get(control).value === null) {
        return null;
      }
      form.get(control).value.forEach(item => {
        if (groupControl) {
          items.push({
            [groupControl]: item,
          });
        } else if (groupControl == '') {
          items.push(item);
        } else {
          items.push({
            [control]: item,
          });
        }
      });
    });
    form.get(formJson).setValue(JSON.stringify(items));
  }

  formMarkAsDirty(form: FormGroup) {
    if (form) {
      form.markAllAsTouched();
      Object.keys(form.controls).forEach(key => {
        form.get(key)?.markAsDirty();
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
