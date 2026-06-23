import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private env = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerAulaDetalle(datos: any) {
    return this.http.post(`${this.env}/aula-virtual/aulaDetalle`, datos);
  }
}
