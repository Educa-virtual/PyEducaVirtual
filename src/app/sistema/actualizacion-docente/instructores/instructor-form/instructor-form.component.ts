import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-instructor-form',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './instructor-form.component.html',
    styleUrl: './instructor-form.component.scss',
})
export class InstructorFormComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() instructor: any = {}
    @Input() tiposIdentificaciones: any[] = []
    @Input() showModal: boolean = false

    dropdownStyle: boolean = false

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['instructor']) {
            this.instructorForm.patchValue(changes['instructor'].currentValue)
        }
        if (changes['tiposIdentificaciones']) {
            const tiposIdentificaciones =
                changes['tiposIdentificaciones'].currentValue
            if (tiposIdentificaciones && tiposIdentificaciones.length > 0) {
                console.log(tiposIdentificaciones)
                this.instructorForm.controls['iTipoIdentId'].setValue(
                    tiposIdentificaciones[0].iTipoIdentId
                )
            }
        }
        if (changes['showModal']) {
            this.instructorForm.patchValue(changes['showModal'].currentValue)
        }
    }
    instructorForm: FormGroup = new FormGroup({
        iTipoIdentId: new FormControl(null, Validators.required),
        iInstructorId: new FormControl(null),
    })

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }
}
