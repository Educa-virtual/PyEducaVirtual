import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { DatosEncuestaService } from '../../services/datos-encuesta.service'
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MenuItem, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-encuesta-respuestas',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './encuesta-respuestas.component.html',
    styleUrl: './../../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaRespuestasComponent implements OnInit {
    iEncuId: number
    cEncuNombre: string
    perfil: any
    respuestas: Array<object>
    respuestas_filtradas: Array<object>

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    private _messageService = inject(MessageService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private datosEncuestas: DatosEncuestaService,
        private funcionesBienestar: FuncionesBienestarService,
        private store: LocalStoreService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.route.paramMap.subscribe((params: any) => {
            this.iEncuId = params.params.id || 0
        })
        this.breadCrumbItems = [
            {
                label: 'Gestionar encuestas',
                routerLink: '/bienestar/gestionar-encuestas',
            },
            {
                label: 'Encuesta',
                routerLink: `/bienestar/encuesta/${this.iEncuId}`,
            },
            {
                label: 'Respuestas',
            },
        ]
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    ngOnInit(): void {
        if (this.iEncuId) {
            this.verEncuesta()
            this.listarRespuestas()
        }
    }

    verEncuesta() {
        this.datosEncuestas
            .verEncuesta({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: this.iEncuId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.cEncuNombre = data.data[0].cEncuNombre
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    listarRespuestas() {
        this.datosEncuestas
            .listarRespuestas({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: this.iEncuId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.respuestas = data.data
                        this.respuestas_filtradas = this.respuestas
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo respuestas:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    accionBnt({ accion, item }) {
        switch (accion) {
            case 'ver':
                this.router.navigate([
                    `/bienestar/encuesta/${this.iEncuId}/ver/${item.iMatrId}`,
                ])
                break
            default:
                console.warn('Acción no reconocida:', accion)
        }
    }

    public columnasTabla: IColumn[] = [
        {
            field: 'item',
            type: 'item',
            width: '10%',
            header: 'N°',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'dRptaUltimaFecha',
            type: 'date',
            width: '15%',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombreApellidos',
            type: 'text',
            width: '45%',
            header: 'Estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cGradoNombre',
            type: 'text',
            width: '10%',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cSeccionNombre',
            type: 'text',
            width: '10%',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cIieeCodigoModular',
            type: 'text',
            width: '10%',
            header: 'I.E.',
            text_header: 'center',
            text: 'center',
        },
        {
            field: '',
            type: 'actions',
            width: '10%',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Ver respuesta',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]
}
