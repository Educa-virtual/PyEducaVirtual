import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class InstructoresService {
  constructor(private http: HttpClient) {}

  guardarInstructores(data): Observable<any> {
    return this.http.post(`${baseUrl}/cap/instructores`, data);
  }

  actualizarInstructoresxiInstId(iInstId: string | number, params): Observable<any> {
    return this.http.put(`${baseUrl}/cap/instructores/${iInstId}`, params);
  }
}
