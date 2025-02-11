import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
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

    tipo_documentos: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    etnias: Array<object>
    religiones: Array<object>
    tipos_contacto: Array<object>

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private constantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}

    ngOnInit(): void {
        this.getTipoDocumento()
        this.getSexos()
        this.getNacionalidades()
        this.getDepartamentos()
        this.getLenguas()
        this.getEtnias()
        this.getReligiones()
        this.getTiposContacto()

        try {
            this.form = this.fb.group({
                iPersId: [{ value: 0, disabled: true }], // FK tabla grl.persona para familiar
                iTipoIdentId: [null, Validators.required],
                cPersDocumento: ['', Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                cPersNombre: ['', Validators.required],
                cPersSexo: [null, Validators.required],
                iNacionId: [null],
                cPersCertificado: [''],
                dPersNacimiento: [''],
                cPersDomicilio: [''],
                iPaisId: [null, Validators.required],
                iDptoId: [null, Validators.required],
                iPrvnId: [null, Validators.required],
                iDsttId: [null, Validators.required],
                iLenguaMaterna: [null],
                iLenguaSecundaria: [null],
                iEtnia: [null],
                cPersEmail: [null],
                iTipoConId: [null],
                cPersConNombre: [null],
                iReligionId: [null],
                iCredId: this.constantesService.iCredId,
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }
    }

    getTipoDocumento() {
        this.tipo_documentos = [
            { nombre: 'DOCUMENTO NACIONAL DE IDENTIDAD', id: '1' },
            { nombre: 'CARNET DE EXTRANJERIA', id: '2' },
            { nombre: 'PERMISO TEMPORAL DE PERMANENCIA', id: '3' },
            { nombre: 'PASAPORTE', id: '4' },
            { nombre: 'SIN DOCUMENTO DE IDENTIDAD', id: '5' },
        ]
    }

    getSexos() {
        this.sexos = [
            { nombre: 'MASCULINO', id: 'M' },
            { nombre: 'FEMENINO', id: 'F' },
        ]
    }

    getNacionalidades() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'nacionalidades',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.nacionalidades = item.map((nacionalidad) => ({
                        id: nacionalidad.iNacionId,
                        nombre: nacionalidad.cNacionNombre,
                    }))
                    console.log(this.nacionalidades, 'nacionalidades')
                },
                error: (error) => {
                    console.error('Error obteniendo nacionalidades:', error)
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

    getDepartamentos() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'departamentos',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.departamentos = item.map((departamento) => ({
                        id: departamento.iDptoId,
                        nombre: departamento.cDptoNombre,
                    }))
                    console.log(this.departamentos, 'departamentos')
                },
                error: (error) => {
                    console.error('Error obteniendo departamentos:', error)
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
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'provincias',
                campos: '*',
                condicion: 'iDptoId = ' + this.form.value.iDepartamentoId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.provincias = item.map((provincia) => ({
                        id: provincia.iPrvnId,
                        nombre: provincia.cPrvnNombre,
                    }))
                    console.log(this.provincias, 'provincias')
                },
                error: (error) => {
                    console.error('Error obteniendo provincias:', error)
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

    getDistritos() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'distritos',
                campos: '*',
                condicion: 'iPrvnId = ' + this.form.value.iProvinciaId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.distritos = item.map((distrito) => ({
                        id: distrito.iDsttId,
                        nombre: distrito.cDsttNombre,
                    }))
                    console.log(this.distritos, 'distritos')
                },
                error: (error) => {
                    console.error('Error obteniendo distritos:', error)
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

    getLenguas() {
        this.lenguas = [
            { nombre: 'ESPAÑOL', id: '1' },
            { nombre: 'QUECHUA', id: '2' },
            { nombre: 'AYMARA', id: '3' },
            { nombre: 'INGLÉS', id: '4' },
        ]
    }

    getEtnias() {
        this.etnias = [
            { nombre: 'MESTIZO', id: '1' },
            { nombre: 'AFROAMERICANO', id: '2' },
        ]
    }

    getReligiones() {
        this.religiones = [
            { nombre: 'CATOLICO', id: '1' },
            { nombre: 'PROTESTANTE', id: '2' },
            { nombre: 'ATEO', id: '3' },
        ]
    }

    getTiposContacto() {
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'tipos_contactos',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.tipos_contacto = item.map((tipo_contacto) => ({
                        id: tipo_contacto.iTipoConId,
                        nombre: tipo_contacto.cTipoConNombre,
                    }))
                    console.log(this.tipos_contacto, 'tipos_contactos')
                },
                error: (error) => {
                    console.error('Error obteniendo tipos_contactos:', error)
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
