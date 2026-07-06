import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
