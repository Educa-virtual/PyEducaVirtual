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
    @Input() area
    @Input() visible_horario
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
        console.log(this.area, ' registro en com if onit')
        this.form = this.fb.group({
            iDiaId: ['', Validators.required],
            iDocenteId: [{ value: '', disabled: true }, Validators.required],
            inicio: ['', Validators.required],
            fin: ['', Validators.required],
            idDocCursoId: [0, Validators.required],

            cCursoNombre: [''],
        })

        if (this.visible_horario) {
            this.open_modal = false
            console.log(this.area, ' registro en com if visible_horario')
            this.mostrarModal()
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.visible_horario) {
            console.log(this.area, ' registro en com if visible_horario')
            this.mostrarModal()
        }

        if (
            changes['visible_horario'] &&
            changes['visible_horario'].currentValue
        ) {
            console.log(this.visible_horario, ' registro en com if')
            if (this.visible_horario) {
                console.log(this.area, ' area en com if visible')
                this.mostrarModal()
            }
        }
    }
    mostrarModal() {
        this.open_modal = true

        if (this.area.iDocenteId > 0) {
            console.log(this.area, 'this.area add')
            this.form.get('iDocenteId').setValue(this.area.iDocenteId)
            this.form.get('idDocCursoId').setValue(this.area.idDocCursoId)
            this.form.get('iDocenteId')?.disable()
        } else {
            this.form.get('iDocenteId')?.enable()
        }
    }
    accionBtnItem(event: any) {
        switch (event) {
            case 'guardar':
                const area = this.form.value
                this.addHorario.emit(area)
                break
        }
    }
}
