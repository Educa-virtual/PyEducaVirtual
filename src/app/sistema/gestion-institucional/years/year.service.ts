import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class YearService {
  constructor(private http: HttpClient) {}

  private activeIndex = new BehaviorSubject<number | null>(null);

  setActiveIndex(index: number) {
    this.activeIndex.next(index);
  }

  getActiveIndex(): Observable<any> {
    return this.activeIndex.asObservable();
  }

  parametros: any;
  parametros$?: Observable<any>;
  tipos_distribuciones: any[];
  tipos_periodos: any[];
  tipos_turnos: any[];
  dias_semana: any[];
  year: any;

  /* Compartir datos entre componentes */

  setYear(year: any[]) {
    this.year = JSON.stringify(year);
    localStorage.setItem('year', this.year);
  }

  getYear(): string | null {
    if (!this.year) {
      this.year = localStorage.getItem('year') == 'null' ? null : localStorage.getItem('year');
    }
    return JSON.parse(this.year);
  }

  /* Parametros de formularios */

  crearYear(data: any) {
    if (this.parametros) {
      return of(this.parametros);
    }

    if (!this.parametros$) {
      this.parametros$ = this.http.post(`${baseUrl}/grl/crearYear`, data).pipe(
        map((data: any) => {
          this.parametros = data.data;
          return this.parametros;
        }),
        shareReplay(1)
      );
    }

    return this.parametros$;
  }

  getTiposPeriodos(data: any) {
    if (!this.tipos_periodos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_periodos = items.map(item => ({
        value: Number(item.iPeriodoEvalId),
        label: item.cPeriodoEvalNombre,
      }));
      return this.tipos_periodos;
    }
    return this.tipos_periodos;
  }

  getTiposDistribuciones(data: any) {
    if (!this.tipos_distribuciones && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.tipos_distribuciones = items.map(item => ({
        value: Number(item.iTipoDistribucionId),
        label: item.cTipoDistribucionNombre,
      }));
      return this.tipos_distribuciones;
    }
    return this.tipos_distribuciones;
  }

  getDiasSemana() {
    return [
      { value: 1, label: 'LUNES' },
      { value: 2, label: 'MARTES' },
      { value: 3, label: 'MIÉRCOLES' },
      { value: 4, label: 'JUEVES' },
      { value: 5, label: 'VIERNES' },
      { value: 6, label: 'SÁBADO' },
      { value: 7, label: 'DOMINGO' },
    ];
  }

  /* Consultas CRUD */

  listarYears(data: any) {
    return this.http.post(`${baseUrl}/grl/listarYears`, data);
  }

  guardarYear(data: any) {
    return this.http.post(`${baseUrl}/grl/guardarYear`, data);
  }

  actualizarYear(data: any) {
    return this.http.post(`${baseUrl}/grl/actualizarYear`, data);
  }

  borrarYear(data: any) {
    return this.http.post(`${baseUrl}/grl/borrarYear`, data);
  }

  listarDistribucionBloques(data: any) {
    return this.http.post(`${baseUrl}/acad/listarDistribucionBloques`, data);
  }

  guardarDistribucionBloque(data: any) {
    return this.http.post(`${baseUrl}/acad/guardarDistribucionBloque`, data);
  }

  actualizarDistribucionBloque(data: any) {
    return this.http.post(`${baseUrl}/acad/actualizarDistribucionBloque`, data);
  }

  borrarDistribucionBloque(data: any) {
    return this.http.post(`${baseUrl}/acad/borrarDistribucionBloque`, data);
  }

  verCalendarioAcademicos(data: any) {
    return this.http.post(`${baseUrl}/acad/verCalendarioAcademicos`, data);
  }

  actualizarCalendarioAcademicos(data: any) {
    return this.http.post(`${baseUrl}/acad/actualizarCalendarioAcademicos`, data);
  }

  listarCalendarioPeriodos(data: any) {
    return this.http.post(`${baseUrl}/acad/listarCalendarioPeriodos`, data);
  }

  procesarCalendarioPeriodos(data: any) {
    return this.http.post(`${baseUrl}/acad/procesarCalendarioPeriodos`, data);
  }

  actualizarCalendarioPeriodo(data: any) {
    return this.http.post(`${baseUrl}/acad/actualizarCalendarioPeriodo`, data);
  }
}
