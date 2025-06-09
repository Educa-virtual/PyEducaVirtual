import { Component, inject, OnInit } from '@angular/core'
import { InputTextareaModule } from 'primeng/inputtextarea'
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { InputSwitchModule } from 'primeng/inputswitch'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { ButtonModule } from 'primeng/button'
import { EditorModule } from 'primeng/editor'
import { filtrarPreguntasUsadas } from '../pregunta-letra.model'
import { DropdownModule } from 'primeng/dropdown'
@Component({
    selector: 'app-alternativas-form',
    standalone: true,
    imports: [
        InputTextareaModule,
        FormsModule,
        InputSwitchModule,
        ReactiveFormsModule,
        CommonInputComponent,
        EditorModule,
        ButtonModule,
        DropdownModule,
    ],
    templateUrl: './alternativas-form.component.html',
    styleUrl: './alternativas-form.component.scss',
})
export class AlternativasFormComponent implements OnInit {
    // injeccion de depedencias
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    private _formBuilder = inject(FormBuilder)

    private alternativa
    private alternativas
    public letrasDisponiblesPreguntaSeleccionada
    public pregunta
    // inicializar el formulario

    // dependiendo al tipo de pregunta
    //  tipo abierta, multiple o unica
    public alternativaFormGroup: FormGroup

    ngOnInit() {
        this.pregunta = this._config.data.pregunta
        this.alternativa = this._config.data.alternativa
        this.alternativas = this._config.data.alternativas ?? []

        this.buildForm()
        const letrasUsadas = this.alternativas.map((x) => x.cAlternativaLetra)

        this.alternativaFormGroup
            .get('iPreguntaId')
            .setValue(this.pregunta.iPreguntaId)

        // editando alternativa
        if (this.alternativa != null) {
            this.letrasDisponiblesPreguntaSeleccionada = filtrarPreguntasUsadas(
                letrasUsadas,
                this.alternativa.cAlternativaLetra
            )

            this.alternativaFormGroup.patchValue(this.alternativa)
            this.alternativaFormGroup
                .get('bAlternativaCorrecta')
                .setValue(
                    this.alternativa.bAlternativaCorrecta == 1 ? true : false
                )
        } else {
            this.letrasDisponiblesPreguntaSeleccionada =
                filtrarPreguntasUsadas(letrasUsadas)
        }
    }

    // construye el formulario de alternativa
    buildForm() {
        this.alternativaFormGroup = this._formBuilder.group({
            iAlternativaId: new FormControl<number | string>(0),
            iPreguntaId: [0],
            cAlternativaDescripcion: [null, Validators.required],
            cAlternativaLetra: [
                null,
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1),
                ],
            ],
            bAlternativaCorrecta: [false, Validators.required],
            cAlternativaExplicacion: [''],
            isLocal: [true],
            isDeleted: [false],
        })
    }

    obtenerNuevaAlternativas(alternativa) {
        const newAlternativas = [...this.alternativas]
        alternativa.bAlternativaCorrecta = alternativa.bAlternativaCorrecta
            ? 1
            : 0
        const existeAlternativa = newAlternativas.some((x) => {
            return x.iAlternativaId == alternativa.iAlternativaId
        })

        // si existe actualizar alternativa
        if (existeAlternativa) {
            const index = newAlternativas.findIndex(
                (x) => x.iAlternativaId == alternativa.iAlternativaId
            )
            newAlternativas[index] = alternativa
        } else {
            newAlternativas.push(alternativa)
        }
        return newAlternativas
    }

    closeModal(data) {
        this._ref.close(data)
    }

    // validar el formulario y emitir la alternativa al cerrar el modal
    guardarActualizarAlternativa() {
        if (this.alternativaFormGroup.invalid) {
            this.alternativaFormGroup.markAllAsTouched()
            return
        }

        const alternativa = this.alternativaFormGroup.value

        this.closeModal(alternativa)
    }
}
