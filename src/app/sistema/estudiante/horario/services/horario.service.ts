import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private url = '/api/horario'; // ajusta la ruta real

  constructor(private http: HttpClient) {}

  /*obtenerHorario(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.url);
  }*/

  obtenerHorario(params) {
    return this.http.get(`${environment.backendApi}/hor/horarios`, {
      params,
    });
  }
}
