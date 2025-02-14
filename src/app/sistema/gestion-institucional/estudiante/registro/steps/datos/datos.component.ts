import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { CompartirMatriculasService } from '@/app/sistema/gestion-institucional/services/compartir.matriculas.service'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-datos',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './datos.component.html',
    styleUrl: './datos.component.scss',
})
export class DatosComponent {
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
        private compartirMatriculasService: CompartirMatriculasService,
        private constantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}

    ngOnInit(): void {
        this.compartirMatriculasService
            .getTiposDocumentos()
            .subscribe((data) => {
                this.tipos_documentos = data
            })
        this.compartirMatriculasService
            .getNacionalidades()
            .subscribe((data) => {
                this.nacionalidades = data
            })
        this.compartirMatriculasService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })
        this.compartirMatriculasService.getTiposContacto().subscribe((data) => {
            this.tipos_contacto = data
        })
        this.compartirMatriculasService.getReligiones().subscribe((data) => {
            this.religiones = data
        })

        this.sexos = this.compartirMatriculasService.getSexos()

        try {
            this.form = this.fb.group({
                iEstudianteId: [{ value: 0, disabled: true }], // PK
                iPersId: [{ value: 0, disabled: true }], // FK tabla grl.personas
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

    setFormEstudiante() {
        if (this.compartirMatriculasService.getiEstudianteId() == null) {
            return null
        }
        this.query
            .searchEstudiante({
                iEstudianteId:
                    this.compartirMatriculasService.getiEstudianteId(),
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
