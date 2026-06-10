import { inject, Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { BehaviorSubject, Observable, map, of, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

export interface ConfigTipo {
  iEstadoConfigId: number;
  cEstadoConfigNombre: string;
}

export interface Grado {
  iConfigGradoId: number;
  iCicloId: number;
  iGradoId: number;
  iFasesPromId: number;
  iYAcadId: number;
  iSedeId: number;
  bConfigGradoEstado: number;
  cConfigGradoObs: string;
  cYAcadNombre: string;
  cFase: string;
  cCiclo: string;
  cGrado: string;
}

export interface Ambientes {
  iIieeAmbienteId: number;
  iTipoAmbienteId: number;
  cTipoAmbienteNombre: string;
  iEstadoAmbId: number;
  cEstadoAmbNombre: string;
  iUbicaAmbId: number;
  cUbicaAmbNombre: string;
  iUsoAmbId: number;
  ambiente: string;
  cUsoAmbNombre: string;
  cUsoAmbDescripcion: string;
  iPisoAmbid: number;
  cPisoAmbNombre: string;
  cPisoAmbDescripcion: string;
  iYAcadId: number;
  cYAcadNombre: string;
  iSedeId: number;
  cSedeNombre: string;
  iIieeId: number;
  bAmbienteEstado: boolean;
  cAmbienteNombre: string;
  cAmbienteObs: string;
  iAmbienteArea: number;
  iAmbienteAforo: number;
  cAmbienteDescripcion: string;
}

export interface ListaConfig {
  iConfigId: number;
  iEstadoConfigId: number;
  cConfigDescripcion: string;
  cConfigNroRslAprobacion: string;
  cConfigUrlRslAprobacion: string;
  cEstadoConfigNombre: string;
  cSedeNombre: string;
  iSedeId: number;
  iYAcadId: number;
  cYAcadNombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdmStepGradoSeccionService {
  private query = inject(GeneralService);

  // Propiedades
  configTipo: ConfigTipo[] = [];
  ambientes: Ambientes[] = null;
  grados: any = null;
  listaConfig: ListaConfig[] = [];

  configuracion: any[];
  sede: [];
  perfil: [];
  anio: [];
  listaGrados: [];

  iSedeId: number;
  iYAcadId: number;
  iNivelTipoId: number;
  iCredId: number;

  parametros: any;
  parametros$?: Observable<any>;

  //Variables requeridas para el step de ambientes
  grado_seccion_turno: Array<object>;
  tipos_documentos: Array<object>;
  sexos: Array<object>;
  nivel_grados: Array<object>;
  secciones: Array<object>;
  turnos: Array<object>;
  estados_configuracion: Array<object>;
  tipos_ambientes: Array<object>;
  estados_ambientes: Array<object>;
  pisos_ambientes: Array<object>;
  usos_ambientes: Array<object>;
  ubicaciones_ambientes: Array<object>;

  //variables de secciones
  diasLaborables: any[] = null;

  //variables de plan de estudios
  servicio_educativo: any[] = [];
  programacion_curricular: any[] = [];

  //variables de horas del docente
  docentes: any = [];

  private activeIndex = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {}

  setActiveIndex(index: number) {
    this.activeIndex.next(index);
  }

  getActiveIndex(): Observable<any> {
    return this.activeIndex.asObservable();
  }

  crearConfiguracion(data: any): Observable<any> {
    if (this.parametros) {
      return of(this.parametros);
    }

    if (!this.parametros$) {
      this.parametros$ = this.http.post(`${baseUrl}/acad/crearConfiguracion`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        }),
        shareReplay(1)
      );
    }

    return this.parametros$;
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
        iDetConfCantEstudiantes: item.iDetConfCantEstudiantes,
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

  filterSecciones(data: any, iNivelGradoId: any) {
    if (data) {
      const secciones = data.filter(item => item.iNivelGradoId === iNivelGradoId);
      this.secciones = secciones.map(item => ({
        label: item.cSeccionNombre,
        value: item.iSeccionId,
        iNivelGradoId: item.iNivelGradoId,
        iDetConfCantEstudiantes: item.iDetConfCantEstudiantes,
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
        iDetConfCantEstudiantes: item.iDetConfCantEstudiantes,
      }));
      return this.turnos;
    }
    return this.turnos;
  }

  getEstadosConfiguracion(data: any) {
    if (!this.estados_configuracion && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.estados_configuracion = items.map(tipo => ({
        value: Number(tipo.iEstadoConfigId),
        label: tipo.cEstadoConfigNombre,
      }));
      return this.estados_configuracion;
    }
    return this.estados_configuracion;
  }

  getTiposAmbientes(data: any) {
    if (!this.tipos_ambientes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_ambientes = items.map(estado => ({
        value: Number(estado.iTipoAmbienteId),
        label: estado.cTipoAmbienteNombre,
      }));
      return this.tipos_ambientes;
    }
    return this.tipos_ambientes;
  }

  getEstadosAmbientes(data: any) {
    if (!this.estados_ambientes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.estados_ambientes = items.map(tipo => ({
        value: Number(tipo.iEstadoAmbId),
        label: tipo.cEstadoAmbNombre,
      }));
      return this.estados_ambientes;
    }
    return this.estados_ambientes;
  }

  getPisosAmbientes(data: any) {
    if (!this.pisos_ambientes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.pisos_ambientes = items.map(nacionalidad => ({
        value: Number(nacionalidad.iPisoAmbid),
        label: nacionalidad.cPisoAmbNombre,
      }));
      return this.pisos_ambientes;
    }
    return this.pisos_ambientes;
  }

  getUsosAmbientes(data: any) {
    if (!this.usos_ambientes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.usos_ambientes = items.map(tipo => ({
        value: Number(tipo.iUsoAmbId),
        label: tipo.cUsoAmbNombre,
      }));
      return this.usos_ambientes;
    }
    return this.usos_ambientes;
  }

  getUbicacionesAmbientes(data: any) {
    if (!this.ubicaciones_ambientes && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.ubicaciones_ambientes = items.map(tipo => ({
        value: Number(tipo.iUbicaAmbId),
        label: tipo.cUbicaAmbNombre,
      }));
      return this.ubicaciones_ambientes;
    }
    return this.ubicaciones_ambientes;
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

  async getAmbientes() {
    return null;
  }

  async getTipoAmbiente() {
    return null;
  }
  async getTipoUbicacion() {
    return null;
  }
  async getUsoAmbiente() {
    return null;
  }
  async getPisoAmbiente() {
    return null;
  }
  async getCondicionAmbiente() {
    return null;
  }

  async getSecciones() {
    return null;
  }

  async getSeccionesAsignadas() {
    return null;
  }

  async getGrado() {
    return null;
  }

  async getDiasCalendario() {
    return null;
  }

  /**
   * FUNCIONES PARA GESTIONAR CONFIGURACIONES DE IE
   */

  descargarAprobacion(data: any) {
    return this.http.post(`${baseUrl}/acad/descargarAprobacion`, data);
  }

  verConfiguracion(data) {
    return this.http.post(`${baseUrl}/acad/verConfiguracion`, data);
  }

  guardarConfiguracion(data) {
    return this.http.post(`${baseUrl}/acad/guardarConfiguracion`, data);
  }

  actualizarConfiguracion(data) {
    return this.http.post(`${baseUrl}/acad/actualizarConfiguracion`, data);
  }

  listarAmbientes(data: any) {
    return this.http.post(`${baseUrl}/acad/listarAmbientes`, data);
  }

  verAmbiente(data: any) {
    return this.http.post(`${baseUrl}/acad/verAmbiente`, data);
  }

  guardarAmbiente(data: any) {
    return this.http.post(`${baseUrl}/acad/guardarAmbiente`, data);
  }

  actualizarAmbiente(data: any) {
    return this.http.post(`${baseUrl}/acad/actualizarAmbiente`, data);
  }

  borrarAmbiente(data: any) {
    return this.http.post(`${baseUrl}/acad/borrarAmbiente`, data);
  }
}
