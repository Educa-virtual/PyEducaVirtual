import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  constructor(private http: HttpClient) {}

  listarCategorias(data: any) {
    return this.http.post(`${baseUrl}/enc/listarCategorias`, data);
  }

  verCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/verCategoria`, data);
  }

  guardarCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarCategoria`, data);
  }

  actualizarCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarCategoria`, data);
  }

  borrarCategoria(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarCategoria`, data);
  }

  listarEncuestas(data: any) {
    return this.http.post(`${baseUrl}/enc/listarEncuestas`, data);
  }

  verEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/verEncuesta`, data);
  }

  guardarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/guardarEncuesta`, data);
  }

  actualizarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/actualizarEncuesta`, data);
  }

  borrarEncuesta(data: any) {
    return this.http.post(`${baseUrl}/enc/borrarEncuesta`, data);
  }
}
