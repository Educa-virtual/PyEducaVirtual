import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { CompartirEstudianteService } from '@/app/sistema/gestion-institucional/services/compartir-estudiante.service'
import { DatosEstudianteService } from '@/app/sistema/gestion-institucional/services/datos-estudiante-service'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-representante',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './representante.component.html',
    styleUrl: './representante.component.scss',
})
export class RepresentanteComponent implements OnInit {
    form: FormGroup

    tipos_familiares: Array<object>
    tipos_documentos: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    tipos_contacto: Array<object>
    representante_registrado: boolean = false

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private datosEstudianteService: DatosEstudianteService,
        private compartirEstudianteService: CompartirEstudianteService,
        private constantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.compartirEstudianteService.getiEstudianteId() === null) {
            this.router.navigate([
                '/gestion-institucional/estudiante/registro/datos',
            ])
        }

        this.datosEstudianteService.getTiposFamiliares().subscribe((data) => {
            this.tipos_familiares = data
        })
        this.datosEstudianteService.getTiposDocumentos().subscribe((data) => {
            this.tipos_documentos = data
        })
        this.datosEstudianteService.getEstadosCiviles().subscribe((data) => {
            this.estados_civiles = data
        })
        this.datosEstudianteService.getNacionalidades().subscribe((data) => {
            this.nacionalidades = data
        })
        this.datosEstudianteService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })

        this.sexos = this.datosEstudianteService.getSexos()
        this.lenguas = this.datosEstudianteService.getLenguas()

        try {
            this.form = this.fb.group({
                iPersId: [
                    this.compartirEstudianteService.getiPersId(),
                    Validators.required,
                ], // PK
                iTipoFamiliarId: [null, Validators.required],
                iTipoIdentId: [null, Validators.required],
                cPersDocumento: ['', Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                cPersNombre: ['', Validators.required],
                iTipoEstCivId: [null],
                cPersSexo: [null, Validators.required],
                iNacionId: [null],
                dPersNacimiento: ['', Validators.required],
                cPersDomicilio: [''],
                iPaisId: [null],
                iDptoId: [null],
                iPrvnId: [null],
                iDsttId: [null],
                bEsRepresentante: true,
                iOcupacionId: [null],
                bFamiliarVivoConEl: [false],
                iGradoInstId: [null],
                iCredId: this.constantesService.iCredId,
                cEstCodigo: [{ value: '', disabled: true }],
                cEstApenom: [{ value: '', disabled: true }],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

        this.form.get('iDptoId').valueChanges.subscribe((value) => {
            this.getProvincias(value)
        })

        this.form.get('iPrvnId').valueChanges.subscribe((value) => {
            this.getDistritos(value)
        })

        if (this.compartirEstudianteService.getiPersId()) {
            this.form
                .get('iPersId')
                ?.setValue(this.compartirEstudianteService.getiPersId())
        }

        this.setFormRepresentante()
    }

    setFormRepresentante() {
        if (
            this.compartirEstudianteService.getiPersRepresentanteLegalId() ==
            null
        ) {
            return null
        }
        this.datosEstudianteService
            .searchRepresentante({
                iEstudianteId:
                    this.compartirEstudianteService.getiEstudianteId(),
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    this.form.get('iPersId')?.setValue(item.iPersId)
                    this.form
                        .get('iTipoFamiliarId')
                        ?.setValue(item.iTipoFamiliarId)
                    this.form.get('iTipoIdentId')?.setValue(item.iTipoIdentId)
                    this.form
                        .get('cPersDocumento')
                        ?.setValue(item.cPersDocumento)
                    this.form.get('cPersNombre')?.setValue(item.cPersNombre)
                    this.form.get('cPersPaterno')?.setValue(item.cPersPaterno)
                    this.form.get('cPersMaterno')?.setValue(item.cPersMaterno)
                    this.form.get('cPersSexo')?.setValue(item.cPersSexo)
                    this.form.get('iTipoEstCivId')?.setValue(item.iTipoEstCivId)
                    this.form.get('iNacionId')?.setValue(item.iNacionId)
                    this.form
                        .get('cPersDomicilio')
                        ?.setValue(item.cPersDomicilio)
                    this.form.get('iPaisId')?.setValue(item.iPaisId)
                    this.form.get('iDptoId')?.setValue(item.iDptoId)
                    this.form.get('iPrvnId')?.setValue(item.iPrvnId)
                    this.form.get('iDsttId')?.setValue(item.iDsttId)
                    this.form
                        .get('dPersNacimiento')
                        ?.setValue(
                            item.dPersNacimiento
                                ? new Date(item.dPersNacimiento)
                                : null
                        )
                },
                error: (error) => {
                    console.error('Error obteniendo representante:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getProvincias(iDptoId: number) {
        this.datosEstudianteService.getProvincias(iDptoId).subscribe({
            next: (data) => {
                this.provincias = data
            },
        })
    }

    getDistritos(iPrvnId: number) {
        this.datosEstudianteService.getDistritos(iPrvnId).subscribe({
            next: (data) => {
                this.distritos = data
            },
        })
    }

    guardarRepresentante() {
        this.form.patchValue({
            iPersId: this.compartirEstudianteService.getiPersId(),
        })
        this.datosEstudianteService
            .guardarPersonaFamiliar(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.representante_registrado = true
                    console.log(data, 'agregar representante')
                    this.compartirEstudianteService.setiPersRepresentanteLegalId(
                        data.data[0].iPersRepresentanteLegalId
                    )
                    this.router.navigate([
                        '/gestion-institucional/estudiante/registro/familia',
                    ])
                },
                error: (error) => {
                    console.error('Error guardando representante:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actualizarRepresentante() {
        this.form.patchValue({
            iPersId: this.compartirEstudianteService.getiPersId(),
        })
        this.datosEstudianteService
            .actualizarPersonaFamiliar(this.form.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'agregar representante')
                    this.compartirEstudianteService.setiPersRepresentanteLegalId(
                        data.data[0].iPersRepresentanteLegalId
                    )
                    this.router.navigate([
                        '/gestion-institucional/estudiante/registro/familia',
                    ])
                },
                error: (error) => {
                    console.error('Error actualizando representante:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
}
