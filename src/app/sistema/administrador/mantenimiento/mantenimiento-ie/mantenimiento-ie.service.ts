import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map, shareReplay } from 'rxjs';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

export interface InstitucionEducativa {
  iIieeId?: number;
  cIieeCodigoModular: string;
  iDsttId: number;
  iZonaId?: number;
  iTipoSectorId: number;
  cIieeNombre: string;
  cIieeRUC?: string;
  cIieeDireccion?: string;
  cIieeLogo?: string;
  iNivelTipoId?: number;
  iUgelId?: number;
  iSedeId?: number;
  iSesionId: number;
  cIieeEmail: string;
  cIieeTelefono: number;
  iEstado: number;
  cIieeDirector: string;
}

export interface Sede {
  iCredEntPerfId: number;
  iCredId: string;

  iSedeId?: number;
  iIieeId: number;
  cSedeNombre: string;
  cSedeDireccion: string;
  iServEdId: number;
  iEstado: number;

  cSedeRslCreacion: string;
  dSedeRslCreacion: Date;
  cSedeTelefono: string;
  iTurnoId: number;
  cSedeEmail: string;
  cSedeDirector: string;
}

export interface FiltrosIE {
  iDsttId?: number;
  iZonaId?: number;
  iTipoSectorId?: number;
  iNivelTipoId?: number;
  iUgelId?: number;
  iSedeId?: number;
  termino_busqueda?: string;
  pagina?: number;
  registros_por_pagina?: number;
}

export interface RespuestaApi<T> {
  validated: boolean;
  mensaje: string;
  data?: T;
}
export interface Distrito {
  iDsttId: number;
  cDsttNombre: string;
}

export interface Ugel {
  iUgelId: number;
  cUgelNombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class MantenimientoIeService {
  private urlBackendApi = environment.backendApi;
  private baseUrl = `${this.urlBackendApi}/acad/mantenimiento-ie`;
  private baseUrlIE = `${this.urlBackendApi}/acad/administrador`;

  constructor(private http: HttpClient) {}

  parametros: any;
  parametros$?: Observable<any>;

  nivel_tipos: any[];
  zonas: any[];
  tipos_sectores: any[];
  ugeles: any[];
  provincias: any[];
  distritos: any[];
  turnos: any[];
  servicios_educativos: any[];

  crearInstitucionEducativa(data: any) {
    if (this.parametros) {
      return of(this.parametros);
    }

    if (!this.parametros$) {
      this.parametros$ = this.http.post(`${baseUrl}/acad/crearInstitucionEducativa`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        }),
        shareReplay(1)
      );
    }

    return this.parametros$;
  }

  getNivelTipos(data: any) {
    if (!this.nivel_tipos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.nivel_tipos = items.map(item => ({
        value: Number(item.iNivelTipoId),
        label: item.cNivelTipoNombre,
      }));
      return this.nivel_tipos;
    }
    return this.nivel_tipos;
  }

  getZonas(data: any) {
    if (!this.zonas && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.zonas = items.map(item => ({
        value: Number(item.iZonaId),
        label: item.cZonaNombre,
      }));
      return this.zonas;
    }
    return this.zonas;
  }

  getTiposSectores(data: any) {
    if (!this.tipos_sectores && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_sectores = items.map(item => ({
        value: Number(item.iTipoSectorId),
        label: item.cTipoSectorNombre,
      }));
      return this.tipos_sectores;
    }
    return this.tipos_sectores;
  }

  getUgeles(data: any) {
    if (!this.ugeles && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.ugeles = items.map(item => ({
        value: Number(item.iUgelId),
        label: item.cUgelNombre,
      }));
      return this.ugeles;
    }
    return this.ugeles;
  }

  getProvincias(data: any) {
    if (!this.provincias && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.provincias = items.map(item => ({
        value: Number(item.iPrvnId),
        label: item.cProvNombre,
      }));
      return this.provincias;
    }
    return this.provincias;
  }

  getDistritos(data: any) {
    if (!this.distritos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.distritos = items.map(item => ({
        value: Number(item.iDsttId),
        label: item.cDsttNombre,
      }));
      return this.distritos;
    }
    return this.distritos;
  }

  getTurnos(data: any) {
    if (!this.turnos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.turnos = items.map(item => ({
        value: Number(item.iTurnoId),
        label: item.cTurnoNombre,
      }));
      return this.turnos;
    }
    return this.turnos;
  }

  getServiciosEducativos(data: any) {
    if (!this.servicios_educativos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.servicios_educativos = items.map(item => ({
        value: Number(item.iServEdId),
        label: item.cServEdNombre,
        iNivelTipoId: item.iNivelTipoId,
      }));
      return this.servicios_educativos;
    }
    return this.servicios_educativos;
  }

  listarInstitucionesEducativas(data: any) {
    return this.http.post(`${baseUrl}/acad/listarInstitucionesEducativas`, data);
  }

  verInstitucionEducativa(data: any) {
    return this.http.post(`${baseUrl}/acad/verInstitucionEducativa`, data);
  }

  eliminarInstitucionEducativa(data: any) {
    return this.http.post(`${baseUrl}/acad/eliminarInstitucionEducativa`, data);
  }

  listarSedes(data: any) {
    return this.http.post(`${baseUrl}/acad/listarSedes`, data);
  }

  guardarSede(data: any) {
    return this.http.post(`${baseUrl}/acad/guardarSede`, data);
  }

  actualizarSede(data: any) {
    return this.http.post(`${baseUrl}/acad/actualizarSede`, data);
  }

  eliminarSede(data: any) {
    return this.http.post(`${baseUrl}/acad/eliminarSede`, data);
  }

  obtenerInstitucionEducativa(
    filtros?: FiltrosIE
  ): Observable<RespuestaApi<InstitucionEducativa[]>> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const value = filtros[key as keyof FiltrosIE];
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<RespuestaApi<InstitucionEducativa[]>>(this.baseUrl, { params });
  }

  guardarInstitucionEducativa(data: any) {
    return this.http.post(`${baseUrl}/acad/guardarInstitucionEducativa`, data);
  }

  actualizarInstitucionEducativa(data: any) {
    return this.http.post(`${baseUrl}/acad/actualizarInstitucionEducativa`, data);
  }

  crearSede(data: Sede): Observable<RespuestaApi<Sede>> {
    return this.http.post<RespuestaApi<Sede>>(this.baseUrlIE + '/insertarSedes', data);
  }
}
