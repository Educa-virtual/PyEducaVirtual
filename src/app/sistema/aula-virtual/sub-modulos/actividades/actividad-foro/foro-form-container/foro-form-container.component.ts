import { Component, inject, OnInit, Input } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { PrimengModule } from '@/app/primeng.module'
import { Message, MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { GeneralService } from '@/app/servicios/general.service'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ForosService } from '@/app/servicios/aula/foros.service'

@Component({
    selector: 'app-foro-form-container',
    standalone: true,
    imports: [PrimengModule, TypesFilesUploadPrimengComponent],
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
        image: false,
    }
    filesUrl = []
    // _aulaService obtener datos
    pipe = new DatePipe('es-ES')
    date = new Date()

    private _aulaService = inject(ApiAulaService)
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)
    private GeneralService = inject(GeneralService)
    private _constantesService = inject(ConstantesService)
    private _ForosService = inject(ForosService)
    private _MessageService = inject(MessageService)

    tareas = []

    categorias: any[] = []
    semana: Message[] = []

    idDocCursoId: any
    isLoading: boolean = false

    public foroForm = this._formBuilder.group({
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [0, [Validators.required]],
        dtForoInicio: [this.date, Validators.required],
        dtForoFin: [this.date, Validators.required],
        cForoUrl: [],
        iForoId: [],
    })

    action: string = 'GUARDAR'
    perfil: any
    data: any
    constructor(
        private dialogConfig: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.idDocCursoId = this.dialogConfig.data.idDocCursoId
        this.action = this.dialogConfig.data.action.toUpperCase()

        this.data = this.dialogConfig.data

        if (this.action == 'ACTUALIZAR') {
            this.obtenerForoxiForoId(this.data.actividad.ixActivadadId)
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
            //console.log('Datos mit', this.categorias)
        })
    }
    // Cerrar el modal
    closeModal(data) {
        this.ref.close(data)
    }
    // Guardar foro
    submit() {
        if (this.isLoading) return // evitar doble clic
        this.isLoading = true

        const data = this.foroForm.value
        const dataForo = {
            iForoCatId: data.iForoCatId,
            iDocenteId: this._constantesService.iDocenteId,
            cForoTitulo: data.cForoTitulo,
            cForoDescripcion: data.cForoDescripcion,
            dtForoInicio: this.pipe.transform(
                data.dtForoInicio,
                'yyyy-MM-ddTHH:mm:ss'
            ),
            dtForoFin: this.pipe.transform(
                data.dtForoFin,
                'yyyy-MM-ddTHH:mm:ss'
            ),
            iContenidoSemId: this.contenidoSemana.iContenidoSemId,
            iActTipoId: this.data.iActTipoId,
            idDocCursoId: this.data.idDocCursoId,
            iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
            cForoUrl: this.filesUrl.length
                ? JSON.stringify(this.filesUrl)
                : null,
            iForoId: data.iForoId,
        }
        // console.log('foro a guardar', dataForo)
        if (this.foroForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'Campos vacios!',
            })
            this.isLoading = false
            return
        }

        if (this.action === 'GUARDAR') {
            this.agregarForo(dataForo)
        }
        if (this.action === 'ACTUALIZAR') {
            this.actualizarForo(dataForo)
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
            case 'subir-file-foros':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-foros':
                if (item === '') return
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-foros':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'subir-image-foros':
                this.filesUrl.push({
                    type: 4, //4->image
                    nameType: 'youtube',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'obtenerForoxiForoId':
                const data = item.length ? item[0] : []
                this.foroForm.patchValue({
                    cForoTitulo: data.cForoTitulo ?? '',
                    cForoDescripcion: data.cForoDescripcion ?? '',
                    dtForoInicio: data.dtForoInicio
                        ? new Date(data.dtForoInicio)
                        : this.date,
                    dtForoFin: data.dtForoFin
                        ? new Date(data.dtForoFin)
                        : this.date,
                    iForoId: data.iForoId,
                    iForoCatId: data.iForoCatId,
                })
                this.filesUrl = data.cForoUrl ? JSON.parse(data.cForoUrl) : []
                break
        }
    }

    agregarForo(foro) {
        this._ForosService.guardarForos(foro).subscribe({
            next: (resp) => {
                if (resp.validated) {
                    this.mostrarMensajeToast({
                        severity: 'success',
                        summary: 'Genial!',
                        detail: resp.message,
                    })
                    setTimeout(() => {
                        this.closeModal(resp.validated)
                    }, 1000)
                }
                this.isLoading = false
            },
            error: (error) => {
                const errores = error?.error?.errors
                if (error.status === 422 && errores) {
                    // Recorre y muestra cada mensaje de error
                    Object.keys(errores).forEach((campo) => {
                        errores[campo].forEach((mensaje: string) => {
                            this.mostrarMensajeToast({
                                severity: 'error',
                                summary: 'Error de validación',
                                detail: mensaje,
                            })
                        })
                    })
                } else {
                    // Error genérico si no hay errores específicos
                    this.mostrarMensajeToast({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error?.error?.message ||
                            'Ocurrió un error inesperado',
                    })
                }
                this.isLoading = false
            },
        })
    }

    actualizarForo(foro) {
        this._aulaService.actualizarForo(foro).subscribe({
            next: (resp: any) => {
                if (resp.validated) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Genial!',
                        detail: 'Se actualizó correctamente',
                    })
                    setTimeout(() => {
                        this.closeModal(resp.validated)
                    }, 1000)
                }
                this.isLoading = false
            },
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
                this.isLoading = false
            },
        })
    }

    mostrarMensajeToast(message) {
        this._MessageService.add(message)
    }
}
