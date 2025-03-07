import { HttpClient } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Observable } from 'rxjs'
import { DatosMatriculaService } from '../../services/datos-matricula.service'

@Injectable({
    providedIn: 'root',
})
export class BulkDataImportService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private datosMatriculaService: DatosMatriculaService,
        private ngZone: NgZone
    ) {}

    uploadFile(file: File): void {
        console.log('uploading file', file)
    }
    importData(data: any[]): void {
        console.log('importing data', data)
    }

    loadCollectionTemplate() {}

    downloadCollectionTemplate(filename: { [key: string]: string }): void {
        console.log('filename')
        console.log(filename)

        if (!filename['name']) {
            return
        }

        try {
            this.http
                .get('http://localhost:8000/api/file/import', {
                    params: {
                        fileName: filename['name'],
                    },
                    responseType: 'blob',
                })
                .subscribe((blob: Blob) => {
                    console.log(blob)
                    console.log(blob.type)
                    const url = window.URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = filename['name']
                    a.target = '_self'
                    a.click()

                    window.URL.revokeObjectURL(url)
                })
        } catch (error) {
            console.log(error)
        }
    }
    saveCollectionTemplate(template: any): void {
        console.log('saving collection template', template)
    }

    validateCollectionData(data: any, api: string): Observable<any> {
        return this.http.post(`http://localhost:8000/api/file/${api}`, {
            iYAcadId: JSON.parse(
                localStorage.getItem('dremoiYAcadId') || 'null'
            ),
            json: JSON.stringify(data),
            iSedeId: JSON.parse(localStorage.getItem('dremoPerfil') || '{}')
                .iSedeId,
        })
    }

    importDataCollection(file, data: any): Observable<any> {
        console.log(data)

        const formData: FormData = new FormData()
        formData.append('archivo', file)

        console.log('file')
        console.log(file)

        formData.append('tipo', 'matriculas')
        formData.append(
            'iSedeId',
            JSON.parse(localStorage.getItem('dremoPerfil') || '{}').iSedeId
        )
        formData.append(
            'iYAcadId',
            JSON.parse(localStorage.getItem('dremoiYAcadId') || 'null')
        )
        formData.append(
            'iCredId',
            JSON.parse(localStorage.getItem('dremoPerfil') || '{}').iCredId
        )
        // formData.append('iSemAcadId', undefined)
        // formData.append('json', Array.isArray(data) ? data.map(row => {
        //     return {
        //         grado: row.GRADO,
        //         seccion: row.SECCIÓN,
        //         cod_tipo_documento: row["TIPO DE DOCUMENTO"],
        //         documento: row["NÚMERO DE DOCUMENTO"],
        //         codigo_estudiante: row["CÓDIGO DEL ESTUDIANTE"],
        //         paterno: row["APELLIDO PATERNO"],
        //         materno: row["APELLIDO MATERNO"],
        //         nombres: row.NOMBRES,
        //         sexo: row.SEXO,
        //         nacimiento: row["FECHA DE NACIMIENTO"],
        //         estado_matricula: row["ESTADO DE MATRICULA"],
        //     }
        // }) : data)

        // this.datosMatriculaService.subirArchivoMatriculas(formData).subscribe({
        //     next: (data: any) => {
        //         console.log(data, 'subir archivo')
        //     },
        //     error: (error) => {
        //         console.error('Error subiendo archivo:', error)
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: error,
        //         })
        //     },
        //     complete: () => {
        //         console.log('Request completed')
        //     },
        // })

        return this.http.post(
            `http://localhost:8000/api/acad/estudiante/importarEstudiantesMatriculasExcel`,
            formData
        )

        // return this.http.post(
        //     `http://localhost:8000/api/acad/estudiante/importarEstudiantesMatriculasExcel`,
        //     {
        //         iSedeId: JSON.parse(localStorage.getItem('dremoPerfil') || '{}')
        //             .iSedeId,
        //         iYAcadId: JSON.parse(
        //             localStorage.getItem('dremoiYAcadId') || 'null'
        //         ),
        //         iCredId: JSON.parse(localStorage.getItem('dremoPerfil') || '{}')
        //         .iCredId,
        //         iSemAcadId: null,
        //         json: Array.isArray(data) && data.map(row => {

        //             return {
        //                 grado: row.GRADO,
        //                 seccion: row.SECCIÓN,
        //                 cod_tipo_documento: row["TIPO DE DOCUMENTO"],
        //                 documento: row["NÚMERO DE DOCUMENTO"],
        //                 codigo_estudiante: row["CÓDIGO DEL ESTUDIANTE"],
        //                 paterno: row["APELLIDO PATERNO"],
        //                 materno: row["APELLIDO MATERNO"],
        //                 nombres: row.NOMBRES,
        //                 sexo: row.SEXO,
        //                 nacimiento: row["FECHA DE NACIMIENTO"],
        //                 estado_matricula: row["ESTADO DE MATRICULA"],
        //             }
        //         }),
        //     }
        // )
    }

    filteredData() {}
}
