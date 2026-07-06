import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class YearService {
  constructor(private http: HttpClient) {}

  listarYears(data: any) {
    return this.http.post(`${baseUrl}/grl/years/listarYears`, data);
  }

  guardarYear(data: any) {
    return this.http.post(`${baseUrl}/grl/years/guardarYear`, data);
  }

  actualizarYear(data: any) {
    return this.http.post(`${baseUrl}/grl/years/actualizarYear`, data);
  }

  borrarYear(data: any) {
    return this.http.post(`${baseUrl}/grl/years/borrarYear/`, data);
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
      console.log(fecha, 'fecha formateada');
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
