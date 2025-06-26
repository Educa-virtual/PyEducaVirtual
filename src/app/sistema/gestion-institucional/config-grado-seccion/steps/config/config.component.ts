import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Component, inject, OnInit } from '@angular/core'

import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MenuItem, Message } from 'primeng/api'
import { Router } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { MessageService } from 'primeng/api'
import { HttpEvent } from '@angular/common/http'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

interface UploadEvent {
    originalEvent: HttpEvent<any> | Event
    files: File[]
}

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ContainerPageComponent,
        PrimengModule,
        TypesFilesUploadPrimengComponent,
    ],
    providers: [MessageService],
    templateUrl: './config.component.html',
    styleUrl: './config.component.scss',
})
export class ConfigComponent implements OnInit {
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá visualizar la configuración de los ambientes',
        },
    ]

    form: FormGroup

    items: MenuItem[]
    perfil: any[] // almacenar variables locales
    sede: any[]
    opcion: string
    iSedeId: number
    uploadedFiles: any[] = []
    iServId: number
    configTipo: any[]
    enlace: string = ''
    event: []

    btnNuevo: boolean

    typesFiles = {
        //archivos
        file: true,
        url: false,
        youtube: false,
        repository: false,
        image: false,
    }
    filesUrl = [] //archivos

    serv_atencion: {
        iServEdId: number
        iNivelTipoId: number
        cServEdNombre: string
    }[]
    configuracion: any = {}
    // private confirmationService = inject(ConfirmationService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        public query: GeneralService
    ) {
        this.items = this.stepService.itemsStep
        this.perfil = this.stepService.perfil
        this.configuracion = this.stepService.configuracion
        this.sede = this.stepService.sede
        this.iSedeId = this.stepService.iSedeId
        this.configTipo = this.stepService.configTipo
    }
    ngOnInit(): void {
        console.log(this.configuracion, 'this.configuracion')

        if (!this.configuracion) {
            console.warn('Configuración no encontrada, redirigiendo...')
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
            return
        }

        // Si llegas aquí, `configuracion` sí existe
        this.mensajeInformativo()
        this.inicializarFormulario()
    }

    inicializarFormulario() {
        const url = this.query.baseUrlPublic()
        try {
            this.form = this.fb.group({
                iConfigId: [this.configuracion[0].iConfigId], // tabla acad.configuraciones
                iYAcadId: [this.configuracion[0].iYAcadId], //(*) tabla acad.configuraciones FK acad.calemdario_academicos
                cModalServId: [this.configuracion[0].cModalServId], //(*) Agregar tabla acad.configuraciones (FK) acad.calendario_academicos
                iNivelTipoId: [this.configuracion[0].iNivelTipoId], // tabla acad.configuraciones (FK) session
                iServEdId: [
                    this.configuracion[0].iServEdId,
                    Validators.required,
                ], //(*) tabla acad.configuraciones (FK) acad.calendario_academicos

                cServEdNombre: [this.configuracion[0].cServEdNombre],
                cConfigDescripcion: [
                    this.configuracion[0].cConfigDescripcion,
                    Validators.required,
                ], //tabla acad.configuraciones Control para descripción"
                iEstadoConfigId: [this.configuracion[0].iEstadoConfigId], //tabla acad.configuraciones Control para estado
                cConfigNroRslAprobacion: [
                    this.configuracion[0].cConfigNroRslAprobacion,
                    Validators.required,
                ], // tabla acad.configuraciones
                cConfigUrlRslAprobacion: [
                    this.configuracion[0].cConfigUrlRslAprobacion,
                ], // tabla acad.configuraciones

                iSedeId: [this.configuracion[0].iSedeId], // tabla acad.configuraciones (session)
                bConfigEsBilingue: [
                    this.configuracion[0].bConfigEsBilingue,
                    Validators.required,
                ], // tabla acad.configuraciones
                cNivelTipoNombre: [this.configuracion[0].cNivelTipoNombre],
                cYAcadNombre: [this.configuracion[0].cYAcadNombre],
                iProgId: [this.configuracion[0].iProgId],
            })
        } catch (error) {
            console.error('Error initializing form:', error)
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
        if (
            !this.configuracion[0].cConfigUrlRslAprobacion ||
            this.configuracion[0].cConfigUrlRslAprobacion.trim() === ''
        ) {
            this.enlace = ''
        } else {
            this.enlace =
                url + '/' + this.configuracion[0].cConfigUrlRslAprobacion
        }

        // this.getServicioAtencion()
    }

    mensajeInformativo() {
        const option = Number(this.configuracion[0].iEstado)
        let title: string
        if (option === 0) {
            title = 'Registro nuevo'
            this.btnNuevo = true
        } else {
            title = 'Editar registro'
            this.btnNuevo = false
        }

        this._confirmService.openConfiSave({
            message: '¿Está seguro de que desea configurar los ambientes?',
            header: title,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Acción a realizar al confirmar
                console.log('Eliminado')
            },
            reject: () => {
                // Acción a realizar al rechazar

                this.router.navigate([
                    '/gestion-institucional/configGradoSeccion',
                ])
            },
        })
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        console.log(this.filesUrl, 'files URL')
        switch (accion) {
            case 'close-modal':
                // this.accionBtnItem.emit({ accion, item })
                break

            case 'subir-file-configuracion-iiee':
                const url = this.query.baseUrlPublic()
                if (this.filesUrl.length < 1) {
                    console.log(item)
                    this.filesUrl.push({
                        type: 1, //1->file
                        nameType: 'file',
                        name: item.file.name,
                        size: item.file.size,
                        ruta: item.name,
                    })

                    this.form
                        .get('cConfigUrlRslAprobacion')
                        ?.setValue(this.filesUrl[0].ruta)

                    this.enlace = url + '/' + this.filesUrl[0].ruta
                } else {
                    alert('No puede subir mas de un archivo')
                }
                console.log(this.filesUrl, 'subir-file-configuracion-iiee')

                break
        }
    }

    onUpload(event: UploadEvent) {
        for (const file of event.files) {
            this.uploadedFiles.push(file)
        }

        this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: '',
        })
    }

    accionBtnItemTable({ accion, item }) {
        this.event = item
        if (accion === 'retornar') {
            this._confirmService.openConfiSave({
                message: '¿Estás seguro de que deseas guardar y continuar?',
                header: 'Advertencia de autoguardado',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Acción para eliminar el registro
                    this.router.navigate([
                        '/gestion-institucional/configGradoSeccion',
                    ])
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Acción cancelada',
                    })
                },
            })
        }
    }
    /* getServicioAtencion() {
        //alert(this.configuracion[0].iNivelTipoId)
        if (Number(this.configuracion[0].iNivelTipoId) > 0) {
            const where = 'iNivelTipoId =' + this.configuracion[0].iNivelTipoId

            this.query
                .searchCalAcademico({
                    esquema: 'acad',
                    tabla: 'servicio_educativos',
                    campos: 'iServEdId, iNivelTipoId,cServEdNombre',
                    condicion: where,
                })
                .subscribe({
                    next: (data: any) => {
                        this.serv_atencion = data.data
                        this.iServId = this.serv_atencion[0].iServEdId
                        this.form.controls['iServEdId'].setValue(
                            this.serv_atencion[0].iServEdId
                        )
                        console.log(this.serv_atencion)
                    },
                    error: (error) => {
                        console.error(
                            'Error fetching Servicios de Atención:',
                            error
                        )
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        } else {
            alert(
                'Deben registrar el Tipo de de Nivel en los registros de la Institución Educatica'
            )
        }
    }
*/
    confirmar() {
        this._confirmService.openConfiSave({
            message: '¿Está seguro de que desea eliminar este elemento?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Acción a realizar al confirmar
                console.log('Eliminado')
            },
            reject: () => {
                // Acción a realizar al rechazar
                console.log('Acción cancelada')
            },
        })
    }

    confirm() {
        this._confirmService.openConfiSave({
            message: '¿Estás seguro de que deseas guardar y continuar?',
            header: 'Advertencia de autoguardado',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Acción para eliminar el registro
                this.actualizar()
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })

        // this.router.navigate(['/gestion-institucional/ambiente'])
    }

    actualizar() {
        if (this.form.valid) {
            this.query
                .addAmbienteAcademico({
                    json: JSON.stringify(this.form.value),
                    _opcion: 'addConfig',
                })
                .subscribe({
                    next: (data: any) => {
                        console.log(data, 'id', data.data[0].id)

                        this.form.get('iConfigId')?.setValue(data.data[0].id)
                        this.configuracion[0] = this.form.getRawValue()
                        this.stepService.configuracion[0] =
                            this.configuracion[0]
                    },
                    error: (error) => {
                        console.error('Error fetching configuración:', error)
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Mensaje',
                            detail: 'Error. No se proceso petición ',
                        })
                    },
                    complete: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Mensaje',
                            detail: 'Proceso exitoso',
                        })
                        console.log('Request completed')
                        this.router.navigate([
                            '/gestion-institucional/ambiente',
                        ])
                    },
                })
        } else {
            console.log('Formulario no válido', this.form.invalid)
        }
    }

    accionBtnItem(accion) {
        if (accion === 'guardar') {
            this.actualizar()
        }
    }
    handleActions(actions) {
        console.log(actions)
    }
    accionesPrincipal: IActionContainer[] = [
        // {
        //     labelTooltip: 'Crear Ambiente',
        //     text: 'Crear ambientes',
        //     icon: 'pi pi-plus',
        //     accion: 'agregar',
        //     class: 'p-button-primary',
        // },
        {
            labelTooltip: 'Retornar',
            text: 'Retornar',
            icon: 'pi pi-arrow-circle-left',
            accion: 'retornar',
            class: 'p-button-warning',
        },
    ]
}
