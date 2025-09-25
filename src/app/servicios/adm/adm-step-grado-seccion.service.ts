import { inject, Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { firstValueFrom } from 'rxjs';

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
  itemsStep = [
    {
      label: 'Configuración',
      routerLink: '/gestion-institucional/config',
    },
    {
      label: 'Ambientes',
      routerLink: '/gestion-institucional/ambiente',
    },
    // {
    //     label: 'Grados',
    //     routerLink: '/gestion-institucional/grado',
    // },
    {
      label: 'Grados y secciones',
      routerLink: '/gestion-institucional/seccion',
    },
    {
      label: 'Plan de estudios',
      routerLink: '/gestion-institucional/plan-estudio',
    },
    {
      label: 'Horas del docente',
      routerLink: '/gestion-institucional/hora-docente',
    },
    {
      label: 'Asignar grados y secciones',
      routerLink: '/gestion-institucional/asignar-grado',
    },
    {
      label: 'Resumen',
      routerLink: '/gestion-institucional/resumen',
    },
  ];

  iSedeId: number;
  iYAcadId: number;
  iNivelTipoId: number;
  iCredId: number;

  //Variables requeridas para el step de ambientes
  tipo_ambiente: any[] = null;
  tipo_ubicacion: any[] = null;
  uso_ambientes: any[] = null;
  condicion_ambiente: any[] = null;
  piso_ambiente: any[] = null;

  //variables de secciones
  secciones: any[] = null;
  seccionesAsignadas: any[] = null;
  diasLaborables: any[] = null;

  //variables de plan de estudios
  servicio_educativo: any[] = [];
  programacion_curricular: any[] = [];

  //variables de horas del docente
  docentes: any = [];

  constructor() {
    //  this.initializeData()
  }

  setEstadoConfig(value: any) {
    // informacion de tabla estado de configuraciones
    this.configTipo = value;
  }
  getEstadoConfig() {
    return this.configTipo;
  }

  getConfig() {
    return this.configuracion;
  }

  setListaConfig(item: any) {
    this.listaConfig = item.data;
  }

  getListaConfig() {
    return this.listaConfig;
  }
  // grados
  // Obtener grados
  // getGrados(): Grado[] {
  //   return this.grados;
  // }

  // Agregar un nuevo grado
  // addGrado(newGrado: Grado): void {
  //   this.grados.push(newGrado);
  // }

  // Actualizar un grado por ID
  // updateGrado(id: number, updatedGrado: Partial<Grado>): void {
  //   const index = this.grados.findIndex(g => g.iConfigGradoId === id);
  //   if (index !== -1) {
  //     this.grados[index] = { ...this.grados[index], ...updatedGrado };
  //   }
  // }

  // // Eliminar un grado por ID
  // deleteGrado(id: number): void {
  //   this.grados = this.grados.filter(g => g.iConfigGradoId !== id);
  // }

  // metodos para consumo
  //////////////  ambientes //////////////////////////
  async getAmbientes() {
    const resp: any = await firstValueFrom(
      this.query.searchAmbienteAcademico({
        json: JSON.stringify({
          iSedeId: this.configuracion[0].iSedeId,
          iYAcadId: this.configuracion[0].iYAcadId,
        }),
        _opcion: 'getAmbientesSedeYear',
      })
    );
    this.ambientes = resp.data;
    return resp.data;
  }

  async getTipoAmbiente() {
    // devuelve arrays de tabla acad.tipo_ambientes
    const resp: any = await firstValueFrom(
      this.query.searchCalAcademico({
        esquema: 'acad',
        tabla: 'tipo_ambientes',
        campos: 'iTipoAmbienteId, cTipoAmbienteNombre',
        condicion: '1=1',
      })
    );
    this.tipo_ambiente = resp.data;
    return resp.data;
  }
  async getTipoUbicacion() {
    //devuelve arrays de tabla acad.ubiccion_ambientes
    const resp: any = await firstValueFrom(
      this.query.searchCalAcademico({
        esquema: 'acad',
        tabla: 'ubicacion_ambientes',
        campos: 'iUbicaAmbId, cUbicaAmbNombre',
        condicion: '1=1',
      })
    );
    this.tipo_ubicacion = resp.data;
    return resp.data;
  }
  async getUsoAmbiente() {
    // devuelve arrays de tabla acad.uso_ambientes
    const resp: any = await firstValueFrom(
      this.query.searchCalAcademico({
        esquema: 'acad',
        tabla: 'uso_ambientes',
        campos: 'iUsoAmbId, cUsoAmbNombre, cUsoAmbDescripcion',
        condicion: '1=1',
      })
    );
    this.uso_ambientes = resp.data;
    return resp.data;
  }
  async getPisoAmbiente() {
    // devuelve arrays de tabla acad.piso_ambientes
    const resp: any = await firstValueFrom(
      this.query.searchCalAcademico({
        esquema: 'acad',
        tabla: 'piso_ambientes',
        campos: 'iPisoAmbid, cPisoAmbNombre, cPisoAmbDescripcion',
        condicion: '1=1',
      })
    );
    this.piso_ambiente = resp.data;
    return resp.data;
  }
  async getCondicionAmbiente() {
    // devuelve arrays de tabla acad.estado_ambientes
    const resp: any = await firstValueFrom(
      this.query.searchCalAcademico({
        esquema: 'acad',
        tabla: 'estado_ambientes',
        campos: 'iEstadoAmbId, cEstadoAmbNombre',
        condicion: '1=1',
      })
    );
    this.condicion_ambiente = resp.data;
    return resp.data;
  }
  //////////////  ambientes //////////////////////////

  //////////////  secciones //////////////////////////
  async getSecciones() {
    const resp: any = await firstValueFrom(
      this.query.searchCalAcademico({
        esquema: 'acad',
        tabla: 'secciones',
        campos: 'iSeccionId, cSeccionNombre,cSeccionDescripcion',
        condicion: '1=1',
      })
    );
    this.secciones = resp.data;
    return resp.data;
  }

  async getSeccionesAsignadas() {
    const resp: any = await firstValueFrom(
      this.query.searchAmbienteAcademico({
        json: JSON.stringify({
          iConfigId: this.configuracion[0].iConfigId,
        }),
        _opcion: 'getSeccionesConfig',
      })
    );
    this.seccionesAsignadas = resp.data.map((ambiente: any) => {
      return {
        ...ambiente, // Mantén todos los campos originales
        arrayAmbientes: {
          ciclo: ambiente.cCicloRomanos,
          grado: ambiente.cGradoNombre,
          seccion: ambiente.cSeccionNombre,
          estudiantes: ambiente.iDetConfCantEstudiantes,
          ambiente: ambiente.cAmbienteNombre,
        },
      };
    });
    /*
      const gradosMap = new Map();

      this.seccionesAsignadas.forEach((a: any) => {
        const gradoId = a.iGradoId ?? '';
        const gradoNombre = a.arrayAmbientes.grado ?? '';
        if (!gradosMap.has(gradoId)) {
          gradosMap.set(gradoId, {
            iGradoId: gradoId,
            grado: gradoNombre,
          });
        }
      });

      this.grados = Array.from(gradosMap.values()).sort((a, b) =>
          a.iGradoId.localeCompare(b.iGradoId)
      );
        //ordenar
      this.grados = this.grados.sort((a, b) => Number(a.iGradoId) - Number(b.iGradoId));
      */
    return this.seccionesAsignadas;
  }
  async getGrado() {
    const resp: any = await firstValueFrom(
      this.query.searchGradoCiclo({
        iNivelTipoId: this.iNivelTipoId,
      })
    );
    this.grados = resp.data;
    return resp.data;
  }

  async getDiasCalendario() {
    const resp: any = await firstValueFrom(
      this.query.searchCalendario({
        json: JSON.stringify({
          iCalAcadId: this.configuracion[0].iCalAcadId,
        }),
        _opcion: 'getCalendarioDiasLaborables',
      })
    );
    // Parseamos el JSON original una sola vez

    const dias_json = JSON.parse(resp.data[0].calDiasDatos);
    // Concatenamos los nombres en una sola cadena
    this.diasLaborables = dias_json.map((dia: any) => dia.cDiaNombre).join(', ');

    return this.diasLaborables;
  }
}
