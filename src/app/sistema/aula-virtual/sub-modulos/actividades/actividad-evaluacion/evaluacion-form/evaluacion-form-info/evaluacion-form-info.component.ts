import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    inject,
} from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { FileUploadPrimengComponent } from '@/app/shared/file-upload-primeng/file-upload-primeng.component'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { Subject, takeUntil } from 'rxjs'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-evaluacion-form-info',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PrimengModule,
        ModalPrimengComponent,
        FileUploadPrimengComponent,
        TypesFilesUploadPrimengComponent,
    ],
    templateUrl: './evaluacion-form-info.component.html',
    styleUrl: './evaluacion-form-info.component.scss',
})
export class EvaluacionFormInfoComponent implements OnInit {
    private _evaluacionApiService = inject(ApiEvaluacionesService)
    private _constantesService = inject(ConstantesService)
    private _unsubscribe$ = new Subject<boolean>()

    @Input() public evaluacionInfoForm: FormGroup
    @Output() filesChange = new EventEmitter()

    @Input() public tipoEvaluaciones = []
    @Input() files = []

    public currentTime = dayjs().toDate()

    get invalidForm() {
        return true
    }

    titleFileEvaluacion = ''
    showModal = false
    typeUpload: string
    nameEnlace: string
    filesUrl = []
    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }

    ngOnInit() {
        this.obtenerRubricas()
        if (this.evaluacionInfoForm) {
            this.evaluacionInfoForm.controls['dFechaEvaluacionInico'].setValue(
                this.date
            )
            this.evaluacionInfoForm.controls['dFechaEvaluacionFin'].setValue(
                this.date
            )
        }
    }
    // ngOnChanges(changes) {
    //     if (changes.evaluacionInfoForm?.currentValue) {
    //         this.evaluacionInfoForm = changes.evaluacionInfoForm.currentValue
    //     }
    // }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        // let params
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
            case 'subir-file-evaluacion':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                this.filesChange.emit(this.filesUrl)
                break
            case 'url-evaluacion':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                this.filesChange.emit(this.filesUrl)
                break
            case 'youtube-evaluacion':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                this.filesChange.emit(this.filesUrl)
                break
        }
    }

    date = new Date()
    rubricas = [
        {
            iInstrumentoId: 0,
            cInstrumentoNombre: 'Sin instrumento de evaluación',
        },
    ]

    obtenerRubricas() {
        const params = {
            iDocenteId: this._constantesService.iDocenteId,
        }
        this._evaluacionApiService
            .obtenerRubricas(params)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    data.forEach((element) => {
                        this.rubricas.push(element)
                    })
                },
            })
    }
}
