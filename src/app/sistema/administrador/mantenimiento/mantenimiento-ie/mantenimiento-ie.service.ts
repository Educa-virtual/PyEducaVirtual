import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

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
}

export interface Sede {
  iCredEntPerfId: number;
  iCredId: string;
  iSedeId?: number;
  iIieeId: number;
  cSedeNombre: string;
  cSedeDireccion: string;
  iServEdId: number;
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

  crearInstitucionEducativa(
    data: InstitucionEducativa
  ): Observable<RespuestaApi<InstitucionEducativa>> {
    return this.http.post<RespuestaApi<InstitucionEducativa>>(
      this.baseUrlIE + '/insertarIntituciones',
      data
    );
  }

  actualizarInstitucionEducativa(
    id: number,
    data: InstitucionEducativa
  ): Observable<RespuestaApi<InstitucionEducativa>> {
    return this.http.put<RespuestaApi<InstitucionEducativa>>(`${this.baseUrl}/${id}`, data);
  }

  eliminarInstitucionEducativa(id: number, iSesionId: number): Observable<RespuestaApi<any>> {
    return this.http.delete<RespuestaApi<any>>(`${this.baseUrl}/${id}`, {
      body: { iSesionId },
    });
  }
  // obtenerDistritos(): Observable<RespuestaApi<Distrito[]>> {
  //   return this.http.get<RespuestaApi<Distrito[]>>(`${this.urlBackendApi}/catalogos/distritos`);
  // }

  // obtenerUgeles(): Observable<RespuestaApi<Ugel[]>> {
  //   return this.http.get<RespuestaApi<Ugel[]>>(`${this.urlBackendApi}/catalogos/ugeles`);
  // }

  // obtenerZonas(): Observable<RespuestaApi<any[]>> {
  //   return this.http.get<RespuestaApi<any[]>>(`${this.urlBackendApi}/catalogos/zonas`);
  // }

  // obtenerSectores(): Observable<RespuestaApi<any[]>> {
  //   return this.http.get<RespuestaApi<any[]>>(`${this.urlBackendApi}/catalogos/sectores`);
  // }

  // obtenerNiveles(): Observable<RespuestaApi<any[]>> {
  //   return this.http.get<RespuestaApi<any[]>>(`${this.urlBackendApi}/catalogos/niveles`);
  // }

  // obtenerSedes(): Observable<RespuestaApi<any[]>> {
  //   return this.http.get<RespuestaApi<any[]>>(`${this.urlBackendApi}/catalogos/sedes`);
  // }

  crearSede(data: Sede): Observable<RespuestaApi<Sede>> {
    return this.http.post<RespuestaApi<Sede>>(this.baseUrlIE + '/insertarSedes', data);
  }
}
