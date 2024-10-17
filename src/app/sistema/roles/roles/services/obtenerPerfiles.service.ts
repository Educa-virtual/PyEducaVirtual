import { Injectable, inject } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class ObtenerPerfilesService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    obtenerPerfiles(params) {
        return this.http.get(`${this.baseUrl}/acad/Perfiles/obtenerPerfiles`, {
            params,
        })
        /*.subscribe(
        data =>{ 
          console.log('datos recibidos:', data);
        },
          
          error => {
            console.error('Error al obtener perfiles:', error);

          }
          
      );*/
    }
}
