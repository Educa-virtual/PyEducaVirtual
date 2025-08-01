import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  constructor(private http: HttpClient) {}

  guardarTareas(data): Observable<any> {
    return this.http.post(`${baseUrl}/aula-virtual/tareas`, data);
  }

  actualizarTareasxiTareaId(iTareaId: string | number, params): Observable<any> {
    return this.http.put(`${baseUrl}/aula-virtual/tareas/${iTareaId}`, params);
  }
}
