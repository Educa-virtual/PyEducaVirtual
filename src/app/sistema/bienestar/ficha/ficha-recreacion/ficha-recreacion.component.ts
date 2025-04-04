import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-ficha-recreacion',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-recreacion.component.html',
    styleUrl: './ficha-recreacion.component.scss',
})
export class FichaRecreacionComponent implements OnInit {
    formRecreacion: FormGroup | undefined
    visibleInput: Array<boolean>

    constructor(
        private fb: FormBuilder,
        private compartirFichaService: CompartirFichaService,
        private router: Router
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
        this.compartirFichaService.setActiveIndex(7)
    }

    ngOnInit() {
        this.visibleInput = Array(8).fill(false)

        this.formRecreacion = this.fb.group({
            iFichaDGId: [null, Validators.required],
            iDeporteId: [null],
            cDeporteObs: [''],
            bFichaDGPerteneceLigaDeportiva: [false],
            cFichaDGPerteneceLigaDeportiva: [''],
            iReligionId: [null],
            bFichaDGPerteneceCentroArtistico: [false],
            cFichaDGPerteneceCentroArtistico: [''],
            iPasaTiempoId: [null],
            cPasaTiempoObs: [''],
            bFichaDGAsistioConsultaPsicologica: [false],
            cFichaDGAsistioConsultaPsicologica: [''],
            iTipoFamiliarId: [null],
            cTipoFamiliarObs: [''],
            iRelacionPadresId: [null],
            iTransporteId: [null],
            cTransporteObs: [''],
            nTransFichaGastoSoles: [null],
            nTransFichaGastoTotal: [null],
        })
    }

    deportes = [
        { value: 0, label: 'OTRO' },
        { value: 1, label: 'FUTBOL' },
        { value: 2, label: 'VOLEY' },
        { value: 3, label: 'BASQUET' },
        { value: 4, label: 'NATACION' },
    ]

    club = [{ respuesta: 'Si', seleccionado: false }]

    religion = [
        { value: 0, label: 'OTRO' },
        { value: 1, label: 'Cristianismo' },
        { value: 2, label: 'Islam' },
        { value: 3, label: 'Hinduismo' },
        { value: 4, label: 'Budismo' },
        { value: 5, label: 'Ateísmo' },
    ]
    // aqui se guarda la opcion seleccionada
    religionSeleccionada: any = null

    act_artistica = [
        { value: 0, label: 'Otra actividad' },
        { value: 1, label: 'Teatro' },
        { value: 2, label: 'Danza' },
        { value: 3, label: 'Música' },
        { value: 4, label: 'Oratoria' },
    ]

    Pasatiempos = [
        { value: 0, label: 'Otro pasatiempo' },
        { value: 1, label: 'Cine' },
        { value: 2, label: 'Lectura' },
        { value: 3, label: 'Escuchar Música' },
        { value: 4, label: 'Video juegos' },
        { value: 5, label: 'Juegos online' },
        { value: 6, label: 'Reuniones con amigos' },
        { value: 7, label: 'Pasear' },
    ]

    Problememocional = [
        { value: 0, label: 'Otro' },
        { value: 1, label: 'Padre' },
        { value: 2, label: 'Madre' },
        { value: 3, label: 'Hermanos' },
        { value: 4, label: 'Amigos' },
        { value: 5, label: 'Tutor' },
        { value: 6, label: 'Psicólogo' },
    ]

    Relac_familiar = [
        { value: 1, label: 'Bueno' },
        { value: 2, label: 'Regular' },
        { value: 3, label: 'Malo' },
    ]
    // aqui se guarda la opcion seleccionada
    relfamiliarSeleccionada: any = null

    dpersonal = [
        { value: 0, label: 'Otro Emocional' },
        { value: 1, label: 'Inteligencia Emocional' },
        { value: 2, label: 'Habilidades Socioemocionales' },
        { value: 3, label: 'Control de las emociones' },
        { value: 4, label: 'Resiliencia' },
        { value: 5, label: 'Autoestima' },
    ]

    mTransporteUrbano = [
        { value: 0, label: 'Otro' },
        { value: 1, label: 'Autobús' },
        { value: 2, label: 'Taxi' },
        { value: 3, label: 'Mototaxi' },
        { value: 4, label: 'Bicicleta' },
        { value: 5, label: 'Metro' },
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

    handleSwitchChange(event: any, index: number) {
        if (event?.checked === undefined) {
            this.visibleInput[index] = false
            return null
        }
        if (event.checked === true) {
            this.visibleInput[index] = true
        } else {
            this.visibleInput[index] = false
        }
    }

    handleDropdownChange(event: any, index: number) {
        if (event?.value === undefined) {
            this.visibleInput[index] = false
            return null
        }
        if (Array.isArray(event.value)) {
            if (event.value.includes(0)) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        } else {
            if (event.value == 0) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        }
    }

    guardarDatos() {
        console.log('Guardando formulario...')
        // Aquí va la lógica de guardado, por ejemplo, una llamada a servicio
    }

    actualizarDatos() {
        console.log('Actualizando formulario...')
        // Aquí va la lógica de actualización, por ejemplo, una llamada a servicio
    }

    imprimirFormulario() {
        window.print()
    }
}
