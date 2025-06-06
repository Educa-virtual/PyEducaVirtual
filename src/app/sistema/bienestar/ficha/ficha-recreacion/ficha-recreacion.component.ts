import { Component, inject, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MultiselectInputComponent } from '../shared/multiselect-input/multiselect-input.component'
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component'
import { DropdownInputComponent } from '../shared/dropdown-input/dropdown-input.component'

@Component({
    selector: 'app-ficha-recreacion',
    standalone: true,
    imports: [
        PrimengModule,
        MultiselectInputComponent,
        SwitchInputComponent,
        DropdownInputComponent,
    ],
    templateUrl: './ficha-recreacion.component.html',
    styleUrl: './ficha-recreacion.component.scss',
})
export class FichaRecreacionComponent implements OnInit {
    formRecreacion: FormGroup | undefined
    visibleInput: Array<boolean>
    ficha_registrada: boolean = false

    deportes: Array<any> = []
    religiones: Array<any> = []
    transportes: Array<any> = []
    pasatiempos: Array<any> = []
    actividades: Array<any> = []
    tipos_familiares: Array<any> = []
    relacion_familia: Array<any> = []

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private compartirFichaService: CompartirFichaService,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private router: Router
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
        this.compartirFichaService.setActiveIndex(7)
    }

    async ngOnInit() {
        this.visibleInput = Array(8).fill(false)

        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.deportes = this.datosFichaBienestarService.getDeportes(
                    data?.deportes
                )
                this.religiones = this.datosFichaBienestarService.getReligiones(
                    data?.religiones
                )
                this.transportes =
                    this.datosFichaBienestarService.getTransportes(
                        data?.transportes
                    )
                this.pasatiempos =
                    this.datosFichaBienestarService.getPasatiempos(
                        data?.pasatiempos
                    )
                this.actividades =
                    this.datosFichaBienestarService.getActividades(
                        data?.actividades
                    )
                this.tipos_familiares =
                    this.datosFichaBienestarService.getTiposFamiliares(
                        data?.tipos_familiares
                    )
            })
        this.relacion_familia = [
            { value: 1, label: 'Buena' },
            { value: 2, label: 'Regular' },
            { value: 3, label: 'Mala' },
        ]

        if (this.compartirFichaService.getiFichaDGId() !== undefined) {
            this.verFichaRecreacion()
        }

        this.formRecreacion = this.fb.group({
            iFichaDGId: [
                this.compartirFichaService.getiFichaDGId(),
                Validators.required,
            ],
            iDeporteId: [null],
            cDeporteObs: [''],
            bFichaDGPerteneceLigaDeportiva: [false],
            cFichaDGPerteneceLigaDeportiva: [''],
            iReligionId: [null],
            cReligionObs: [''],
            bFichaDGPerteneceCentroArtistico: [false],
            cFichaDGPerteneceCentroArtistico: [''],
            iActArtisticaId: [null],
            cActArtisticaObs: [''],
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
            jsonDeportes: [null],
            jsonPasatiempos: [null],
            jsonProblemas: [null],
            jsonTransportes: [null],
        })
    }

    async verFichaRecreacion() {
        this.datosFichaBienestarService
            .verFichaRecreacion({
                iFichaDGId: await this.compartirFichaService.getiFichaDGId(),
            })
            .subscribe((data: any) => {
                if (data.data.length) {
                    this.setFormRecreacion(data.data[0])
                }
            })
    }

    setFormRecreacion(data: any) {
        this.ficha_registrada = true
        this.formRecreacion.patchValue(data)

        this.datosFichaBienestarService.formatearFormControl(
            this.formRecreacion,
            'iDeporteId',
            data.deportes,
            'json'
        )
        this.datosFichaBienestarService.formatearFormControl(
            this.formRecreacion,
            'bFichaDGPerteneceLigaDeportiva',
            data.bFichaDGPerteneceLigaDeportiva,
            'boolean'
        )
        this.datosFichaBienestarService.formatearFormControl(
            this.formRecreacion,
            'bFichaDGPerteneceCentroArtistico',
            data.bFichaDGPerteneceCentroArtistico,
            'boolean'
        )
        this.datosFichaBienestarService.formatearFormControl(
            this.formRecreacion,
            'bFichaDGAsistioConsultaPsicologica',
            data.bFichaDGAsistioConsultaPsicologica,
            'boolean'
        )
    }

    actualizar() {
        if (this.formRecreacion.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }

        this.datosFichaBienestarService.formControlJsonStringify(
            this.formRecreacion,
            'jsonDeportes',
            'iDeporteId'
        )
        this.datosFichaBienestarService.formControlJsonStringify(
            this.formRecreacion,
            'jsonPasatiempos',
            ['iPasaTiempoId', 'iActArtisticaId']
        )
        this.datosFichaBienestarService.formControlJsonStringify(
            this.formRecreacion,
            'jsonProblemas',
            'iTipoFamiliarId'
        )
        this.datosFichaBienestarService.formControlJsonStringify(
            this.formRecreacion,
            'jsonTransportes',
            'iTransporteId'
        )

        this.datosFichaBienestarService
            .actualizarFichaRecreacion(this.formRecreacion.value)
            .subscribe({
                next: () => {
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formRecreacion =
                        this.formRecreacion.value
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                },
                error: (error) => {
                    console.error('Error actualizando ficha:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    salir() {
        this.router.navigate(['/'])
    }
}
