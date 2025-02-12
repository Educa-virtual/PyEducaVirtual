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
        this.tipos_familiares =
            this.compartirMatriculasService.getTiposFamiliares()
        this.tipos_documentos =
            this.compartirMatriculasService.getTiposDocumentos()
        this.estados_civiles =
            this.compartirMatriculasService.getEstadosCiviles()
        this.sexos = this.compartirMatriculasService.getSexos()
        this.nacionalidades =
            this.compartirMatriculasService.getNacionalidades()
        this.departamentos = this.compartirMatriculasService.getDepartamentos()
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
                cPersCertificado: [''],
                dPersNacimiento: [''],
                bPersCohabitante: [false],
                cPersDomicilio: [''],
                iPaisId: [null, Validators.required],
                iDptoId: [null, Validators.required],
                iPrvnId: [null, Validators.required],
                iDsttId: [null, Validators.required],
                iLenguaId: [null],
                iLenguaSecundariaId: [null],
                iTipoConId: [null],
                cPersConNombre: [null],
                iCredId: this.constantesService.iCredId,
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

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
                    this.form
                        .get('dPersNacimiento')
                        ?.setValue(
                            item.dPersNacimiento
                                ? new Date(item.dPersNacimiento)
                                : null
                        )
                    this.form.get('cPersSexo')?.setValue(item.cPersSexo)
                    this.form.get('iTipoEstCivId')?.setValue(item.iTipoEstCivId)
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

    getProvincias() {
        this.provincias = this.compartirMatriculasService.getProvincias(
            this.form.value.iDptoId
        )
    }

    getDistritos() {
        this.distritos = this.compartirMatriculasService.getDistritos(
            this.form.value.iPrvnId
        )
    }

    guardarRepresentante() {
        this.query.guardarEstudiante(this.form.value).subscribe({
            next: (data: any) => {
                console.log(data, 'agregar estudiante')
                this.compartirMatriculasService.setiEstudianteId(
                    data.data[0].iEstudianteId
                )
                this.compartirMatriculasService.setActiveIndex('1')
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
