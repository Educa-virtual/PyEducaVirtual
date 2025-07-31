import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class PreguntasService {
  constructor(private http: HttpClient) {}

  guardarPreguntas(data): Observable<any> {
    return this.http.post(`${baseUrl}/aula-virtual/preguntas`, data);
  }
}
