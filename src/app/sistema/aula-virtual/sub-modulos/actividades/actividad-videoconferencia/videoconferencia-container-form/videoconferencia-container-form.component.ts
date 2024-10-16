import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { EditorModule } from 'primeng/editor'

@Component({
    selector: 'app-videoconferencia-container-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CommonInputComponent,
        DisponibilidadFormComponent,
        DialogModule,
        ButtonModule,
        EditorModule,
    ],
    templateUrl: './videoconferencia-container-form.component.html',
    styleUrl: './videoconferencia-container-form.component.scss',
})
export class VideoconferenciaContainerFormComponent {
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)

    public videoconferenciaForm: FormGroup = this._formBuilder.group({
        titulo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
    })

    closeModal(data) {
        this.ref.close(data)
    }
}
