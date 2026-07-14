import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class nationalHolidayService {
  importEndPoint = `${baseUrl}/grl/feriados-nacionales`;
  endPoint = `${baseUrl}/grl/feriados-nacionales`;
  constructor(
    public http: HttpClient,
    private messageService: MessageService
  ) {}

  importDataCollection(data: any): Observable<any> {
    return this.http.post(`${this.importEndPoint}`, {
      SpecialsDates: data,
    });
  }

  downloadTemplate() {
    this.http
      .get(`${baseUrl}/file/import`, {
        params: {
          template: 'plantilla-feriados-nacionales',
        },
        responseType: 'blob',
      })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'feriados-nacionales-template.xlsx';
        a.target = '_self';
        a.click();

        window.URL.revokeObjectURL(url);
      });
  }

  listarFeriadosNacionales(data: any) {
    return this.http.post(`${this.endPoint}/listarFeriadosNacionales`, data);
  }

  guardarFeriadoNacional(data: any) {
    return this.http.post(`${this.endPoint}/guardarFeriadoNacional`, data);
  }

  guardarFeriadoNacionalMasivo(data) {
    return this.http.post(`${this.endPoint}/guardarFeriadoNacionalMasivo`, data);
  }

  actualizarFeriadoNacional(data) {
    return this.http.post(`${this.endPoint}/actualizarFeriadoNacional`, data);
  }

  borrarFeriadoNacional(data: any) {
    return this.http.post(`${this.endPoint}/borrarFeriadoNacional`, data);
  }

  aplicarFeriadosNacionales(data: any) {
    return this.http.put(`${this.endPoint}/aplicarFeriadosNacionales`, data);
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
      if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
        value = null;
      } else {
        value = Number(value);
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
