import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class InformacionService {
  constructor(private http: HttpClient) {}

  subirImagen(data: any) {
    return this.http.post(`${baseUrl}/acad/subirImagen`, data);
  }
  subirDcoumento(data: any) {
    return this.http.post(`${baseUrl}/acad/subirDocumento`, data);
  }
  recibirMultimedia(data: any) {
    return this.http.post(`${baseUrl}/acad/descargarArchivo`, data, {
      responseType: 'blob',
    });
  }
}
