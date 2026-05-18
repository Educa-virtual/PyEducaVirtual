import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class MaterialEducativoService {
  constructor(private http: HttpClient) {}

  guardarMaterialEducativo(data: any) {
    return this.http.post(`${baseUrl}/doc/material-educativo/guardar`, data);
  }

  obtenerMaterialEducativo(data: any) {
    return this.http.post(`${baseUrl}/doc/material-educativo/obtener`, data);
  }

  eliminarMaterialEducativo(data: any) {
    return this.http.post(`${baseUrl}/doc/material-educativo/eliminar`, data);
  }

  subirArchivo(data: any) {
    return this.http.post(`${baseUrl}/doc/material-educativo/subir-archivo`, data);
  }
}
