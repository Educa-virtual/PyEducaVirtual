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
export class EncuestasService implements OnDestroy {
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

  permisos: Array<object>;
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
  perfiles: Array<object>;
  alternativas: Array<object>;
  tipos_reportes: Array<object>;
  tipos_graficos: Array<object>;
  tiempos_duracion: Array<object>;
  participantes: Array<object>;
  tipos_preguntas: Array<object>;
  fuentes: Array<object>;
  tipos_reportes_plantillas: Array<object>;

  /**
   * CONEXIONES A LA API
   */

  listarCategorias(data: any) {
    return this.http.post(`${baseUrl}/enc/listarCategorias`, data);
  }

  verCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/verCategoria`, data);
  }

  guardarCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarCategoria`, data);
  }

  actualizarCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarCategoria`, data);
  }

  borrarCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarCategoria`, data);
  }

  listarEncuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/listarEncuestas`, data);
  }

  verEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/verEncuesta`, data);
  }

  guardarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarEncuesta`, data);
  }

  actualizarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarEncuesta`, data);
  }

  actualizarEncuestaEstado(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarEncuestaEstado`, data);
  }

  borrarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarEncuesta`, data);
  }

  obtenerPoblacionObjetivo(data: any) {
    return this.http.post(`${baseUrl}/enc/obtenerPoblacionObjetivo`, data);
  }

  listarSecciones(data: any) {
    return this.http.post(`${baseUrl}/enc/listarSecciones`, data);
  }

  verSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/verSeccion`, data);
  }

  guardarSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarSeccion`, data);
  }

  actualizarSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarSeccion`, data);
  }

  borrarSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarSeccion`, data);
  }

  listarPreguntas(data: any) {
    return this.http.post(`${baseUrl}/enc/listarPreguntas`, data);
  }

  verPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/verPregunta`, data);
  }

  guardarPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarPregunta`, data);
  }

  actualizarPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarPregunta`, data);
  }

  borrarPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarPregunta`, data);
  }

  listarRespuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/listarRespuestas`, data);
  }

  verRespuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/verRespuestas`, data);
  }

  guardarRespuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarRespuestas`, data);
  }

  actualizarRespuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarRespuestas`, data);
  }

  imprimirRespuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/imprimirRespuestas`, data, {
      responseType: 'blob',
    });
  }

  verResumen(data: any) {
    return this.http.post(`${baseUrl}/enc/verResumen`, data);
  }

  listarEncuestasSatisfaccion(data: any) {
    return this.http.post(`${baseUrl}/enc/listarEncuestasSatisfaccion`, data);
  }

  crearEncuestaSatisfaccion(data: any) {
    return this.http.post(`${baseUrl}/enc/crearEncuestaSatisfaccion`, data);
  }

  listarEncuestasAutoevaluacion(data: any) {
    return this.http.post(`${baseUrl}/enc/listarEncuestasAutoevaluacion`, data);
  }

  crearEncuestaAutoevaluacion(data: any) {
    return this.http.post(`${baseUrl}/enc/crearEncuestaAutoevaluacion`, data);
  }

  crearEncuestaFija(data: any) {
    return this.http.post(`${baseUrl}/enc/crearEncuestaFija`, data);
  }

  listarPlantillas(data: any) {
    return this.http.post(`${baseUrl}/enc/listarPlantillas`, data);
  }

  verPlantilla(data: any) {
    return this.http.post(`${baseUrl}/enc/verPlantilla`, data);
  }

  guardarPlantilla(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarPlantilla`, data);
  }

  actualizarPlantilla(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarPlantilla`, data);
  }

  borrarPlantilla(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarPlantilla`, data);
  }

  actualizarPlantillaEstado(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarPlantillaEstado`, data);
  }

  listarPlantillaSecciones(data: any) {
    return this.http.post(`${baseUrl}/enc/listarPlantillaSecciones`, data);
  }

  verPlantillaSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/verPlantillaSeccion`, data);
  }

  guardarPlantillaSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarPlantillaSeccion`, data);
  }

  actualizarPlantillaSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarPlantillaSeccion`, data);
  }

  borrarPlantillaSeccion(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarPlantillaSeccion`, data);
  }

  verPlantillaPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/verPlantillaPregunta`, data);
  }

  guardarPlantillaPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarPlantillaPregunta`, data);
  }

  actualizarPlantillaPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarPlantillaPregunta`, data);
  }

  borrarPlantillaPregunta(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarPlantillaPregunta`, data);
  }

  guardarEncuestaDesdePlantilla(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarEncuestaDesdePlantilla`, data);
  }

  guardarEncuestaDesdeDuplicado(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarEncuestaDesdeDuplicado`, data);
  }

  guardarPlantillaDesdeEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarPlantillaDesdeEncuesta`, data);
  }

  guardarPlantillaDesdeDuplicado(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarPlantillaDesdeDuplicado`, data);
  }

  archivarPlantilla(data: any) {
    return this.http.post(`${baseUrl}/enc/archivarPlantilla`, data);
  }

  /**
   * FORMATEAR PARAMETROS EN FORMULARIO
   */

  crearEncuesta(data: any) {
    if (!this.parametros) {
      this.parametros = this.http.post(`${baseUrl}/enc/crearEncuesta`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        })
      );
      return this.parametros;
    }
    return of(this.parametros);
  }

  getTiposPreguntas(data: any) {
    if (!this.tipos_preguntas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_preguntas = items.map(tipo => ({
        value: tipo.iTipoPregId,
        label: tipo.cTipoPregNombre,
        icono: tipo.cTipoPregIcono,
      }));
      return this.tipos_preguntas;
    }
    return this.tipos_preguntas;
  }

  getTiemposDuracion(data: any) {
    if (!this.tiempos_duracion && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tiempos_duracion = items.map(tiempo => ({
        value: tiempo.iTiemDurId,
        label: tiempo.cTiemDurNombre,
      }));
      return this.tiempos_duracion;
    }
    return this.tiempos_duracion;
  }

  getPermisos(data: any) {
    if (!this.permisos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.permisos = items.map(permiso => ({
        value: permiso.iPermId,
        label: permiso.cPermNombre,
      }));
      return this.permisos;
    }
    return this.permisos;
  }

  getParticipantes(data: any, iPerfilId: number | null = null) {
    if (!this.participantes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.participantes = items.map(participante => ({
        value: participante.iPerfilId,
        label: participante.cPerfilNombre,
        disabled: iPerfilId
          ? !this.getParticipantesJurisdiccion(participante.iPerfilId, iPerfilId)
          : false,
      }));
      return this.participantes;
    }
    return this.participantes;
  }

  getParticipantesJurisdiccion(iPerfilIdParticipante: number, iPerfilIdUsuario: number) {
    if (iPerfilIdUsuario === DIRECTOR_IE) {
      return [DOCENTE, ESTUDIANTE, APODERADO].includes(iPerfilIdParticipante);
    } else if (iPerfilIdUsuario === ESPECIALISTA_UGEL) {
      return [DIRECTOR_IE, DOCENTE, ESTUDIANTE, APODERADO].includes(iPerfilIdParticipante);
    } else if (iPerfilIdUsuario === ESPECIALISTA_DREMO) {
      return [ESPECIALISTA_UGEL, DIRECTOR_IE, DOCENTE, ESTUDIANTE, APODERADO].includes(
        iPerfilIdParticipante
      );
    } else if (iPerfilIdUsuario === ADMINISTRADOR_DREMO) {
      return [
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        DIRECTOR_IE,
        DOCENTE,
        ESTUDIANTE,
        APODERADO,
      ].includes(iPerfilIdParticipante);
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

  getPerfiles(data: any) {
    if (!this.perfiles && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.perfiles = items.map(perfil => ({
        value: perfil.iPerfilId,
        label: perfil.cPerfilNombre,
      }));
      return this.perfiles;
    }
    return this.perfiles;
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

  getFuentes(data: any) {
    if (!this.fuentes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.fuentes = items.map(fuente => ({
        value: fuente.iFuenteId,
        label: fuente.cFuenteNombre,
        cFuenteCSS: fuente.cFuenteCSS,
        cFuenteURL: fuente.cFuenteURL,
      }));
      return this.fuentes;
    }
    return this.fuentes;
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

  getTiposReportes() {
    if (!this.tipos_reportes) {
      this.tipos_reportes = [
        {
          label: 'LISTA DE PALABRAS UNICAS (TOP 15)',
          value: this.TIPO_REPORTE_LISTA,
        },
        {
          label: 'NUBE DE PALABRAS UNICAS (TOP 50)',
          value: this.TIPO_REPORTE_INDIVIDUAL,
        },
      ];
    }
    return this.tipos_reportes;
  }

  getTiposGraficos() {
    if (!this.tipos_graficos) {
      this.tipos_graficos = [
        {
          label: 'BARRA',
          value: this.GRAFICO_BARRA,
        },
        {
          label: 'CIRCULAR',
          value: this.GRAFICO_CIRCULAR,
        },
      ];
    }
    return this.tipos_graficos;
  }

  getTiposReportesPlantillas() {
    if (!this.tipos_reportes_plantillas) {
      this.tipos_reportes_plantillas = [
        {
          value: 1,
          label: 'ACTIVAS (BORRADORES Y APROBADAS)',
        },
        {
          value: 2,
          label: 'ARCHIVADAS',
        },
        {
          value: 3,
          label: 'TODAS',
        },
        {
          value: 4,
          label: 'ACTIVAS (BORRADORES)',
        },
        {
          value: 5,
          label: 'ACTIVAS (APROBADAS)',
        },
      ];
    }
    return this.tipos_reportes_plantillas;
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
