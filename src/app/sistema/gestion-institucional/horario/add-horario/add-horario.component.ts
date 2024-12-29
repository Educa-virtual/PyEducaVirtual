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
    selector: 'app-add-horario',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './add-horario.component.html',
    styleUrl: './add-horario.component.scss',
})
export class AddHorarioComponent implements OnChanges, OnInit {
    @Output() addHorario = new EventEmitter()
    @Input() registro
    @Input() visible
    @Input() titulo
    @Input() docentes

    @Input() option

    form: FormGroup

    //visible: boolean = false

    open_modal: boolean = false

    dias: any[] = [
        { iDiaId: 1, cDiaNombre: 'LUNES' },
        { iDiaId: 2, cDiaNombre: 'MARTES' },
        { iDiaId: 3, cDiaNombre: 'MIERCOLES' },
        { iDiaId: 4, cDiaNombre: 'JUEVES' },
        { iDiaId: 5, cDiaNombre: 'VIERNES' },
        { iDiaId: 6, cDiaNombre: 'SABADO' },
        { iDiaId: 7, cDiaNombre: 'DOMINGO' },
    ]

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        console.log(this.registro, ' registro en com if onit')
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
            console.log(this.registro, ' registro en com if visible')
            this.mostrarModal()
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.visible) {
            console.log(this.registro, ' registro en com if visible')
            this.mostrarModal()
        }

        if (changes['visible'] && changes['visible'].currentValue) {
            console.log(this.visible, ' registro en com if')
            if (this.visible) {
                console.log(this.registro, ' registro en com if visible')
                this.mostrarModal()
            }
        }
    }
    mostrarModal() {
        this.open_modal = true

        if (this.registro.iDocenteId > 0) {
            console.log(this.registro, 'this.registro add')
            this.form.get('iDocenteId').setValue(this.registro.iDocenteId)
            this.form.get('idDocCursoId').setValue(this.registro.idDocCursoId)
            this.form.get('iDocenteId')?.disable()
        } else {
            this.form.get('iDocenteId')?.enable()
        }
    }
    accionBtnItem(event: any) {
        switch (event) {
            case 'guardar':
                const registro = this.form.value
                this.addHorario.emit(registro)
                break
        }
    }
}
