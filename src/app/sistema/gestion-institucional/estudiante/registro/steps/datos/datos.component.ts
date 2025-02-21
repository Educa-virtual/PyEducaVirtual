import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { CompartirEstudianteService } from '@/app/sistema/gestion-institucional/services/compartir-estudiante.service'
import { DatosEstudianteService } from '@/app/sistema/gestion-institucional/services/datos-estudiante-service'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-datos',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './datos.component.html',
    styleUrl: './datos.component.scss',
})
export class DatosComponent implements OnInit {
    form: FormGroup

    tipos_documentos: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    religiones: Array<object>
    tipos_contacto: Array<object>
    ubigeo: Array<object>

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private datosEstudianteService: DatosEstudianteService,
        private compartirEstudianteService: CompartirEstudianteService,
        private constantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}

    ngOnInit(): void {
        this.datosEstudianteService.getTiposDocumentos().subscribe((data) => {
            this.tipos_documentos = data
        })
        this.datosEstudianteService.getNacionalidades().subscribe((data) => {
            this.nacionalidades = data
        })
        this.datosEstudianteService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })
        this.datosEstudianteService.getTiposContacto().subscribe((data) => {
            this.tipos_contacto = data
        })
        this.datosEstudianteService.getReligiones().subscribe((data) => {
            this.religiones = data
        })

        this.sexos = this.datosEstudianteService.getSexos()

        try {
            this.form = this.fb.group({
                iEstudianteId: [0], // PK
                iPersId: [0], // FK tabla grl.personas
                cEstCodigo: [''],
                iTipoIdentId: [null, Validators.required],
                cPersDocumento: ['', Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                cPersNombre: ['', Validators.required],
                cPersSexo: [null, Validators.required],
                iNacionId: [null],
                cEstPartidaNacimiento: [''],
                dPersNacimiento: ['', Validators.required],
                cPersDomicilio: [''],
                iPaisId: [null],
                iDptoId: [null],
                iPrvnId: [null],
                iDsttId: [null],
                iCredId: this.constantesService.iCredId,
                iReligionId: [null],
                cEstUbigeo: [''],
                cEstTelefono: [''],
                cEstCorreo: [''],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

        this.form
            .get('iEstudianteId')
            .setValue(this.compartirEstudianteService.getiEstudianteId())
        this.form
            .get('iPersId')
            .setValue(this.compartirEstudianteService.getiPersId())

        this.form.get('iDptoId').valueChanges.subscribe((value) => {
            this.getProvincias(value)
        })

        this.form.get('iPrvnId').valueChanges.subscribe((value) => {
            this.getDistritos(value)
        })

        this.form.get('iDsttId').valueChanges.subscribe((value) => {
            const item = this.distritos.find((item: any) => item.id === value)
            if (item) {
                this.form.get('cEstUbigeo').setValue(item['ubigeo'])
            } else {
                this.form.get('cEstUbigeo').setValue('')
            }
        })

        this.setFormEstudiante()
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

    setFormEstudiante() {
        if (this.compartirEstudianteService.getiEstudianteId() == null) {
            return null
        }
        this.datosEstudianteService
            .searchEstudiante({
                iEstudianteId:
                    this.compartirEstudianteService.getiEstudianteId(),
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    this.form.get('iEstudianteId')?.setValue(item.iEstudianteId)
                    this.form.get('iPersId')?.setValue(item.iPersId)
                    this.form.get('cEstCodigo')?.setValue(item.cEstCodigo)
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
                        .get('cEstPartidaNacimiento')
                        ?.setValue(item.cEstPartidaNacimiento)
                    this.form.get('iDptoId')?.setValue(item.iDptoId)
                    this.form.get('iPrvnId')?.setValue(item.iPrvnId)
                    this.form.get('iDsttId')?.setValue(item.iDsttId)
                    this.form
                        .get('cPersDomicilio')
                        ?.setValue(item.cPersDomicilio)
                    this.form.get('cEstTelefono')?.setValue(item.cEstTelefono)
                    this.form.get('cEstCorreo')?.setValue(item.cEstCorreo)
                    this.form
                        .get('dPersNacimiento')
                        ?.setValue(
                            item.dPersNacimiento
                                ? new Date(item.dPersNacimiento)
                                : null
                        )
                },
                error: (error) => {
                    console.error('Error obteniendo estudiante:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    guardarEstudiante() {
        this.datosEstudianteService
            .guardarEstudiante(this.form.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'agregar estudiante')
                    this.compartirEstudianteService.setiEstudianteId(
                        data.data[0].iEstudianteId
                    )
                    this.compartirEstudianteService.setiPersId(
                        data.data[0].iPersId
                    )
                    this.compartirEstudianteService.setActiveIndex('1')
                },
                error: (error) => {
                    console.error('Error guardando estudiante:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
}
