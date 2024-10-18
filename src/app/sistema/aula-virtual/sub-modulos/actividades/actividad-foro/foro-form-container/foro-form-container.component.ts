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
import { CalendarModule } from 'primeng/calendar'
import { BaseDatePickerDirective } from '@/app/shared/directives/base-date-picker.directive'
import { SelectButtonModule } from 'primeng/selectbutton'
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
        CalendarModule,
        BaseDatePickerDirective,
        SelectButtonModule,
    ],
    templateUrl: './foro-form-container.component.html',
    styleUrl: './foro-form-container.component.scss',
})
export class ForoFormContainerComponent implements OnInit {
    // _aulaService obtener datos
    private _aulaService = inject(ApiAulaService)
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)

    categorias: any[] = []
    estado: any[] = []

    selectCategorias: any = {}

    public foroForm: FormGroup = this._formBuilder.group({
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        categoria: [0, [Validators.required]],
        dtForoInicio: [''],
        iEstado: [0, Validators.required],
        dtForoPublicacion: ['dtForoInicio'],
        dtForoFin: [],
    })
    ngOnInit(): void {
        this.mostrarCategorias()
    }

    mostrarCategorias() {
        const userId = 1
        this._aulaService.guardarForo(userId).subscribe((Data) => {
            this.categorias = Data['data']
            //console.log('Datos mit', this.categorias)
        })
    }

    closeModal(data) {
        this.ref.close(data)
    }
    submit() {
        const value = this.foroForm.value
        console.log('Guardar Foros', value)
    }
}
