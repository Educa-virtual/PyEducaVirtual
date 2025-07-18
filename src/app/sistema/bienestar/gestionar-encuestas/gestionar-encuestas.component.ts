import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { PanelModule } from 'primeng/panel'
import { EncuestaComponent } from '../encuesta/encuesta.component'
import { DatosEncuestaService } from '../services/datos-encuesta.service'
import { MenuItem, MessageService } from 'primeng/api'
import { Router } from '@angular/router'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    DIRECTOR_IE,
    SUBDIRECTOR_IE,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
} from '@/app/servicios/perfilesConstantes'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'

@Component({
    selector: 'app-gestionar-encuestas',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
        EncuestaComponent,
        NoDataComponent,
    ],
    templateUrl: './gestionar-encuestas.component.html',
    styleUrl: './gestionar-encuestas.component.scss',
})
export class GestionarEncuestasComponent implements OnInit {
    @ViewChild('filtro') filtro: ElementRef
    encuestas: Array<any> = []
    encuestas_filtradas: Array<object> = []
    searchForm: FormGroup
    categorias: Array<object>
    dialog_visible: boolean = false
    dialog_header: string = 'Registrar Notificacion'

    perfil: any
    iYAcadId: number

    puede_editar: boolean = false
    puede_ver_respuestas: boolean = false
    puede_ver_resumen: boolean = false

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    perfil_permitido: boolean = false
    perfiles_permitido: Array<number> = [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
    ]

    private _messageService = inject(MessageService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private datosEncuestas: DatosEncuestaService,
        private router: Router
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.breadCrumbItems = [
            {
                label: 'Gestionar encuestas',
            },
        ]
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    ngOnInit(): void {
        this.perfil_permitido = this.perfiles_permitido.includes(
            +this.perfil.iPerfilId
        )
        this.listarEncuestas()
        if (this.perfil_permitido) {
            this.datosEncuestas
                .getEncuestaParametros({
                    iCredEntPerfId: this.perfil.iCredEntPerfId,
                })
                .subscribe((data: any) => {
                    this.categorias = this.datosEncuestas.getCategorias(
                        data?.categorias
                    )
                })
        }
    }

    agregarEncuesta() {
        this.router.navigate(['/bienestar/encuesta'])
    }

    listarEncuestas() {
        this.datosEncuestas
            .listarEncuestas({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.encuestas = data.data
                        this.encuestas_filtradas = this.encuestas
                    } else {
                        this.encuestas = null
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo encuestas:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    dialogVisible(event: any) {
        return this.dialog_visible == event.value
    }

    filtrarEncuestas() {
        const filtro = this.filtro.nativeElement.value
        this.encuestas_filtradas = this.encuestas.filter((encuesta: any) => {
            if (
                encuesta.cEncuNombre
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.cEncuCateNombre
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.cEstadoNombre
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.dEncuDesde.toLowerCase().includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.dEncuHasta.toLowerCase().includes(filtro.toLowerCase())
            )
                return encuesta
            return null
        })
    }

    borrarEncuesta(item) {
        this.datosEncuestas
            .borrarEncuesta({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: item.iEncuId,
            })
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Eliminación exitosa',
                        detail: 'Se eliminó la encuesta',
                    })
                    this.encuestas_filtradas = this.encuestas_filtradas.filter(
                        (encuesta: any) => item.iEncuId != encuesta.iEncuId
                    )
                },
                error: (error) => {
                    console.error('Error eliminando encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    actualizarEncuestaEstado(item) {
        this.datosEncuestas
            .actualizarEncuestaEstado({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: item.iEncuId,
                iEstado: 3,
            })
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizó la encuesta',
                    })
                    this.listarEncuestas()
                },
                error: (error) => {
                    console.error('Error actualizando encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    responderEncuesta(item) {
        this.router.navigate([`/bienestar/encuesta/${item.iEncuId}/ver`])
    }

    accionBnt({ accion, item }) {
        switch (accion) {
            case 'editar':
                this.router.navigate([`/bienestar/encuesta/${item.iEncuId}`])
                break
            case 'preguntas':
                this.router.navigate([
                    `/bienestar/encuesta/${item.iEncuId}/preguntas`,
                ])
                break
            case 'eliminar':
                this._confirmService.openConfirm({
                    message: '¿Está seguro de eliminar la encuesta?',
                    header: 'Confirmación',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.borrarEncuesta(item)
                    },
                    reject: () => {},
                })
                break
            case 'aprobar':
                this._confirmService.openConfirm({
                    message: '¿Está seguro de aprobar la encuesta?',
                    header: 'Confirmación',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.actualizarEncuestaEstado(item)
                    },
                    reject: () => {},
                })
                break
            case 'respuestas':
                this.router.navigate([
                    `/bienestar/encuesta/${item.iEncuId}/respuestas`,
                ])
                break
            case 'resumen':
                this.router.navigate([
                    `/bienestar/encuesta/${item.iEncuId}/resumen`,
                ])
                break
            default:
                console.warn('Acción no reconocida:', accion)
        }
    }

    public columnasTabla: IColumn[] = [
        {
            field: 'dEncuDesde',
            type: 'date',
            width: '10%',
            header: 'Desde',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'dEncuHasta',
            type: 'date',
            width: '10%',
            header: 'Hasta',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cEncuCateNombre',
            type: 'text',
            width: '20%',
            header: 'Categoría',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cEncuNombre',
            type: 'text',
            width: '30%',
            header: 'Encuesta',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cEstadoNombre',
            type: 'text',
            width: '10%',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '20%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            isVisible: (rowData: any) => {
                return (
                    rowData.iEstado != this.datosEncuestas.ESTADO_APROBADA &&
                    rowData.puede_editar
                )
            },
        },
        {
            labelTooltip: 'Ver Preguntas',
            icon: 'pi pi-question',
            accion: 'preguntas',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Aprobar',
            icon: 'pi pi-check',
            accion: 'aprobar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            isVisible: (rowData: any) => {
                return (
                    rowData.iEstado == this.datosEncuestas.ESTADO_TERMINADA &&
                    rowData.puede_aprobar
                )
            },
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: (rowData: any) => {
                return (
                    rowData.iEstado == this.datosEncuestas.ESTADO_BORRADOR &&
                    rowData.puede_editar
                )
            },
        },
        {
            labelTooltip: 'Ver respuestas',
            icon: 'pi pi-users',
            accion: 'respuestas',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            isVisible: (rowData: any) => {
                return (
                    rowData.iEstado == this.datosEncuestas.ESTADO_APROBADA &&
                    rowData.puede_ver_respuestas
                )
            },
        },
        {
            labelTooltip: 'Ver resumen',
            icon: 'pi pi-chart-pie',
            accion: 'resumen',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            isVisible: (rowData: any) => {
                return (
                    rowData.iEstado == this.datosEncuestas.ESTADO_APROBADA &&
                    rowData.puede_ver_resumen
                )
            },
        },
    ]
}
