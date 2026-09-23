import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  constructor(private http: HttpClient) {}

  buscarHorario(data: any) {
    return this.http.post(`${baseUrl}/hor/buscarHorario`, data);
  }

  addCalAcademico(data: any) {
    return this.http.post(`${baseUrl}/hor/calendarioAcademico/guardarHorario`, data);
  }

  agregarBloqueDetalle(data: any) {
    return this.http.post(`${baseUrl}/acad/calendarioAcademico/detalleBloqueAcademico`, data);
  }
}
