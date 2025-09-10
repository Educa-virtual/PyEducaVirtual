import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ReunionVirtualesService {
  constructor(private http: HttpClient) {}

  guardarReunionVirtual(data): Observable<any> {
    return this.http.post(`${baseUrl}/aula-virtual/reunion-virtuales`, data);
  }

  actualizarReunionVirtualxiRVirtualId(iRVirtualId: string | number, params): Observable<any> {
    return this.http.put(`${baseUrl}/aula-virtual/reunion-virtuales/${iRVirtualId}`, params);
  }

  obtenerReunionVirtualxiRVirtualId(iRVirtualId: string | number, params): Observable<any> {
    return this.http.get(`${baseUrl}/aula-virtual/reunion-virtuales/${iRVirtualId}`, { params });
  }
}
