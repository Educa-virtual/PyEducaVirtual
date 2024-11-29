import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from '@/environments/environment'
import { HttpClient, HttpEventType } from '@angular/common/http'
@Component({
    selector: 'app-image-upload-primeng',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './image-upload-primeng.component.html',
    styleUrl: './image-upload-primeng.component.scss',
})
export class ImageUploadPrimengComponent {
    @Output() actionImageUpload = new EventEmitter()
    @Input() label: string = 'user.png'
    @Input() urlFoto: string

    backend = environment.backend

    public iProgress

    private backendApi = environment.backendApi
    constructor(private http: HttpClient) {}

    async onUploadChange(evt: any) {
        this.iProgress = 1

        const file = evt.target.files[0]

        if (file) {
            const dataFile = await this.objectToFormData({
                file: file,
                nameFile: 'users',
            })
            this.http
                .post(
                    `${this.backendApi}/general/subir-archivo?` +
                        'skipSuccessMessage=true',
                    dataFile,
                    {
                        reportProgress: true,
                        observe: 'events',
                    }
                )
                .pipe(
                    map((event: any) => {
                        if (event.body) {
                            const imagen = event.body
                            const data = {
                                accion: 'subir-archivo-users',
                                item: {
                                    imagen: imagen,
                                },
                            }
                            this.actionImageUpload.emit(data)
                        }
                        if (event.type == HttpEventType.UploadProgress) {
                            this.iProgress = Math.round(
                                (100 / event.total) * event.loaded
                            )
                        } else if (event.type == HttpEventType.Response) {
                            this.iProgress = null
                        }
                    }),
                    catchError((err: any) => {
                        this.iProgress = null
                        console.log(err.message)
                        return throwError(err.message)
                    })
                )
                .toPromise()
        }
    }

    objectToFormData(obj: any) {
        const formData = new FormData()
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== '') {
                formData.append(key, obj[key])
            }
        })

        return formData
    }

    updateUrl() {
        this.urlFoto = 'users/no-image.png'
    }
}
