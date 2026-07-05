import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

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
}
