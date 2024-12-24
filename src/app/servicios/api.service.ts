import { Injectable } from '@angular/core'
import { httpService } from './httpService'
//import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class GenericApiService {
    constructor(private http: httpService) {}

    async getTableGeneric(campos) {
        this.http.getData('/api/getTableGeneric', campos)
    }
    async insertTableGeneric(campos) {
        this.http.postData('/api/insertTableGeneric', campos)
    }
    async updateTableGeneric(campos) {
        this.http.putData('/api/updateTableGeneric', campos)
    }

    // Para el constructor
    // private apiService: GenericApiService
    //
    // Si se inyecta como propiedad
    // private apiService: inject(GenericApiService)
    //
    // this.apiService.updateTableGeneric({
    //     esquema: 'acad',
    //     tabla: 'year_academicos',
    //     data: [
    //         {
    //         campos:{
    //             iYearId: 1,
    //             cYearNombre: '2023',
    //             cYearOficial: '2023',
    //             iYearEstado: 1,
    //             dtYearInicio: '2023-01-01',
    //             dYearFin: '2023-12-31',
    //             iYearTipo: 1,
    //             cYearDescripcion: '2023',
    //             bYearEstado: 1,
    //     }
    //         where: {
    //             COLUMN_NAME: 'iYearId',
    //             VALUE: 1,
    //     }
    //     },
    //         {
    //         campos:{
    //             iYearId: 1,
    //             cYearNombre: '2023',
    //             cYearOficial: '2023',
    //             iYearEstado: 1,
    //             dtYearInicio: '2023-01-01',
    //             dYearFin: '2023-12-31',
    //             iYearTipo: 1,
    //             cYearDescripcion: '2023',
    //             bYearEstado: 1,
    //     }
    //         where: {
    //             COLUMN_NAME: 'iYearId',
    //             VALUE: 1,
    //     }
    //     },
    //         {
    //         campos:{
    //             iYearId: 1,
    //             cYearNombre: '2023',
    //             cYearOficial: '2023',
    //             iYearEstado: 1,
    //             dtYearInicio: '2023-01-01',
    //             dYearFin: '2023-12-31',
    //             iYearTipo: 1,
    //             cYearDescripcion: '2023',
    //             bYearEstado: 1,
    //     }
    //         where: {
    //             COLUMN_NAME: 'iYearId',
    //             VALUE: 1,
    //     }
    //     },
    // ],
    // })

    // getTipoAmbiente() {
    //     this.query

    //         .searchCalAcademico({
    //             esquema: 'ere',
    //             tabla: 'preguntas',
    //             campos: 'iPreguntaId,iDesempenoId,iTipoPregId,cPregunta,cPreguntaTextoAyuda,iPreguntaNivel,iPreguntaPeso,bPreguntaEstado,cPreguntaClave,iEstado,iSesionId,iEspecialistaId,iNivelGradoId,iEncabPregId,iCursosNivelGradId',
    //             condicion: '1=1',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 // Truncar los campos cPregunta y cPreguntaTextoAyuda
    //                 this.preguntastocursos = data.data.map((pregunta: any) => ({
    //                     ...pregunta,
    //                     cPregunta:
    //                         pregunta.cPregunta.length > 100
    //                             ? pregunta.cPregunta.slice(0, 100) + '...'
    //                             : pregunta.cPregunta,
    //                 }))
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching Años Académicos:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }
}
