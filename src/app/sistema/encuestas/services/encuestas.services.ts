import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class EncuestasService {
    constructor(private http: HttpClient) {}
    obtenerEncuestasPorCategoria(iCategoriaEncuestaId: string) {
        return this.http.get(
            `${environment.backendApi}/enc/categorias/${iCategoriaEncuestaId}/encuestas`
        )
    }
}
