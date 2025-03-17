import { HttpClient } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Observable } from 'rxjs'
import { DatosMatriculaService } from '../../services/datos-matricula.service'
import { objectToFormData } from '@/app/shared/utils/object-to-form-data'

@Injectable({
    providedIn: 'root',
})
export class BulkDataImportService {
    importEndPoint: string
    params: any = {}

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

    downloadCollectionTemplate(file: { [key: string]: string }): void {
        console.log('filename')
        console.log(file)

        if (!file['name']) {
            return
        }

        try {
            this.http
                .get('http://localhost:8000/api/file/import', {
                    params: {
                        template: file['name'],
                    },
                    responseType: 'blob',
                })
                .subscribe((blob: Blob) => {
                    console.log(blob)
                    console.log(blob.type)
                    const url = window.URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = file['name']
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
        if (file) {
            const formData = objectToFormData({ file, ...this.params })
            return this.http.post(
                `http://localhost:8000/api/${this.importEndPoint}`,
                formData
            )
        } else {
            return this.http.post(
                `http://localhost:8000/api/${this.importEndPoint}`,
                {
                    json: JSON.stringify(data),
                    ...this.params,
                }
            )
        }
    }
}
