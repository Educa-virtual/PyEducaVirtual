import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacantesService {
  private apiUrl = 'http://localhost:4200/api/vacantes'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para enviar los datos al backend
  guardarVacantes(vacantes: any[]): Observable<any> {
    return this.http.post(this.apiUrl, { vacantes });
  }
}
