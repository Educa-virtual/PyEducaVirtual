import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  constructor(private http: HttpClient) {}

  insCalendarioAcademico(data: any) {
    return this.http.post(`${baseUrl}/acad/calendarioAcademico/insCalendarioAcademico`, data, {
      responseType: 'blob',
    });
  }

  selTipoIdentificacion() {
    return this.http.post(`${baseUrl}/grl/selTipoIdentificacion`, {
      responseType: 'blob',
    });
  }
}
