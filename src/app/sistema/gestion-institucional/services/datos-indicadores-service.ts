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
      this.sede_grado_seccion = items.map(item => ({
        iIieeId: Number(item.iIieeId),
        iSedeId: Number(item.iSedeId),
        cIieeCodigoModular: item.cIieeCodigoModular,
        cIieeNombre: item.cIieeNombre,
        cSedeNombre: item.cSedeNombre,
        iNivelGradoId: Number(item.iNivelGradoId),
        iSeccionId: Number(item.iSeccionId),
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
      this.nivel_grados = items.reduce((prev: any, current: any) => {
        const x = prev.find(item => item.value === current.iNivelGradoId);
        if (!x) {
          return prev.concat([
            {
              value: Number(current.iNivelGradoId),
              label: current.cGradoAbreviacion + ' ' + current.cGradoNombre,
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

  getSecciones(data: any) {
    if (!this.secciones && data) {
      const secciones = data.map(item => ({
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
