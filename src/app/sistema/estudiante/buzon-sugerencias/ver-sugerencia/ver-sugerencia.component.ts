import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { BuzonSugerenciasService } from '../services/buzon-sugerencias.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-ver-sugerencia',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ver-sugerencia.component.html',
    styleUrl: './ver-sugerencia.component.scss',
})
export class VerSugerenciaComponent implements OnInit {
    form: FormGroup
    private _selectedItem: any
    archivos: any[] = []
    @Output() cerrarDialogVerSugerenciaEvent = new EventEmitter<boolean>()
    nombreDirector: string = 'Director: '
    fechaRespuesta: string = 'Fecha de respuesta'

    @Input()
    set selectedItem(value: any) {
        this._selectedItem = value
        if (this.form) {
            this.form.patchValue({
                cNombreEstudiante: this._selectedItem?.cNombreEstudiante,
                dtFechaCreacion: this._selectedItem?.dtFechaCreacion,
                cAsunto: this._selectedItem?.cAsunto,
                cPrioridadNombre: this._selectedItem?.cPrioridadNombre,
                cSugerencia: this._selectedItem?.cSugerencia,
            })
            this.obtenerArchivosSugerencia()
        }
    }
    get selectedItem(): any {
        return this._selectedItem
    }
    constructor(
        private fb: FormBuilder,
        private buzonSugerenciasService: BuzonSugerenciasService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            cNombreEstudiante: [null],
            dtFechaCreacion: [null],
            cAsunto: [null],
            cPrioridadNombre: [null],
            cSugerencia: [null],
        })
    }

    obtenerArchivosSugerencia() {
        this.buzonSugerenciasService
            .obtenerListaArchivosSugerencia(this.selectedItem?.iSugerenciaId)
            .subscribe((response: any) => {
                this.archivos = response.data
            })
    }

    descargarArchivo(event: Event, archivo: string) {
        event.preventDefault()
        this.buzonSugerenciasService
            .descargarArchivoSugerencia(
                this.selectedItem?.iSugerenciaId,
                archivo
            )
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = archivo
                    a.click()
                    window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al descargar el archivo',
                        detail: error.message,
                    })
                },
            })
    }

    cerrarDialog() {
        this.selectedItem = null
        this.archivos = []
        this.form.reset()
        this.cerrarDialogVerSugerenciaEvent.emit(false)
    }
}
