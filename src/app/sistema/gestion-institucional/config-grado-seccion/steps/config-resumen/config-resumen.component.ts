import { Component, inject, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component'

import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
@Component({
    selector: 'app-config-resumen',
    standalone: true,
    imports: [
        StepsModule,
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
        ToolbarPrimengComponent,
    ],
    templateUrl: './config-resumen.component.html',
    styleUrl: './config-resumen.component.scss',
})
export class ConfigResumenComponent implements OnInit {
    items: MenuItem[]
    customers: any = []

    nivelesCiclos: any = []
    lista: any
    groupedData: any
    dynamicColumns: any

    r_horas: any[]
    r_secciones: any[]
    configuracion: any[]
    bConfigEsBilingue: any = 0
    totalHoras: number = 0
    totalHorasPendientes: number = 0
    total_aulas: number = 0

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private store: LocalStoreService
    ) {
        this.items = this.stepService.itemsStep
        this.configuracion = this.stepService.configuracion
    }

    ngOnInit(): void {
        try {
            this.reporteHorasNivelGrado()
            this.reporteSeccionesNivelGrado()
            this.bConfigEsBilingue =
                this.configuracion[0].bConfigEsBilingue > 0 ? 'SI' : 'NO'
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en conexion al servidor',
                detail: 'La conexion excedió tiempo de espera',
            })
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
            console.log(error, 'error de variables')
        }
    }

    //REPORTES
    reporteSeccionesNivelGrado() {
        this.query
            .reporteSeccionesNivelGrado({
                iNivelTipoId: this.configuracion[0].iNivelTipoId,
                iConfigId: this.configuracion[0].iConfigId,
            })
            .subscribe({
                next: (data: any) => {
                    this.r_secciones = data.data.map((item) => ({
                        ...item,
                        parsedSecciones: item.secciones // Parsear, ordenar y convertir a cadena las secciones
                            ? JSON.parse(item.secciones)
                                  .map((sec) => sec.cSeccionNombre)
                                  // .filter((sec, index, self) => self.indexOf(sec) === index) // Quitar duplicados
                                  .sort() // Ordenar alfabéticamente
                                  .join(', ') // Convertir a cadena separada por comas
                            : null, // Si no hay secciones, manejar como null
                    }))
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error en conexion al servidor',
                        detail: 'La conexion excedió tiempo de espera ' + error,
                    })
                },
            })
    }
    reporteHorasNivelGrado() {
        this.query
            .reporteHorasNivelGrado({
                iNivelTipoId: this.configuracion[0].iNivelTipoId,
                iProgId: this.configuracion[0].iProgId,
                iConfigId: this.configuracion[0].iConfigId,
                iYAcadId: this.configuracion[0].iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    this.total_aulas = data.data[0].registrados
                    this.r_horas = data.data
                    console.log(this.r_horas, 'this.r_horas')
                },
                error: (error) => {
                    console.error('Error procedimiento BD:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error en conexion al servidor',
                        detail: 'La conexion excedió tiempo de espera ' + error,
                    })
                },
                complete: () => {
                    const totalHoras = this.r_horas.reduce(
                        (sum, item) => sum + (Number(item.total_horas) || 0),
                        0
                    )
                    const totalHorasAsignadasPrecencial = this.r_horas.reduce(
                        (sum, item) => sum + (Number(item.suma_1) || 0),
                        0
                    )
                    const totalHorasAsignadasSemiPrecencial =
                        this.r_horas.reduce(
                            (sum, item) => sum + (Number(item.suma_2) || 0),
                            0
                        )
                    const totalHorasAsignadasDistancia = this.r_horas.reduce(
                        (sum, item) => sum + (Number(item.suma_3) || 0),
                        0
                    )
                    console.log('Request completed')
                    this.totalHoras = totalHoras
                    this.totalHorasPendientes =
                        Number(totalHoras) -
                        Number(totalHorasAsignadasPrecencial) -
                        Number(totalHorasAsignadasSemiPrecencial) -
                        Number(totalHorasAsignadasDistancia)
                },
            })
    }

    reportePDFResumenAmbientes() {
        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'gestionInstitucional',
            ruta: 'reportePDFResumenAmbientes',
            data: {
                iNivelTipoId: this.configuracion[0].iNivelTipoId,
                total_aulas: this.total_aulas,
                r_horas: this.r_horas,
                secciones: this.r_secciones,
                totalHoras: this.totalHoras,
                bConfigEsBilingue: this.bConfigEsBilingue,
                totalHorasPendientes: this.totalHorasPendientes,
            },
        }
        this.query.generarPdf(params).subscribe({
            next: (response) => {
                const blob = new Blob([response], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'archivo.pdf'
                a.click()
                window.URL.revokeObjectURL(url)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
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

    accionBtnItemTable({ accion, item }) {
        if (accion === 'reporte') {
            this.reportePDFResumenAmbientes()
            console.log(item, 'btnTable')
        }
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'generar resumen',
            text: 'Generar resumen',
            icon: 'pi pi-file-pdf',
            accion: 'reporte',
            class: 'p-button-danger',
        },
    ]
    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]
    columnSeccion = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '7rem',
            field: 'cNivelTipoNombre',
            header: 'Nivel',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'grado',
            header: 'Grado/ Edades',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'parsedSecciones',
            header: 'Secciones',
            text_header: 'center',
            text: 'left',
        },
    ]

    columnHora = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '7rem',
            field: 'cCursoNombre',
            header: 'Area curricular',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nCursoTotalHoras',
            header: 'Hrs lectivas',
            text_header: 'center',
            text: 'left',
        },

        {
            type: 'text',
            width: '10rem',
            field: 'registrados',
            header: 'Total Hrs lectivas',
            text_header: 'N° secciones',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'suma_1',
            header: 'Hrs Asignadas Presencial',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'suma_2',
            header: 'Hrs Asignadas Semi-Presencial',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'suma_3',
            header: 'Hrs Asignadas Distancia',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'total_horas',
            header: 'Total para asignar',
            text_header: 'center',
            text: 'left',
        },
    ]
}
