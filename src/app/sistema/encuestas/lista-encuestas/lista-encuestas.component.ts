import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import { MessageService } from 'primeng/api'
import { ActivatedRoute } from '@angular/router'
import { CategoriasService } from '../services/categorias.service'
import { EncuestasService } from '../services/encuestas.services'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
//import { GestionEncuestaConfiguracionComponent } from './gestion-encuesta-configuracion/gestion-encuesta-configuracion.component'
@Component({
    selector: 'app-lista-encuestas',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './lista-encuestas.component.html',
    styleUrl: './lista-encuestas.component.scss',
})
export class ListaEncuestasComponent implements OnInit {
    //titleListaEncuestas: string = 'Censo DRE/UGEL'
    iCategoriaEncuestaIdHashed: string = ''
    categoria: any = null
    selectedItem: any
    mostrarDialogoConfiguracion: boolean = false
    mostrarDialogoAccesoEncuesta: boolean = false
    columns = []

    constructor(
        private messageService: MessageService,
        private categoriasService: CategoriasService,
        private encuestasService: EncuestasService,
        private confirmService: ConfirmationModalService,
        private route: ActivatedRoute
    ) {}

    /*dataEncuestas = [
        {
            item: 1,
            iCategoriaId: 1,
            cTituloEncuesta: 'Evaluación de Satisfacción Académica',
            cTiempo: '15 min',
            dtFechaInicio: new Date('2025-06-15'),
            dtFechaFin: new Date('2025-06-30'),
        },
    ]*/
    dataEncuestas: any[] = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Ver encuesta',
            icon: 'pi pi-user-plus',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Editar encuesta',
            icon: 'pi pi-pen-to-square',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar encuesta',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    ngOnInit() {
        this.columns = [
            {
                type: 'item',
                width: '1rem',
                field: 'item',
                header: '#',
                text_header: 'center',
                text: 'center',
            },
            {
                type: 'text',
                width: '8rem',
                field: 'cConfEncNombre',
                header: 'Título de encuesta',
                text_header: 'center',
                text: 'left',
            },
            {
                type: 'text',
                width: '2rem',
                field: 'cTiemDurNombre',
                header: 'Tiempo',
                text_header: 'center',
                text: 'center',
            },
            {
                type: 'date',
                width: '3rem',
                field: 'dConfEncInicio',
                header: 'Fecha inicio',
                text_header: 'center',
                text: 'center',
            },
            {
                type: 'date',
                width: '3rem',
                field: 'dConfEncFin',
                header: 'Fecha fin',
                text_header: 'center',
                text: 'center',
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
        this.route.params.subscribe((params) => {
            this.iCategoriaEncuestaIdHashed = params['iCategoriaEncuestaId']
        })
        this.obtenerDetallesCategoria()
        this.obtenerListaEncuestasPorCategoria()
    }

    obtenerDetallesCategoria() {
        this.categoriasService
            .obtenerDetallesCategoria(this.iCategoriaEncuestaIdHashed)
            .subscribe({
                next: (resp: any) => {
                    this.categoria = resp.data
                },
                error: (error) => {
                    console.error(
                        'Error obteniendo detalles de la categoría:',
                        error
                    )
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    obtenerListaEncuestasPorCategoria() {
        this.encuestasService
            .obtenerEncuestasPorCategoria(this.iCategoriaEncuestaIdHashed)
            .subscribe({
                next: (resp: any) => {
                    this.dataEncuestas = resp.data
                },
                error: (error) => {
                    console.error('Error obteniendo lista de encuestas:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    accionBtnItemTable({ accion, item }) {
        this.selectedItem = item
        switch (accion) {
            case 'ver':
                this.verEncuesta()
                this.abrirDialogoAccesoEncuesta()
                break
            case 'editar':
                this.editarEncuesta()
                break
            case 'eliminar':
                this.eliminarEncuesta()
                break
        }
    }

    verEncuesta() {
        console.log('Ver encuesta:', this.selectedItem)
        this.messageService.add({
            severity: 'info',
            summary: 'Ver encuesta',
            detail: `Viendo encuesta: ${this.selectedItem.cTituloEncuesta}`,
        })
    }

    editarEncuesta() {
        console.log('Editar encuesta:', this.selectedItem)
        this.messageService.add({
            severity: 'info',
            summary: 'Editar encuesta',
            detail: `Editando encuesta: ${this.selectedItem.cTituloEncuesta}`,
        })
    }

    eliminarEncuesta() {
        this.confirmService.openConfirm({
            header:
                '¿Está seguro de eliminar la encuesta ' +
                this.selectedItem.cConfEncNombre +
                ' ?',
            accept: () => {
                /*const params = {
                    petition: 'delete',
                    group: 'cap',
                    prefix: 'instructores',
                    ruta: data.iInstId,
                    params: {
                        iCredId: this._constantesService.iCredId,
                    },
                }
                // Servicio para obtener los instructores
                this.GeneralService.getGralPrefixx(params).subscribe({
                    next: (resp) => {
                        if (resp.validated) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Acción exitosa',
                                detail: resp.message,
                            })
                            this.obtenerInstructores()
                        }
                    },
                })*/
            },
        })
        console.log('Eliminar encuesta:', this.selectedItem)
        // Aquí agregas tu lógica para eliminar la encuesta
        /*this.messageService.add({
            severity: 'warn',
            summary: 'Eliminar encuesta',
            detail: `Eliminando encuesta: ${this.selectedItem.cTituloEncuesta}`,
        })*/
    }

    abrirDialogoConfiguracion() {
        this.mostrarDialogoConfiguracion = true
    }

    cerrarDialogoConfiguracion() {
        this.mostrarDialogoConfiguracion = false
    }

    abrirDialogoAccesoEncuesta() {
        this.mostrarDialogoAccesoEncuesta = true
    }
    cerrarDialogoAccesoEncuesta() {
        this.mostrarDialogoAccesoEncuesta = false
    }
}
