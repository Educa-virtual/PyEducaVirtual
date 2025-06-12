import { Component, inject, OnInit, Input } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { PrimengModule } from '@/app/primeng.module'
import { Message, MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { FileUploadPrimengComponent } from '../../../../../../shared/file-upload-primeng/file-upload-primeng.component'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { GeneralService } from '@/app/servicios/general.service'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
@Component({
    selector: 'app-foro-form-container',
    standalone: true,
    imports: [
        ModalPrimengComponent,
        PrimengModule,
        FileUploadPrimengComponent,
        TypesFilesUploadPrimengComponent,
    ],
    templateUrl: './foro-form-container.component.html',
    styleUrl: './foro-form-container.component.scss',
})
export class ForoFormContainerComponent implements OnInit {
    @Input() contenidoSemana

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: true,
    }
    filesUrl = []
    // _aulaService obtener datos
    pipe = new DatePipe('es-ES')
    date = new Date()

    private _aulaService = inject(ApiAulaService)
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)
    private GeneralService = inject(GeneralService)

    tareas = []
    filteredTareas: any[] | undefined
    nameEnlace: string = ''
    titleFileTareas: string = ''
    categorias: any[] = []
    semana: Message[] = []
    selectProgramaAct = 0

    selectCategorias: any = {}
    idDocCursoId: any
    public foroForm = this._formBuilder.group({
        iForoId: [],
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [0, [Validators.required]],
        dtForoInicio: [''],
        iEstado: [true],
        dtForoPublicacion: [''],
        dtForoFin: [],
        cForoUrl: [],
        cForoCatDescripcion: [],
        idDocCursoId: [],

        //VARIABLES DE AYUDA QUE NO ESTÀN EN LA BD
        dtInicio: [this.date, Validators.required],
        dtFin: [this.date, Validators.required],
    })

    opcion: string = 'GUARDAR'
    action: string
    constructor(
        private dialogConfig: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.idDocCursoId = this.dialogConfig.data.idDocCursoId
        this.action = this.dialogConfig.data.action

        const data = this.dialogConfig.data

        if (this.action == 'ACTUALIZAR') {
            this.obtenerForoxiForoId(data.actividad.ixActivadadId)
        } else {
            this.opcion = 'GUARDAR'
        }

        this.semana = [
            {
                severity: 'info',
                detail: this.contenidoSemana?.cContenidoSemTitulo,
            },
        ]
    }
    ngOnInit(): void {
        this.mostrarCategorias()
    }
    // Mostrar las categorias que existen para foros
    mostrarCategorias() {
        const userId = 1
        this._aulaService.obtenerCategorias(userId).subscribe((Data) => {
            this.categorias = Data['data']
            console.log('Datos mit', this.categorias)
        })
    }
    // Cerrar el modal
    closeModal(data) {
        this.ref.close(data)
    }
    // Guardar foro
    submit() {
        let horaInicio = this.foroForm.value.dtInicio.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaInicio = horaInicio.replace(',', '')
        let horaFin = this.foroForm.value.dtFin.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaFin = horaFin.replace(',', '')
        this.foroForm.controls.dtForoInicio.setValue(horaInicio)
        this.foroForm.controls.dtForoFin.setValue(horaFin)
        this.foroForm.controls.dtForoPublicacion.setValue(horaFin)
        this.foroForm.controls.cForoUrl.setValue(JSON.stringify(this.filesUrl))
        // Limpiar el campo cForoDescripcion de etiquetas HTML
        const rawDescripcion =
            this.foroForm.controls.cForoDescripcion.value || ''
        const tempElement = document.createElement('div')
        tempElement.innerHTML = rawDescripcion // Insertamos el HTML en un elemento temporal
        this.foroForm.controls.idDocCursoId.setValue(this.idDocCursoId)
        const value = {
            ...this.foroForm.value,
            iEstado: this.foroForm.controls.iEstado.value ? 1 : 0,
        }
        if (this.foroForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'Campos vacios!',
            })
        } else {
            console.log('Guardar Foros', value)
            this.ref.close(value)
        }
    }
    obtenerForoxiForoId(iForoId: string) {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'foros',
            ruta: 'obtenerForoxiForoId',
            data: {
                iForoId: iForoId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.ruta)
    }
    getInformation(params, condition) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion: condition, item: response.data })
            },
            complete: () => {},
            error: (error) => {
                const errores = error?.error?.errors
                if (error.status === 422 && errores) {
                    // Recorre y muestra cada mensaje de error
                    Object.keys(errores).forEach((campo) => {
                        errores[campo].forEach((mensaje: string) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error de validación',
                                detail: mensaje,
                            })
                        })
                    })
                } else {
                    // Error genérico si no hay errores específicos
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error?.error?.message ||
                            'Ocurrió un error inesperado',
                    })
                }
            },
        })
    }
    // acciones para subir los archivos
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'get_tareas_reutilizadas':
                this.tareas = item
                this.filteredTareas = item
                break
            case 'close-modal':
                this.showModal = false
                break
            case 'subir-file-foros':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                this.showModal = false
                break
            case 'url-foros':
                if (item === '') return
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item,
                    size: '',
                    ruta: item,
                })
                this.showModal = false
                this.nameEnlace = ''
                break
            case 'youtube-foros':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item,
                    size: '',
                    ruta: item,
                })
                this.showModal = false
                this.nameEnlace = ''
                break
            case 'subir-image-foros':
                this.filesUrl.push({
                    type: 4, //4->image
                    nameType: 'youtube',
                    name: item,
                    size: '',
                    ruta: item,
                })
                this.showModal = false
                this.nameEnlace = ''
                break
            case 'obtenerForoxiForoId':
                const data = item.length ? item[0] : []
                this.foroForm.patchValue(data)
                this.filesUrl = data.cForoUrl ? JSON.parse(data.cForoUrl) : []
                break
        }
    }
    showModal: boolean = false
    typeUpload: string
    openUpload(type) {
        this.showModal = true
        this.typeUpload = type
        this.titleFileTareas = ''
        switch (type) {
            case 'file':
                this.titleFileTareas = 'Añadir Archivo Local'
                break
            case 'url':
                this.titleFileTareas = 'Añadir Enlace URL'
                break
            case 'youtube':
                this.titleFileTareas = 'Añadir Enlace de Youtube'
                break
            // case 'recursos':
            //     this.titleFileTareas = 'Añadir Archivo de mis Recursos'
            //     break
            default:
                this.showModal = false
                this.typeUpload = null
                break
        }
    }
}
