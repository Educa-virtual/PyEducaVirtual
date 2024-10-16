import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
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
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'

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
export class ForoFormContainerComponent implements OnInit {
    // _aulaService obtener datos
    private _aulaService = inject(ApiAulaService)
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)
    perfiles: any[] = []

    public categorias = []

    public foroForm: FormGroup = this._formBuilder.group({
        titulo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        categoria: [0, [Validators.required]],
    })
    ngOnInit(): void {
        const userId = 1
        this._aulaService.guardarForo(userId).subscribe((Data) => {
            this.perfiles = Data['data']
        })

        console.log('Datos mit', this.perfiles)
    }

    closeModal(data) {
        this.ref.close(data)
    }

    submitFormulario(data) {
        console.log('Prueba Mit', data)
        this._aulaService.guardarForo(data)
        console.log(this._aulaService)
    }
}
