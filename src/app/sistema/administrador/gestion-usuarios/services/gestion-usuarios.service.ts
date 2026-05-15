import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, of, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class GestionUsuariosService {
  constructor(private http: HttpClient) {}

  public readonly ESTADO_INACTIVO = 0;
  public readonly ESTADO_ACTIVO = 1;

  parametros: any;
  parametros$?: Observable<any>;

  tipos_documentos: Array<object>;
  perfiles: Array<object>;
  nivel_tipos: Array<object>;
  ugeles: Array<object>;
  distritos: Array<object>;
  instituciones_educativas: Array<object>;
  sedes: Array<object>;
  estados: Array<object>;

  /**
   * FORMATEAR PARAMETROS EN FORMULARIO
   */

  crearUsuario() {
    if (this.parametros) {
      return of(this.parametros);
    }

    if (!this.parametros$) {
      this.parametros$ = this.http.get(`${baseUrl}/seg/crearUsuario`).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        }),
        shareReplay(1)
      );
    }

    return this.parametros$;
  }

  getTiposDocumentos(data: any) {
    if (!this.tipos_documentos && data) {
      const items = typeof data === 'string' ? JSON.parse(data.replace(/^"(.*)"$/, '$1')) : data;
      this.tipos_documentos = items.map(tipo => ({
        value: tipo.iTipoIdentId,
        label: tipo.cTipoIdentNombre,
      }));
      return this.tipos_documentos;
    }
    return this.tipos_documentos;
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
        iUgelId: ie?.iUgelId,
        iSedeId: ie?.iSedeId,
        cSedeNombre: ie?.cSedeNombre,
      }));
      return this.instituciones_educativas;
    }
    return this.instituciones_educativas;
  }

  filterInstitucionesEducativas(iNivelTipoId: any) {
    let ies_tmp: Array<object> = this.instituciones_educativas;
    if (!iNivelTipoId) {
      return this.instituciones_educativas;
    }
    if (iNivelTipoId) {
      ies_tmp = ies_tmp.filter((ie: any) => {
        if (ie.iNivelTipoId == iNivelTipoId) {
          return ie;
        }
        return null;
      });
    }
    return ies_tmp;
  }

  getSedes(data: any, iIieeId: number) {
    if (iIieeId) {
      const ies = data.filter(ie => ie.value == iIieeId);
      this.sedes = ies.map(ie => ({
        value: ie.iSedeId,
        label: ie.cSedeNombre,
        iIieeId: ie?.iIieeId,
      }));
      return this.sedes;
    }
    return this.sedes;
  }

  getEstados() {
    if (!this.estados) {
      this.estados = [
        { label: 'INACTIVO', value: this.ESTADO_INACTIVO },
        { label: 'ACTIVO', value: this.ESTADO_ACTIVO },
      ];
    }
    return this.estados;
  }

  listarUsuarios(data: any) {
    return this.http.post(`${baseUrl}/seg/listarUsuarios`, data);
  }

  listarPerfilesUsuario(iCredId: any) {
    return this.http.get(`${baseUrl}/seg/usuarios/${iCredId}/perfiles`);
  }

  cambiarEstadoUsuario(iCredId: number, data: any) {
    return this.http.put(`${baseUrl}/seg/usuarios/${iCredId}/estado`, data);
  }

  restablecerClaveUsuario(iCredId: number) {
    return this.http.patch(`${baseUrl}/seg/usuarios/${iCredId}/password`, null);
  }

  actualizarVigenciaUsuario(iCredId: number, data: any) {
    return this.http.patch(`${baseUrl}/seg/usuarios/${iCredId}/vigencia`, data);
  }

  actualizarPerfilUsuario(iCredId: number, iCredEntPerfId: number, data: any) {
    return this.http.post(`${baseUrl}/seg/usuarios/${iCredId}/perfiles/${iCredEntPerfId}`, data);
  }

  registrarPerfil(iCredId: number, data: any) {
    return this.http.post(`${baseUrl}/seg/usuarios/${iCredId}/perfiles`, data);
  }

  registrarUsuario(data: any) {
    return this.http.post(`${baseUrl}/seg/usuarios`, data);
  }

  buscarPersona(data: any) {
    return this.http.post(`${baseUrl}/seg/personas`, data);
  }

  //Debe moverse a otro servicio
  obtenerInstitucionesEducativas() {
    return this.http.get(`${baseUrl}/acad/instituciones-educativas`);
  }

  obtenerSedesInstitucionEducativa(iIieeId: number) {
    return this.http.get(`${baseUrl}/acad/instituciones-educativas/${iIieeId}/sedes`);
  }

  obtenerModulosAdministrativos() {
    return this.http.get(`${baseUrl}/seg/modulos-administrativos`);
  }

  obtenerCursos() {
    return this.http.get(`${baseUrl}/acad/cursos?nivel=0`);
  }

  obtenerUgeles() {
    return this.http.get(`${baseUrl}/ere/Ugeles/obtenerUgeles`);
  }

  obtenerPerfilesPorTipo(tipo: string) {
    return this.http.get(`${baseUrl}/seg/perfiles?tipo=${tipo}`);
  }

  obtenerPerfilesUsuario(iCredId: any) {
    return this.http.get(`${baseUrl}/seg/usuarios/${iCredId}/perfiles`);
  }
}
