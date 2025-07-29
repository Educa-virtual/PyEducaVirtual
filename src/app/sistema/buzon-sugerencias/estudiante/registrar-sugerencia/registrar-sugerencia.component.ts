import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BuzonSugerenciasEstudianteService } from '../services/buzon-sugerencias-estudiante.service'
import { MessageService } from 'primeng/api'
import { FileUpload } from 'primeng/fileupload'

@Component({
    selector: 'app-registrar-sugerencia',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './registrar-sugerencia.component.html',
    styleUrl: './registrar-sugerencia.component.scss',
})
export class RegistrarSugerenciaComponent implements OnInit {
    //@Output() eventEsVisible = new EventEmitter<any>()
    @Output() eventSugerenciaRegistrada = new EventEmitter<boolean>()
    form: FormGroup
    disable_form: boolean = false
    uploadedFiles: any[] = []
    @ViewChild('uploader') uploader: FileUpload
    prioridades: any[]

    constructor(
        private fb: FormBuilder,
        private BuzonSugerenciasEstudianteService: BuzonSugerenciasEstudianteService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.obtenerPrioridades()
        this.inicializarForm()
    }

    inicializarForm() {
        const iPrioridadId = this.prioridades
            ? this.prioridades[1].iPrioridadId
            : null
        this.form = this.fb.group({
            iPrioridadId: [iPrioridadId, Validators.required],
            cAsunto: [null, Validators.required],
            cSugerencia: [null, Validators.required],
        })
    }

    reiniciarFormulario() {
        this.inicializarForm()
        this.reiniciarFileUpload()
    }

    reiniciarFileUpload() {
        this.uploader.clear()
        this.uploadedFiles = []
    }

    obtenerPrioridades() {
        this.BuzonSugerenciasEstudianteService.obtenerPrioridades().subscribe({
            next: (response: any) => {
                this.prioridades = response.data
                this.form.patchValue({
                    iPrioridadId: this.prioridades[1].iPrioridadId,
                })
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        error.error.message || 'Error al obtener prioridades',
                })
            },
        })
    }

    onFileSelect(event: { files: any[] }) {
        this.uploadedFiles = [...event.files]
    }

    guardarSugerencia() {
        const formData = new FormData()
        Object.keys(this.form.value).forEach((key) => {
            formData.append(key, this.form.value[key])
        })
        this.uploadedFiles.forEach((file, index) => {
            formData.append(`fArchivos[${index}]`, file)
        })
        this.BuzonSugerenciasEstudianteService.registrarSugerencia(
            formData
        ).subscribe({
            next: (data: any) => {
                this.eventSugerenciaRegistrada.emit(true)
                this.messageService.add({
                    severity: 'success',
                    summary: 'Mensaje',
                    detail: data.message,
                })
                this.inicializarForm()
                this.reiniciarFileUpload()
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema al registrar sugerencia',
                    detail:
                        error.error.message || 'Error al registrar sugerencia',
                })
            },
        })
    }

    /*actualizarSugerencia() {
        this.disable_form = true
    }*/
}
