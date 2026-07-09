import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable, of, shareReplay } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class YearService {
  constructor(private http: HttpClient) {}

  parametros: any;
  parametros$?: Observable<any>;
  tipos_distribuciones: any[];
  periodos: any[];
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

  getPeriodos(data: any) {
    if (!this.periodos && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.periodos = items.map(item => ({
        value: Number(item.iPeriodoEvalId),
        label: item.cPeriodoEvalNombre,
      }));
      return this.periodos;
    }
    return this.periodos;
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

  procesarPeriodosEvaluacion(data) {
    return this.http.post(`${baseUrl}/procesarPeriodosEvaluacion`, data);
  }

  /**
   * FUNCIONES GENERALES
   */

  /**
   *
   * @param form El nombre del formulario
   * @param formControl El nombre del control del formulario
   * @param value El valor del control
   * @param tipo El tipo del control
   * @param groupControl El control por el que se agrupan los datos en el json, por defecto es null
   */
  formatearFormControl(
    form: FormGroup,
    formControl: string,
    value: any,
    tipo: 'number' | 'string' | 'json' | 'boolean' | 'date',
    groupControl: string | null = null
  ) {
    if (tipo === 'number') {
      if (!value || isNaN(Number(value))) {
        value = null;
      } else {
        value = +value;
      }
      form.get(formControl).patchValue(value);
    } else if (tipo === 'boolean') {
      if (!value || isNaN(Number(value))) value = 0;
      form.get(formControl)?.patchValue(value == 1 ? true : false);
    } else if (tipo === 'string') {
      if (!value) value = null;
      form.get(formControl)?.patchValue(value);
    } else if (tipo === 'date') {
      let fecha = null;
      if (value) {
        value = value.substring(0, 10);
        fecha = new Date(value + 'T00:00:00');
      }
      form.get(formControl)?.patchValue(fecha);
    } else if (tipo === 'json') {
      if (!value) {
        form.get(formControl)?.patchValue(null);
      } else {
        const json = JSON.parse(value);
        const items = [];
        for (let i = 0; i < json.length; i++) {
          if (groupControl) {
            items.push(json[i][groupControl]);
          } else {
            items.push(json[i][formControl]);
          }
        }
        form.get(formControl)?.patchValue(items);
      }
    } else {
      if (!value) value = null;
      form.get(formControl)?.patchValue(value);
    }
  }
}
