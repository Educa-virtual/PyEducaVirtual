import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BuzonSugerenciasService } from '../services/buzon-sugerencias.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-registrar-sugerencia',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './registrar-sugerencia.component.html',
    styleUrl: './registrar-sugerencia.component.scss',
})
export class RegistrarSugerenciaComponent implements OnInit {
    @Output() eventEsVisible = new EventEmitter<any>()
    form: FormGroup
    disable_form: boolean = false
    uploadedFiles: any[] = []
    sugerencia_registrada: boolean = false

    destinos: Array<object>
    prioridades: Array<object>

    private buzonSugerenciasService = inject(BuzonSugerenciasService)
    private _MessageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private sugerenciaService: BuzonSugerenciasService
    ) {}

    ngOnInit(): void {
        /*this.destinos = [
            { id: 1, nombre: 'EQUIPO TECNICO' },
            { id: 2, nombre: 'DIRECCION' },
            { id: 3, nombre: 'PROFESORES' },
            { id: 4, nombre: 'ESPECIALISTAS' },
        ]*/

        this.prioridades = [
            { id: 1, nombre: 'Baja' },
            { id: 2, nombre: 'Media' },
            { id: 3, nombre: 'Alta' },
        ]

        this.form = this.fb.group({
            //iDestinoId: [null, Validators.required],
            iPrioridadId: [2, Validators.required],
            cAsunto: [null, Validators.required],
            cSugerencia: [null, Validators.required],
        })
    }

    guardarSugerencia() {
        this.buzonSugerenciasService
            .registrarSugerencia(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.eventEsVisible.emit(false)
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: data.message,
                    })
                },
                error: (error) => {
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Problema al registrar sugerencia',
                        detail: error,
                    })
                },
            })
    }

    actualizarSugerencia() {
        this.disable_form = true
    }
}
