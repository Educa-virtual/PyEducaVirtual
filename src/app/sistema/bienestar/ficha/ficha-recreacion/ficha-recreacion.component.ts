import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CheckboxModule } from 'primeng/checkbox'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { DividerModule } from 'primeng/divider'
import { CardModule } from 'primeng/card'
import { ToggleButtonModule } from 'primeng/togglebutton'
import {
    FormControl,
    FormGroup,
    FormBuilder,
    ReactiveFormsModule,
} from '@angular/forms'
import { InputSwitchModule } from 'primeng/inputswitch'
import { CommonModule } from '@angular/common'
import { ListboxModule } from 'primeng/listbox'

@Component({
    selector: 'app-ficha-recreacion',
    standalone: true,
    imports: [
        FormsModule,
        CheckboxModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        MultiSelectModule,
        DividerModule,
        CardModule,
        ToggleButtonModule,
        ReactiveFormsModule,
        InputSwitchModule,
        CommonModule,
        ListboxModule,
    ],
    templateUrl: './ficha-recreacion.component.html',
    styleUrl: './ficha-recreacion.component.scss',
})
export class FichaRecreacionComponent implements OnInit {
    formGroup: FormGroup | undefined

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.formGroup = new FormGroup({
            checked: new FormControl<boolean>(false),
            text: new FormControl<string | null>(null),
        })
    }

    deportes = [
        { nombre: '. Futbol', seleccionado: false },
        { nombre: '. Vóley', seleccionado: false },
        { nombre: '. Básquet', seleccionado: false },
        { nombre: '. Natación', seleccionado: false },
    ]

    club = [{ respuesta: 'Si', seleccionado: false }]

    religion = [
        { nombre: '. Cristianismo' },
        { nombre: '. Islam' },
        { nombre: '. Hinduismo' },
        { nombre: '. Budismo' },
        { nombre: '. Ateísmo' },
    ]
    // aqui se guarda la opcion seleccionada
    religionSeleccionada: any = null

    act_artistica = [
        { nombre: '. Teatro', seleccionado: false },
        { nombre: '. Danza', seleccionado: false },
        { nombre: '. Música', seleccionado: false },
        { nombre: '. Oratoria', seleccionado: false },
    ]

    Pasatiempos = [
        { nombre: '. Cine', seleccionado: false },
        { nombre: '. Lectura', seleccionado: false },
        { nombre: '. Escuchar Música', seleccionado: false },
        { nombre: '. Video juegos', seleccionado: false },
        { nombre: '. Juegos online', seleccionado: false },
        { nombre: '. Reuniones con amigos', seleccionado: false },
        { nombre: '. Pasear', seleccionado: false },
    ]

    Problememocional = [
        { nombre: '. Padre', seleccionado: false },
        { nombre: '. Madre', seleccionado: false },
        { nombre: '. Hermanos', seleccionado: false },
        { nombre: '. Amigos', seleccionado: false },
        { nombre: '. Tutor', seleccionado: false },
        { nombre: '. Psicólogo', seleccionado: false },
    ]

    Relac_familiar = [
        { nombre: '. Bueno', seleccionado: false },
        { nombre: '. Regular', seleccionado: false },
        { nombre: '. Malo', seleccionado: false },
    ]
    // aqui se guarda la opcion seleccionada
    relfamiliarSeleccionada: any = null

    dpersonal = [
        { nombre: '. Inteligencia Emocional', seleccionado: false },
        { nombre: '. Habilidades Socioemocionales', seleccionado: false },
        { nombre: '. Control de las emociones', seleccionado: false },
        { nombre: '. Resiliencia', seleccionado: false },
        { nombre: '. Autoestima', seleccionado: false },
    ]

    mTransporteUrbano = [
        { nombre: 'Autobús' },
        { nombre: 'Taxi' },
        { nombre: 'Mototaxi' },
        { nombre: 'Bicicleta' },
        { nombre: 'Metro' },
    ]

    // aqui se guarda la opcion seleccionada
    mTransporteUrbSeleccionado: any = null

    otrosDeportesSeleccionado = false
    otrosDeportes = ''

    otrosClubesSeleccionado = false
    otrosClubes = ''

    otrasCulturasSeleccionado = false
    otrasCulturas = ''

    otrosActividadSeleccionado = false
    otrasActividades = ''

    otrosPasatiemposSelecccionado = false
    otrosPasatiempos = ''

    otrasConsultsPsicopedagogicas = false
    otrasConsultas = ''

    otroProblemasSeleccionados = false
    otrosProblemas = ''

    otrosdpersonalSeleccionados = false
    otrosdpersonal = ''

    guardarFormulario() {
        console.log('Guardando formulario...')
        // Aquí va la lógica de guardado, por ejemplo, una llamada a servicio
    }

    imprimirFormulario() {
        window.print()
    }
}
