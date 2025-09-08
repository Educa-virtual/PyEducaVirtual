import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DatosEncuestaService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public readonly PREGUNTA_CERRADA = 1;
  public readonly PREGUNTA_ABIERTA = 2;
  public readonly PREGUNTA_ESCALA = 3;

  public readonly ESTADO_BORRADOR = 1;
  public readonly ESTADO_TERMINADA = 2;
  public readonly ESTADO_APROBADA = 3;

  public readonly TIPO_REPORTE_LISTA = 1;
  public readonly TIPO_REPORTE_INDIVIDUAL = 2;

  public readonly GRAFICO_BARRA = 1;
  public readonly GRAFICO_CIRCULAR = 2;
  public readonly GRAFICO_NUBE = 3;

  lista: any[] = [];

  parametros: any;

  categorias: Array<object>;
  opciones: Array<object>;
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

  listarEncuestas(data: any) {
    return this.http.post(`${baseUrl}/bienestar/listarEncuestas`, data);
  }

  verEncuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verEncuesta`, data);
  }

  guardarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/guardarEncuesta`, data);
  }

  actualizarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/actualizarEncuesta`, data);
  }

  actualizarEncuestaEstado(data: any) {
    return this.http.post(`${baseUrl}/bienestar/actualizarEncuestaEstado`, data);
  }

  obtenerPoblacionObjetivo(data: any) {
    return this.http.post(`${baseUrl}/bienestar/obtenerPoblacionObjetivo`, data);
  }

  borrarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/borrarEncuesta`, data);
  }

  listarPreguntas(data: any) {
    return this.http.post(`${baseUrl}/bienestar/listarPreguntas`, data);
  }

  guardarPregunta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/guardarPregunta`, data);
  }

  verPregunta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verPregunta`, data);
  }

  actualizarPregunta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/actualizarPregunta`, data);
  }

  borrarPregunta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/borrarPregunta`, data);
  }

  listarRespuestas(data: any) {
    return this.http.post(`${baseUrl}/bienestar/listarRespuestas`, data);
  }

  guardarRespuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/guardarRespuesta`, data);
  }

  actualizarRespuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/actualizarRespuesta`, data);
  }

  verRespuesta(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verRespuesta`, data);
  }

  verResumen(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verResumen`, data);
  }

  printRespuestas(data: any) {
    return this.http.post(`${baseUrl}/bienestar/printRespuestas`, data, {
      responseType: 'blob',
    });
  }

  /*
   * Funciones para popular parametros de formularios de ficha
   */

  getEncuestaParametros(data: any) {
    if (!this.parametros) {
      this.parametros = this.http.post(`${baseUrl}/bienestar/crearEncuesta`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        })
      );
      return this.parametros;
    }
    return of(this.parametros);
  }

  getTiposPreguntas() {
    return [
      { label: 'PREGUNTA CERRADA (SI/NO)', value: this.PREGUNTA_CERRADA },
      { label: 'PREGUNTA ABIERTA (TEXTO)', value: this.PREGUNTA_ABIERTA },
      {
        label: 'PREGUNTA DE ESCALA (1 A 5)',
        value: this.PREGUNTA_ESCALA,
      },
    ];
  }

  getCategorias(data: any) {
    if (!this.categorias && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      return items.map((categoria: any) => ({
        value: categoria.iEncuCateId,
        label: categoria.cEncuCateNombre,
      }));
    }
    return this.categorias;
  }

  getOpciones(data: any) {
    if (!this.opciones && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      return items.map((opcion: any) => ({
        value: opcion.iEncuOpcId,
        label: opcion.cEncuOpcNombre,
      }));
    }
    return this.opciones;
  }

  getAlternativas(data: any) {
    if (!this.alternativas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      return items.map((opcion: any) => ({
        value: opcion.iEncuAlterGrupoId,
        label: opcion.cEncuAlterNombre,
      }));
    }
    return this.alternativas;
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

  filterInstitucionesEducativas(
    iNivelTipoId: any,
    iDsttId: any,
    iZonaId: any,
    iTipoSectorId: any,
    iUgelId: any
  ) {
    let ies_tmp: Array<object> = this.instituciones_educativas;
    if (!this.instituciones_educativas) {
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
        { label: 'TERMINADA', value: this.ESTADO_TERMINADA },
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
          iEncuPregTipoId: [this.PREGUNTA_CERRADA, this.PREGUNTA_ESCALA],
        },
        {
          label: 'CIRCULAR',
          value: this.GRAFICO_CIRCULAR,
          iEncuPregTipoId: [this.PREGUNTA_CERRADA, this.PREGUNTA_ESCALA],
        },
      ];
    }
    return this.tipos_graficos;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
