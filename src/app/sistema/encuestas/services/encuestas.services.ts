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

    eliminarEncuesta(iConfEncId: string) {
        return this.http.delete(
            `${environment.backendApi}/enc/encuestas/${iConfEncId}`
        )
    }

    actualizarAccesosEncuesta(iCategoriaEncuestaId: string, form: any) {
        return this.http.patch(
            `${environment.backendApi}/enc/encuestas/${iCategoriaEncuestaId}/accesos`,
            {
                iEspDremoTipoAccesoId: form.get('iEspDremoTipoAccesoId')?.value,
                iEspUgelTipoAccesoId: form.get('iEspUgelTipoAccesoId')?.value,
                iDirectorTipoAccesoId: form.get('iDirectorTipoAccesoId')?.value,
            }
        )
    }
}
