/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceRecord {
  fecha: string; // "YYYY-MM-DD"
  asistio: 'A' | 'N' | 'T' | string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  // Cambia baseUrl por la URL real de tu backend
  private baseUrl = '/api/attendance';

  constructor(private http: HttpClient) {}

  // month: 1..12
  getAttendanceForMonth(
    studentId: number,
    month: number,
    year: number
  ): Observable<AttendanceRecord[]> {
    // Ejemplo de endpoint: GET /api/attendance/123?month=9&year=2025
    const url = `${this.baseUrl}/${studentId}?month=${month}&year=${year}`;
    return this.http.get<AttendanceRecord[]>(url);
  }
}*/
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private urlBackendApi = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerAsistenciaGeneralEstudiante(anio, mes) {
    return this.http.get(`${this.urlBackendApi}/asi/asistencia/general/estudiante/${anio}/${mes}`);
  }
}
