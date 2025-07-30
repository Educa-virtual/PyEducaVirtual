import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DatosRecordatorioService implements OnDestroy {
  periodos: Array<object>;
  private onDestroy$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  verFechasEspeciales(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verFechasEspeciales`, data);
  }

  verConfRecordatorio(data: any) {
    return this.http.post(`${baseUrl}/bienestar/verConfRecordatorio`, data);
  }

  actualizarConfReordatorio(data: any) {
    return this.http.post(`${baseUrl}/bienestar/actualizarConfRecordatorio`, data);
  }

  verRecordatorioPeriodos() {
    return this.http.get(`${baseUrl}/bienestar/verRecordatorioPeriodos`);
  }

  getPeriodos(data: any) {
    if (!this.periodos && data) {
      const items = data.data;
      return items.map((periodo: any) => ({
        value: Number(periodo.iRecorPeriodoId),
        label: periodo.cRecorPeriodoNombre,
      }));
    }
    return this.periodos;
  }

  /**
   *
   * FUNCIONES PARA FORMATEAR DATOS EN FORMULARIOS
   *
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
      if (!value) value = null;
      const fecha = new Date(value);
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
