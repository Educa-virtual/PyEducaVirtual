import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, Input } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { TabViewModule } from 'primeng/tabview'
import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { provideIcons } from '@ng-icons/core'
import { TableModule } from 'primeng/table'
//import para el select
import { DropdownModule } from 'primeng/dropdown'
import { InputGroupModule } from 'primeng/inputgroup'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import {
    ContainerPageAccionbComponent,
    IActionContainer,
} from './container-page-accionb/container-page-accionb.component'
//El buscar
import { InputTextModule } from 'primeng/inputtext'
import { InputIconModule } from 'primeng/inputicon'
import { IconFieldModule } from 'primeng/iconfield'
import { ButtonModule } from 'primeng/button'
// nueva importaciones:
import { OrderListModule } from 'primeng/orderlist'
import { ApiAulaService } from '../../aula-virtual/services/api-aula.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { EditorModule } from 'primeng/editor'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { CursoDetalleComponent } from '../../aula-virtual/sub-modulos/cursos/curso-detalle/curso-detalle.component'
import { ActivatedRoute } from '@angular/router'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Message, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
@Component({
    selector: 'app-informes',
    standalone: true,
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss'],
    imports: [
        ContainerPageComponent,
        ToastModule,
        CommonModule,
        EditorModule,
        TabViewModule,
        IconComponent,
        TableModule,
        DropdownModule,
        InputGroupModule,
        CommonInputComponent,
        InputGroupAddonModule,
        ContainerPageAccionbComponent,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        ButtonModule,
        OrderListModule,
        RemoveHTMLPipe,
        TablePrimengComponent,
        CursoDetalleComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class InformesComponent implements OnInit {
    private _aulaService = inject(ApiAulaService)
    private _formBuilder = inject(FormBuilder)
    private _confirmService = inject(ConfirmationModalService)

    @Input() actionses: IActionContainer[] = [
        {
            labelTooltip: 'Descargar Pdf',
            text: 'Reporte  Pdf',
            icon: 'pi pi-file-pdf',
            accion: 'descargar_pdf',
            class: 'p-button-danger',
        },
    ]
    idDocCursoId: any[] = []
    perfil: any[] = []
    curso: any[] = []
    notaEstudianteSelect: any[] = []
    descripcionFinalDeLogro: string
    estudianteSelect: any[] = []
    messages: Message[] | undefined

    public estudianteMatriculadosxGrado = []

    public conclusionDescrpFinal: FormGroup = this._formBuilder.group({
        conclusionDescripFinal: ['', [Validators.required]],
    })

    constructor(
        private store: LocalStoreService,
        private _activatedRoute: ActivatedRoute,
        private messageService: MessageService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        //para obtener el idDocCursoId
        this.idDocCursoId =
            this._activatedRoute.snapshot.queryParams['idDocCursoId']
    }
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cCursoNombre',
            header: 'Área Curricular',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iCalifIdPeriodo1',
            header: 'TRIM 01',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iCalifIdPeriodo2',
            header: 'TRIM 02',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iCalifIdPeriodo3',
            header: 'TRIM 03',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iPromedio',
            header: 'Promedio Final',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cDetMatConclusionDescPromedio',
            header: 'Conclusión descriptiva',
            text_header: 'center',
            text: 'center',
        },
        // {
        //     type: 'actions',
        //     width: '1rem',
        //     field: '',
        //     header: 'Acciones',
        //     text_header: 'center',
        //     text: 'center',
        // },
    ]
    ngOnInit() {
        this.obtenerEstudianteXCurso()
    }
    //un load para el boton guardar
    loading: boolean = false
    load() {
        this.loading = true

        setTimeout(() => {
            this.loading = false
        }, 2000)
    }
    //Obtener datos del estudiantes y sus logros alcanzados x cursos
    obtenerEstudianteXCurso() {
        // @iSedeId INT,
        // @iSeccionId INT,
        // @iYAcadId INT,
        // @iNivelGradoId INT
        const iSedeId = this.perfil['iSedeId']
        console.log(iSedeId)
        this._aulaService
            .generarReporteDeLogroFinalDeYear({
                iSedeId: iSedeId,
            })
            .subscribe((data) => {
                // const registro = data['data']
                // this.curso = JSON.parse(registro.json_cursos);
                this.estudianteMatriculadosxGrado = data['data']
                console.log(this.estudianteMatriculadosxGrado)
            })
    }
    obtenerCursoEstudiante(estudiante) {
        this.notaEstudianteSelect = estudiante.Estudiante
        this.descripcionFinalDeLogro = estudiante.cMatrConclusionDescriptiva
        this.conclusionDescrpFinal.controls['conclusionDescripFinal'].setValue(
            this.descripcionFinalDeLogro
        )
        console.log('decrip', this.descripcionFinalDeLogro)
        this.estudianteSelect = estudiante
        const id = estudiante.iEstudianteId
        const filteredData = this.estudianteMatriculadosxGrado.filter(
            (item) => item.iEstudianteId === id
        )
        this.curso = JSON.parse(filteredData[0].json_cursos)
        console.log('datos de estudiante', this.curso, this.estudianteSelect)
    }
    // metodo para la accion switch para descargar
    accionDescargar({ accion }): void {
        switch (accion) {
            case 'descargar_pdf':
                this.generarReporteDeLogrosAlcanzadosXYear()
                //console.log('Descargar pdf')
                break
            case 'Descargar_Excel':
                console.log('Descargar excel')
                break
        }
    }
    // metodo para descargar el reporte de logros alcanzados durante el año en pdf
    generarReporteDeLogrosAlcanzadosXYear() {
        //console.log(this.curso, this.estudianteSelect)
        const datosEstudiante = JSON.stringify(this.estudianteSelect)
        const datosCursoEstudiante = JSON.stringify(this.curso)
        const nombre = this.estudianteSelect['Estudiante']
        const iSedeId = this.perfil['iSedeId']
        if (!this.estudianteSelect || this.estudianteSelect.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione un estudiante para generar el reporte de logros :',
            })
        } else {
            this._confirmService.openConfiSave({
                message: 'Recuerde que son datos de ayuda',
                header: `¿Esta seguro de descargar en PDF el nivel de logro de: ${nombre} ?`,
                accept: () => {
                    this._aulaService
                        .generarReporteDeLogrosAlcanzadosXYear({
                            iSedeId: iSedeId,
                            datosEstudiante: datosEstudiante,
                            datosCursoEstudiante: datosCursoEstudiante,
                        })
                        .subscribe((response) => {
                            //console.log('Respuesta de Evaluacion:', response) // Para depuración
                            // Crear un Blob con la respuesta del backend
                            const blob = response as Blob // Asegúrate de que la respuesta sea un Blob
                            const link = document.createElement('a')
                            //console.log('imprimer01', blob)
                            link.href = URL.createObjectURL(blob)
                            link.download = 'Reporte_logros' + '.pdf' // Nombre del archivo descargado
                            link.click()
                        })
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
    // metodo para limpiar las etiquetas
    limpiarHTML(html: string): string {
        const temporal = document.createElement('div') // Crear un div temporal
        temporal.innerHTML = html // Insertar el HTML
        return temporal.textContent || '' // Obtener solo el texto
    }
    //guardar conclusion descriptiva final de año
    guardarPromedioDeLogroAlcanzado() {
        const conclusionDescrp = this.conclusionDescrpFinal.value
        const nombre = this.estudianteSelect['Estudiante']
        const conclusionDescrpLimpia = this.limpiarHTML(
            conclusionDescrp.conclusionDescripFinal
        )

        if (!this.estudianteSelect || this.estudianteSelect.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione un estudiante:',
            })
        } else {
            const idMtricula = this.estudianteSelect['iMatrId']
            const where = [
                {
                    COLUMN_NAME: 'iMatrId',
                    VALUE: idMtricula,
                },
            ]

            const registro: any = {
                cMatrConclusionDescriptiva: conclusionDescrpLimpia,
            }
            if (conclusionDescrpLimpia == '') {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Tiene que agregar una conclusión descriptiva final',
                })
            } else {
                this._confirmService.openConfiSave({
                    message: 'Recuerde que no podra retroceder',
                    header: `¿Esta seguro que desea guardar conclusión descriptiva a: ${nombre} ?`,
                    accept: () => {
                        this._aulaService
                            .guardarCalificacionEstudiante(
                                'acad',
                                'matricula',
                                where,
                                registro
                            )
                            .subscribe({
                                next: (response) => {
                                    //this.obtenerReporteDenotasFinales()
                                    //this.mostrarModalConclusionDesc = false
                                    console.log('actualizar:', response)
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: 'Calificación guardada correctamente.',
                                    })
                                },
                                error: (error) => {
                                    console.log(
                                        'Error en la actualización:',
                                        error
                                    )
                                },
                            })
                        this.conclusionDescrpFinal.reset()
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
    }
}
