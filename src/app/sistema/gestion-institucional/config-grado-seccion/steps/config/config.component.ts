import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Component, OnInit } from '@angular/core'

import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'

import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { StepsModule } from 'primeng/steps'
import { ButtonModule } from 'primeng/button'
import { RadioButtonModule } from 'primeng/radiobutton'

import { FileUploadModule } from 'primeng/fileupload'
import { CommonModule } from '@angular/common'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { HttpEvent } from '@angular/common/http'
import { GeneralService } from '@/app/servicios/general.service'

interface UploadEvent {
    originalEvent: HttpEvent<any> | Event
    files: File[]
}

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DialogModule,
        StepsModule,
        ButtonModule,
        InputNumberModule,
        DropdownModule,
        FloatLabelModule,
        InputTextModule,
        ContainerPageComponent,
        FileUploadModule,
        ToastModule,
        CommonModule,
        RadioButtonModule,
    ],
    providers: [MessageService],
    templateUrl: './config.component.html',
    styleUrl: './config.component.scss',
})
export class ConfigComponent implements OnInit {
    form: FormGroup

    items: MenuItem[]
    perfil: any[] // almacenar variables locales
    sede: any[]
    opcion: string
    iSedeId: number
    uploadedFiles: any[] = []
    iServId: number
    configTipo: any[]
    event: []

    serv_atencion: {
        iServEdId: number
        iNivelTipoId: number
        cServEdNombre: string
    }[]
    configuracion: any = {}

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
            })
        } catch (error) {
            console.error('Error initializing form:', error)
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }

        this.getServicioAtencion()
        // this.form
        //     .get('iModalServId')
        //     ?.setValue(this.stepService.perfil['cNivelNombre'])
        // this.form
        //     .get('cNivelTipoNombre')
        //     ?.setValue(this.stepService.perfil['cNivelTipoNombre'])
        // this.form.get('iNivelTipoId')?.setValue(this.perfil['iNivelTipoId'])
        // this.form.get('cYAcadNombre')?.setValue(this.sede[0].cYAcadNombre)
        // this.form.get('iYAcadId')?.setValue(this.sede[0].iYAcadId)
        // this.form.get('iSedeId')?.setValue(this.sede[0].iSedeId)
        // this.form.get('cModalServId')?.setValue(this.perfil['cNivelNombre'])
        // console.log(this.configuracion, 'configuracion_')
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
            alert('Desea retornar')
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }
    getServicioAtencion() {
        if (<number>this.perfil['iNivelTipoId'] > 0) {
            const where =
                'iNivelTipoId =' + this.stepService.perfil['iNivelTipoId']

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

    accionBtnItem(accion) {
        if (accion === 'guardar') {
            if (this.form.valid) {
                console.log(this.form.value)
                //ALMACENAR LA INFORMACION
                console.log(this.form)
                this.query
                    .addAmbienteAcademico({
                        json: JSON.stringify(this.form.value),
                        _opcion: 'addConfig',
                    })
                    .subscribe({
                        next: (data: any) => {
                            console.log(data, 'id', data.data[0].id)

                            // Asegurar inicialización
                            // this.configuracion = this.configuracion || [{}]
                            // this.stepService.configuracion[0] = this.stepService
                            //     .configuracion || [{}]
                            // Actualizar valores
                            this.form
                                .get('iConfigId')
                                ?.setValue(data.data[0].id)
                            this.configuracion[0] = this.form.value
                            this.stepService.configuracion[0] =
                                this.configuracion[0]
                        },
                        error: (error) => {
                            console.error(
                                'Error fetching configuración:',
                                error
                            )
                        },
                        complete: () => {
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
            icon: 'pi pi-plus',
            accion: 'retornar',
            class: 'p-button-warning',
        },
    ]
}
