import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'

@Component({
    selector: 'app-ficha-socioeconomica',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        FormsModule,
        PrimengModule,
        //TablePrimengComponent,
        DropdownModule,
    ],
    templateUrl: './fichasocgeneral.component.html',
    styleUrl: './fichasocgeneral.component.scss',
})
export class FichasocgeneralComponent implements OnInit {
    formGroup: FormGroup | undefined
    formGeneral: FormGroup
    religiones: Array<object>
    tipos_vias: Array<object>
    visibleInput: boolean = false

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.formGroup = new FormGroup({
            text: new FormControl<string | null>(null),
        })

        this.religiones = [
            { label: 'Ninguno/Ateísmo', value: '1' },
            { label: 'Católicismo', value: '2' },
            { label: 'Adventista', value: '3' },
            { label: 'Mormonismo', value: '4' },
            { label: 'Islamismo', value: '5' },
            { label: 'Budismo', value: '6' },
            { label: 'Islamismo', value: '7' },
            { label: 'Pentescostal', value: '8' },
        ]

        this.tipos_vias = [
            { label: 'Avenida', value: 'Avenida' },
            { label: 'Jirón', value: 'Jiron' },
            { label: 'Calle', value: 'Calle' },
        ]

        this.formGeneral = this.fb.group({
            iTipoViaId: [null],
            cFichaDGDireccionNombreVia: ['', Validators.required],
            cFichaDGDireccionNroPuerta: [''],
            cFichaDGDireccionBlock: [''],
            cFichaDGDirecionInterior: [''],
            cFichaDGDirecionPiso: [''],
            cFichaDGDireccionManzana: [''],
            cFichaDGDireccionLote: [''],
            cFichaDGDireccionKm: [''],
            cFichaDGDireccionReferencia: [''],
            iReligionId: [null],
            bFamiliarPadreVive: [false],
            bFamiliarMadreVive: [''],
            bFamiliarPadresVivenJuntos: [''],
            bFichaDGTieneHijos: [false],
            iFichaDGNroHijos: [null],
        })

        // Habilitar o deshabilitar el campo "iFichaDGNroHijos" en función de "bFichaDGTieneHijos"
        this.formGeneral
            .get('bFichaDGTieneHijos')
            ?.valueChanges.subscribe((value) => {
                if (value) {
                    this.visibleInput = true
                } else {
                    this.visibleInput = false
                    this.formGeneral.get('iFichaDGNroHijos')?.setValue(null) // Limpia si desactivan
                }
            })
    }

    guardar() {
        if (this.formGeneral.valid) {
            console.log('Datos a guardar:', this.formGeneral.value)
        } else {
            console.warn('El formulario tiene errores')
            this.formGeneral.markAllAsTouched() // Para resaltar campos con errores
        }
    }
}
