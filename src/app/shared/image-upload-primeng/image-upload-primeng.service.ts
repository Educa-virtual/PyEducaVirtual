import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadPrimengService {
  private urlBackendApi = environment.backendApi;

  constructor(private http: HttpClient) {}

  subirImagen(data: any, url: string) {
    return this.http.post(`${this.urlBackendApi}/${url}`, data, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
