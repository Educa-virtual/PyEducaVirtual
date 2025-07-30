import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { secciones } from './types/enlaces-ayuda';
// import * as perfilesConstantes from '@/app/servicios/perfilesConstantes'

@Injectable({
  providedIn: 'root',
})
export class EnlacesAyuda {
  // Path to the JSON file
  filePath: string = 'http://127.0.0.1:8000/api/enlaces-ayuda';

  // Data extract from the JSON file
  secciones: secciones[];

  constructor(private http: HttpClient) {}

  getEnlacesAyuda() {
    return this.http.get(this.filePath);
  }
}
