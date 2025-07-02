import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class CategoriasService {
    constructor(private http: HttpClient) {}

    obtenerCategorias() {
        return this.http.get(`${environment.backendApi}/enc/categorias`)
    }

    /*crearCategoria(categoria: IEncuestaCategoria) {
        return this.http.post<IEncuestaCategoria>(this.apiUrl, categoria)
    }

    actualizarCategoria(categoria: IEncuestaCategoria) {
        return this.http.put<IEncuestaCategoria>(`${this.apiUrl}/${categoria.iCategoriaEncuestaId}`, categoria)
    }

    eliminarCategoria(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }*/
}
