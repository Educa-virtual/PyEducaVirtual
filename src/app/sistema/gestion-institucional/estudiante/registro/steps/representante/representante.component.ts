import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { CompartirMatriculasService } from '@/app/sistema/gestion-institucional/services/compartir.matriculas.service'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-representante',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './representante.component.html',
    styleUrl: './representante.component.scss',
})
export class RepresentanteComponent {
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

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private compartirMatriculasService: CompartirMatriculasService,
        private constantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}

    ngOnInit(): void {
        this.compartirMatriculasService
            .getTiposFamiliares()
            .subscribe((data) => {
                this.tipos_familiares = data
            })
        this.compartirMatriculasService
            .getTiposDocumentos()
            .subscribe((data) => {
                this.tipos_documentos = data
            })
        this.compartirMatriculasService
            .getEstadosCiviles()
            .subscribe((data) => {
                this.estados_civiles = data
            })
        this.compartirMatriculasService
            .getNacionalidades()
            .subscribe((data) => {
                this.nacionalidades = data
            })
        this.compartirMatriculasService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })

        this.sexos = this.compartirMatriculasService.getSexos()
        this.lenguas = this.compartirMatriculasService.getLenguas()

        try {
            this.form = this.fb.group({
                iPersId: [{ value: 0, disabled: true }], // PK
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
                bEsRepresentante: [true],
                iOcupacionId: [null],
                bFamiliarVivoConEl: [false],
                iGradoInstId: [null],
                iCredId: this.constantesService.iCredId,
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

        this.setFormRepresentante()
    }

    setFormRepresentante() {
        if (
            this.compartirMatriculasService.getiPersRepresentanteLegalId() ==
            null
        ) {
            return null
        }
        this.query
            .searchRepresentante({
                iEstudianteId:
                    this.compartirMatriculasService.getiEstudianteId(),
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

    getProvincias(iDptoId: number) {
        this.compartirMatriculasService.getProvincias(iDptoId).subscribe({
            next: (data) => {
                this.provincias = data
            },
        })
    }

    getDistritos(iPrvnId: number) {
        this.compartirMatriculasService.getDistritos(iPrvnId).subscribe({
            next: (data) => {
                this.distritos = data
            },
        })
    }

    guardarRepresentante() {
        this.query.guardarPersonaFamiliar(this.form.value).subscribe({
            next: (data: any) => {
                console.log(data, 'agregar estudiante')
                this.compartirMatriculasService.setiPersRepresentanteLegalId(
                    data.data[0].iPersId
                )
                this.compartirMatriculasService.setActiveIndex('2')
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
