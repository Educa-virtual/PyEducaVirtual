import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-encuesta',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './encuesta.component.html',
    styleUrl: './encuesta.component.scss',
})
export class EncuestaComponent implements OnInit {
    @Output() es_visible = new EventEmitter<any>()
    active: number = 0
    formEncuesta: FormGroup
    categorias: Array<object>
    estados: Array<object>
    ultima_fecha_anio: Date = new Date(new Date().getFullYear(), 11, 31)
    fecha_actual: Date = new Date()
    es_especialista: boolean = false

    tipo_sectores: Array<object>
    zonas: Array<object>
    ugeles: Array<object>
    distritos: Array<object>
    ies: Array<object>
    nivel_grados: Array<object>
    secciones: Array<object>
    sexos: Array<object>

    private _messageService = inject(MessageService)

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.formEncuesta = this.fb.group({
            cEncuestaTitulo: ['', Validators.required],
            cEncuestaSubtitulo: ['', Validators.required],
            cEncuestaDescripcion: ['', Validators.required],
            iCategoriaEncuestaId: [null, Validators.required],
            iEstado: [null, Validators.required],
            dFechaInicio: ['', Validators.required],
            dFechaFin: [''],
            iTipoSectorId: [null],
            iZonaId: [null],
            iUgelId: [null],
            iDsttId: [null],
            iIieeId: [null],
            iNivelGradoId: [null],
            iSeccionId: [null],
            cPersSexo: [null],
        })

        this.categorias = [
            { label: 'Socioeconómica', value: 1 },
            { label: 'Psicosocial', value: 2 },
            { label: 'Vocacional', value: 3 },
            { label: 'Vida estudiantil', value: 4 },
        ]

        this.estados = [
            { label: 'En edición', value: 1 },
            { label: 'Aprobado', value: 2 },
            { label: 'Finalizado', value: 3 },
        ]
    }

    guardarEncuesta() {
        // realizar guardado
    }
}
