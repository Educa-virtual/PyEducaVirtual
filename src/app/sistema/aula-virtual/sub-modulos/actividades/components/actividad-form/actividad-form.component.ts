import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DisponibilidadFormComponent } from '../disponibilidad-form/disponibilidad-form.component'
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogConfig,
    DynamicDialogModule,
    DynamicDialogRef,
} from 'primeng/dynamicdialog'
import { EditorModule } from 'primeng/editor'
import { ButtonModule } from 'primeng/button'

@Component({
    providers: [DialogService],
    selector: 'app-actividad-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CommonInputComponent,
        DisponibilidadFormComponent,
        EditorModule,
        ButtonModule,
        DynamicDialogModule,
    ],
    templateUrl: './actividad-form.component.html',
    styleUrl: './actividad-form.component.scss',
})
export class ActividadFormComponent {
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)
    private _dialogService = inject(DialogService)
    private _config = inject(DynamicDialogConfig)

    public tipoActividad = 0
    public actividadForm: FormGroup
    instance: DynamicDialogComponent | undefined

    constructor() {
        this.actividadForm = this._formBuilder.group({
            titulo: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
        })
        this.addFields()
    }

    private addFields() {
        this.actividadForm.addControl(
            'indicaciones',
            this._formBuilder.control('', Validators.required)
        )
    }

    closeModal(data) {
        this.ref.close(data)
    }
}
