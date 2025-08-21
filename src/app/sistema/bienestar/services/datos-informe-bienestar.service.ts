import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { map, of, Observable, BehaviorSubject, shareReplay, tap } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DatosInformeBienestarService {
  constructor(
    private http: HttpClient,
    private store: LocalStoreService
  ) {}

  perfil = this.store.getItem('dremoPerfil');
  iYAcadId = this.store.getItem('dremoiYAcadId');

  lista: any[] = [];

  parametros: any;

  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  distritos: Array<object>;
  instituciones_educativas: Array<object>;
  sexos: Array<object>;
  secciones: Array<object>;
  ugeles: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  estados: Array<object>;

  antiguo_form: any;
  reportes: any;

  private activeIndex = new BehaviorSubject<number | null>(null);

  getActiveIndex(): Observable<any> {
    return this.activeIndex.asObservable();
  }

  setActiveIndex(index: number) {
    this.activeIndex.next(index);
  }

  private reportesSubject = new BehaviorSubject<any>(null);
  reportes$ = this.reportesSubject.asObservable();

  verReporte(data?: any, forzar_consulta: boolean = false): Observable<any> {
    if (!this.reportes || forzar_consulta) {
      this.reportes = this.http.post(`${baseUrl}/bienestar/verReporte`, data).pipe(
        tap(resp => this.reportesSubject.next(resp)),
        shareReplay(1)
      );
      return this.reportes;
    }
    return this.reportes;
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
        { label: 'EN PROCESO', value: 1 },
        { label: 'EN BLANCO', value: 0 },
      ];
    }
    return this.estados;
  }

  obtenerParametros(data: any) {
    if (!this.parametros) {
      return this.http.post(`${baseUrl}/bienestar/crearReporte`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        })
      );
    }
    return of(this.parametros);
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
    if (!iUgelId) return null;
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
    if (!iNivelTipoId) return null;
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
}
