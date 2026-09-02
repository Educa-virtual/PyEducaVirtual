import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, Observable, of, shareReplay } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DatosIndicadoresService {
  constructor(private http: HttpClient) {}

  parametros: any;
  parametros$?: Observable<any>;

  nivel_tipos: Array<object>;
  ugeles: Array<object>;
  distritos: Array<object>;
  instituciones_educativas: Array<object>;
  sede_grado_seccion: Array<object>;
  nivel_grados: Array<object>;
  secciones: Array<object>;
  sexos: Array<object>;

  crearIndicadores(data: any): Observable<any> {
    if (this.parametros) {
      return of(this.parametros);
    }

    if (!this.parametros$) {
      this.parametros$ = this.http.post(`${baseUrl}/acad/verIndicadorParametros`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        }),
        shareReplay(1)
      );
    }
    return this.parametros$;
  }

  getSedeGradoSeccion(data: any) {
    if (!this.sede_grado_seccion && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.sede_grado_seccion = (items ?? []).map(ie => ({
        iNivelTipoId: Number(ie.iNivelTipoId),
        iIieeId: Number(ie.iIieeId),
        iDsstId: Number(ie.iDsstId),
        iUgelId: Number(ie.iUgelId),
        cIieeCodigoModular: ie.cIieeCodigoModular,
        cIieeNombre: ie.cIieeNombre,
        sedes: (ie.sedes ?? []).map(sede => ({
          iSedeId: Number(sede.iSedeId),
          cSedeNombre: sede.cSedeNombre,
          grados: (sede.grados ?? []).map(grado => ({
            iNivelGradoId: Number(grado.iNivelGradoId),
            secciones: (grado.secciones ?? []).map(sec => ({
              iSeccionId: Number(sec.iSeccionId),
            })),
          })),
        })),
      }));
      return this.sede_grado_seccion;
    }
    return this.sede_grado_seccion;
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

  getUgeles(data: any) {
    if (!this.ugeles && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.ugeles = items.map(item => ({
        value: Number(item.iUgeId),
        label: item.cUgeNombre,
      }));
      return this.ugeles;
    }
    return this.ugeles;
  }

  getDistritos(data: any) {
    if (!this.distritos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.distritos = items.map(item => ({
        value: Number(item.iDistritoId),
        label: item.cDistritoNombre,
      }));
      return this.distritos;
    }
    return this.distritos;
  }

  getNivelGrados(data: any) {
    if (!this.nivel_grados && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.nivel_grados = items.map(item => ({
        value: Number(item.iNivelGradoId),
        label: item.cGradoAbreviacion + ' ' + item.cGradoNombre,
      }));
    }
    return this.nivel_grados;
  }

  getSecciones(data: any) {
    if (!this.secciones && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      const secciones = items.map(item => ({
        label: item.cSeccionNombre,
        value: item.iSeccionId,
      }));
      this.secciones = secciones;
      return this.secciones;
    }
    return this.secciones;
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

  getSexos(data: any = null) {
    if (!this.sexos) {
      if (data) {
        const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
        this.sexos = items.map(item => ({
          value: item.cSexo,
          label: item.cSexoNombre ?? item.cSexoDescripcion ?? item.cSexo,
        }));
      } else {
        this.sexos = [
          { label: 'MASCULINO', value: 'M' },
          { label: 'FEMENINO', value: 'F' },
        ];
      }
    }
    return this.sexos;
  }

  /**
   * FUNCIONES PARA GESTIONAR MATRICULAS
   */

  verIndicadoresMatriculas(data: any) {
    return this.http.post(`${baseUrl}/acad/verIndicadorMatriculas`, data);
  }

  verIndicadoresDeserciones(data: any) {
    return this.http.post(`${baseUrl}/acad/verIndicadorDeserciones`, data);
  }

  verIndicadoresFaltasTardanzas(data: any) {
    return this.http.post(`${baseUrl}/acad/verIndicadorFaltasTardanzas`, data);
  }

  verIndicadoresDesempeno(data: any) {
    return this.http.post(`${baseUrl}/acad/verIndicadorDesempeno`, data);
  }

  verIndicadoresBajoRendimiento(data: any) {
    return this.http.post(`${baseUrl}/acad/verIndicadorBajoRendimiento`, data);
  }
}
