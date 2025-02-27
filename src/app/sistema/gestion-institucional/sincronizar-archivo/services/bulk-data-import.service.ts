import { HttpClient } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class BulkDataImportService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
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

    validateCollectionData(data: any): Observable<any> {
        return this.http.post('http://localhost:8000/api/file/validate', {
            iYAcadId: JSON.parse(
                localStorage.getItem('dremoiYAcadId') || 'null'
            ),
            json: JSON.stringify(data),
            iSedeId: JSON.parse(localStorage.getItem('dremoPerfil') || '{}')
                .iSedeId,
        })
    }
}
