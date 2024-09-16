import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { EditorModule } from 'primeng/editor'

@Component({
    selector: 'app-foro-form-container',
    standalone: true,
    imports: [
        CommonModule,
        CommonInputComponent,
        ReactiveFormsModule,
        DisponibilidadFormComponent,
        DropdownModule,
        ButtonModule,
        EditorModule,
    ],
    templateUrl: './foro-form-container.component.html',
    styleUrl: './foro-form-container.component.scss',
})
export class ForoFormContainerComponent {
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)

    public categorias = []

    public foroForm: FormGroup = this._formBuilder.group({
        titulo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        categoria: [0, [Validators.required]],
    })

    closeModal(data) {
        this.ref.close(data)
    }
}
