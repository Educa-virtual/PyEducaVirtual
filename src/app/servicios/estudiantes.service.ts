/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  private apiUrl = 'http://127.0.0.1:8000/api/estudiantes'; //Url de laravel

  constructor(private http: HttpClient) {}

  getEstudiantes(iIieeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${iIieeId}`);
  }
}*/

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class EstudiantesService {
    //Revisar la URL en el Backend para descarte
    private apiUrl = 'http://localhost:8000/api/estudiantes' // URL de Laravel

    constructor(private http: HttpClient) {}

    //Método existente para obtener estudiantes por institución educativa
    getEstudiantes(iIieeId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${iIieeId}`)
    }

    //  return this.http.get<any[]>(`${this.apiUrl}/${iIieeId}/${anio}`)

    getEstudiantesPorAnio(
        iPerApodr: number,
        iIieeId: number,
        anio: number
    ): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.apiUrl}/${iPerApodr}/${iIieeId}/${anio}`
        )
    }
}
