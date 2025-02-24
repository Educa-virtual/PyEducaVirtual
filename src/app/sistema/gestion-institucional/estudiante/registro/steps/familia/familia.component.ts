import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CompartirEstudianteService } from '@/app/sistema/gestion-institucional/services/compartir-estudiante.service'
import { DatosEstudianteService } from '@/app/sistema/gestion-institucional/services/datos-estudiante-service'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { InputNumberModule } from 'primeng/inputnumber'

@Component({
    selector: 'app-familia',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        InputNumberModule,
        TablePrimengComponent,
    ],
    templateUrl: './familia.component.html',
    styleUrl: './familia.component.scss',
})
export class FamiliaComponent implements OnInit {
    form: FormGroup

    activeStep: number = 0 // Paso activo
    totalSteps = 3 // Total de pasos del stepper

    familiares: any[]
    option: boolean = false

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

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
    familiar_registrado: boolean = false

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private store: LocalStoreService,
        private compartirEstudianteService: CompartirEstudianteService,
        private datosEstudianteService: DatosEstudianteService,
        private constantesService: ConstantesService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
    }

    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }

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

        this.searchFamiliares()

        try {
            this.form = this.fb.group({
                iFamiliarId: [0, Validators.required], // PK
                iTipoFamiliarId: [0, Validators.required],
                iTipoIdentId: [0, Validators.required],
                cPersDocumento: ['', Validators.required],
                cPersNombre: ['', Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                dPersNacimiento: [Validators.required],
                cPersSexo: [null, Validators.required],
                iTipoEstCivId: [0],
                iNacionId: [0],
                iDptoId: [0],
                iPrvnId: [0],
                iDsttId: [0],
                cPersDomicNombre: [''],
                iLenguaId: [0],
                iLenguaSecundariaId: [0],
                iTipoConId: [0],
                iPersId: this.compartirEstudianteService.getiPersId(),
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
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.c_accion = accion
            this.caption = 'Editar solicitud'
            this.compartirEstudianteService.setiFamiliarId(item?.iPersId)
            this.visible = true
        }
        if (accion === 'anular') {
            this._confirmService.openConfirm({
                message:
                    '¿Está seguro de anular la relación familiar seleccionada?',
                header: 'Anular relación familiar',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.borrarFamiliar(item?.iPersd)
                },
            })
        }
    }

    accionBtnItem(accion) {
        switch (accion) {
            case 'validar':
                this.validar()
                break
            case 'agregar':
                this.visible = true
                break
        }
    }

    onTipoIdentificacionSeleccionado(event: any): void {
        // const id = event.value
        console.log(event)
        // validar longitud de documento de identificacion
    }

    searchFamiliares() {
        this.datosEstudianteService
            .searchEstudianteFamiliares({
                iEstudianteId:
                    this.compartirEstudianteService.getiEstudianteId(),
            })
            .subscribe({
                next: (data: any) => {
                    this.familiares = data.data
                    console.log(this.familiares, 'familiares')
                },
                error: (error) => {
                    console.error('Error al obtener familiares:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {},
            })
    }

    clearForm() {
        this.form.reset()
        this.form.get('iFamiliarId')?.setValue(0)
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

    validar() {
        this.datosEstudianteService
            .validarEstudiante({
                iTipoIdentId: this.form.value.iTipoIdentId,
                cPersDocumento: this.form.value.cPersDocumento,
            })
            .subscribe({
                next: (data: any) => {
                    const persona = data.data.persona
                    const estudiante = data.data.estudiante
                    this.form
                        .get('iEstudianteId')
                        ?.setValue(estudiante.iEstudianteId)
                    this.form.get('iFamiliarId')?.setValue(persona.iPersId)
                    this.form.get('cPersNombre')?.setValue(persona.cPersNombre)
                    this.form
                        .get('cPersPaterno')
                        ?.setValue(persona.cPersPaterno)
                    this.form
                        .get('cPersMaterno')
                        ?.setValue(persona.cPersMaterno)
                    this.form
                        .get('dPersNacimiento')
                        ?.setValue(
                            persona ? new Date(persona.dPersNacimiento) : null
                        )
                    this.form.get('cPersSexo')?.setValue(persona.cPersSexo)
                    this.form
                        .get('iTipoEstCivId')
                        ?.setValue(persona.iTipoEstCivId)
                },
                error: (error) => {
                    console.error('Error validando familiar:', error)
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

    guardarFarmiliar() {
        this.datosEstudianteService
            .guardarPersonaFamiliar(this.form.value)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Se registró exitosamente',
                    })
                    this.visible = false
                    this.searchFamiliares()
                },
                error: (error) => {
                    console.error('Error guardando familiar:', error)
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

    actualizarFarmiliar() {
        this.datosEstudianteService
            .actualizarPersonaFamiliar(this.form.value)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Se actualizó exitosamente',
                    })
                    this.visible = false
                    this.searchFamiliares()
                },
                error: (error) => {
                    console.error('Error actualizando familiar:', error)
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

    borrarFamiliar(iFamiliarId: any) {
        this.datosEstudianteService
            .borrarPersonaFamiliar({
                iPersId: this.compartirEstudianteService.getiPersId(),
                iFamiliarId: iFamiliarId,
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'delete familiar')
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Se eliminó exitosamente',
                    })
                    this.familiares = this.familiares.filter(
                        (item: any) => item.iPersId !== iFamiliarId
                    )
                },
                error: (error) => {
                    console.error('Error eliminando familiar:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
            })
    }

    setFormFamiliar() {
        if (this.compartirEstudianteService.getiFamiliarId() == null) {
            return null
        }
        this.familiar_registrado = true
        this.datosEstudianteService
            .searchEstudianteFamiliar({
                iFamiliarId: this.compartirEstudianteService.getiFamiliarId(),
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    this.form.get('iFamiliarId')?.setValue(item.iPersId)
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
                    console.error('Error obteniendo familiar:', error)
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

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Registrar familiar',
            text: 'Registrar familiar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

    selectedItems = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Anular',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'radio',
            width: '5rem',
            field: 'bEsRepresentante',
            header: 'Rep. Legal',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTipoFamiliarDescripcion',
            header: 'Relación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTipoIdentSigla',
            header: 'Tipo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPersDocumento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: '_cPersApenom',
            header: 'Nombre Completo',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
