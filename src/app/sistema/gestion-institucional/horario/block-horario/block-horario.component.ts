import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-block-horario',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './block-horario.component.html',
    styleUrl: './block-horario.component.scss',
})
export class BlockHorarioComponent implements OnChanges, OnInit {
    @Output() addBlockHorario = new EventEmitter()
    @Input() bloque
    @Input() visible
    @Input() option

    form: FormGroup

    bloques: any = []
    open_modal: boolean = false
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        console.log(this.bloque, ' registro en com if onit')
        this.form = this.fb.group({
            iDiaId: ['', Validators.required],
            iDocenteId: [{ value: '', disabled: true }, Validators.required],
            inicio: ['', Validators.required],
            fin: ['', Validators.required],
            idDocCursoId: [0, Validators.required],

            cCursoNombre: [''],
        })

        if (this.visible) {
            this.open_modal = false
            console.log(this.bloque, ' registro en com if visible')
            this.mostrarModal()
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.visible) {
            console.log(this.bloque, ' registro en com if visible')
            this.mostrarModal()
        }

        if (changes['visible'] && changes['visible'].currentValue) {
            console.log(this.visible, ' registro en com if')
            if (this.visible) {
                console.log(this.bloque, ' registro en com if visible')
                this.mostrarModal()
            }
        }
    }
    mostrarModal() {
        this.open_modal = true

        if (this.bloque.iDocenteId > 0) {
            console.log(this.bloque, 'this.registro add')
            this.form.get('iDocenteId').setValue(this.bloque.iDocenteId)
            this.form.get('idDocCursoId').setValue(this.bloque.idDocCursoId)
            this.form.get('iDocenteId')?.disable()
        } else {
            this.form.get('iDocenteId')?.enable()
        }
    }
    accionBtnItem(event: any) {
        switch (event) {
            case 'guardar':
                const registro = this.form.value
                this.addBlockHorario.emit(registro)
                break
        }
    }
}
