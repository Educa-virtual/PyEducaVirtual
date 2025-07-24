import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { StringCasePipe } from '@/app/shared/pipes/string-case.pipe'
import { MessageService } from 'primeng/api'
import { AreasService } from '../../services/areas.service'

@Component({
    selector: 'app-activar-descarga',
    standalone: true,
    imports: [PrimengModule],
    providers: [StringCasePipe],
    templateUrl: './activar-descarga.component.html',
    styleUrl: './activar-descarga.component.scss',
})
export class ActivarDescargaComponent implements OnInit {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() mostrarActivarDescargas = new EventEmitter<any>()
    @Output() actualizarEstadoDescargaEvent = new EventEmitter<{
        curso: ICurso
    }>()
    curso: ICurso
    titulo: string = ''

    checked: boolean = false
    form: FormGroup
    constructor(
        private stringCasePipe: StringCasePipe,
        private fb: FormBuilder,
        private messageService: MessageService,
        private areasService: AreasService
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            bDescarga: [true],
        })
        console.log('OKI')
    }

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }

    mostrarDialog(datos: { curso: ICurso }) {
        this.curso = datos.curso
        console.log(this.curso)
        //this.form.get('bDescarga')?.patchValue(this.curso.bDescarga === '1' ? true : false)
        this.form
            .get('bDescarga')
            ?.setValue(this.curso.bDescarga == '0' ? false : true)
        this.titulo = `Activar descargas para ${this.stringCasePipe.transform(this.curso.cCursoNombre)} - ${this.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
            - ${this.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`
        this.visible = true
    }

    actualizarEstado() {
        this.curso.bDescarga = this.form.get('bDescarga')?.value ? '1' : '0'
        this.areasService
            .actualizarEstadoDescarga(
                this.curso.iEvaluacionIdHashed,
                this.curso.iCursosNivelGradId,
                this.curso.bDescarga == '1'
            )
            .subscribe({
                next: (resp) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: resp.message,
                    })
                    this.actualizarEstadoDescargaEvent.emit({
                        curso: this.curso,
                    })
                    this.onHide()
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            err.error.message ||
                            'Error al actualizar el estado de las descargas.',
                    })
                },
            })
    }
}
