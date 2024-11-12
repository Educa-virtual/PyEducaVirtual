import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { Message } from 'primeng/api'
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'
import { FormActividadesNoLectivasComponent } from './components/form-actividades-no-lectivas/form-actividades-no-lectivas.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-actividades-no-lectivas',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        FormActividadesNoLectivasComponent,
    ],
    templateUrl: './actividades-no-lectivas.component.html',
    styleUrl: './actividades-no-lectivas.component.scss',
})
export class ActividadesNoLectivasComponent implements OnInit {
    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _LocalStoreService = inject(LocalStoreService)

    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá visualizar sus actividades no lectivas como también gestionar y subir evidencias.',
        },
    ]
    date = new Date()
    showModal: boolean = false

    actions = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'actualizar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    data = []
    tiposCargaNoLectivas = []
    item = []
    titulo: string = ''
    opcion: string = ''

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Nº',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'cSemAcadNombre',
            header: 'Semestre Académico',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cTipoCargaNoLectNombre',
            header: 'Nombre de la Actividad',
            text_header: 'justify',
            text: 'justify',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'nDetCargaNoLectHoras',
            header: 'Duración Horas',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'list_json_file',
            width: '8rem',
            field: 'cDetCargaNoLectEvidencias',
            header: 'Evidencias',
            text_header: 'center',
            text: 'justify',
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

    ngOnInit() {
        !this.tiposCargaNoLectivas.length
            ? this.obtenerTiposCargaNoLectivas()
            : null
        this.obtenerCargaNoLectivas()
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
            case 'agregar':
            case 'actualizar':
                this.showModal = true
                this.item = item
                this.titulo =
                    accion === 'agregar'
                        ? 'AGREGAR CARGA NO LECTIVA'
                        : 'ACTUALIZAR CARGA NO LECTIVA'
                this.opcion = accion === 'agregar' ? 'GUARDAR' : 'ACTUALIZAR'
                break
            case 'eliminar':
                this._ConfirmationModalService.openConfirm({
                    header:
                        '¿Esta seguro de eliminar la carga no lectiva ' +
                        item['cTipoCargaNoLectNombre'] +
                        ' ?',
                    accept: () => {
                        this.eliminarDetalleCargaNoLectivas(item)
                    },
                })
                break
            case 'GUARDAR':
            case 'ACTUALIZAR':
                this.showModal = false
                this.GuardarActualizarDetalleCargaNoLectivas(item)
                break
            case 'store-carga-no-lectivas':
            case 'update-carga-no-lectivas':
            case 'update-detalle-carga-no-lectivas':
                this.obtenerCargaNoLectivas()
                break
            case 'list-carga-no-lectivas':
                this.data = item
                this.data.forEach((i) => {
                    i.cDetCargaNoLectEvidencias = i.cDetCargaNoLectEvidencias
                        ? JSON.parse(i.cDetCargaNoLectEvidencias)
                        : []
                })
                break
            case 'list-tipos-carga-no-lectivas':
                this.tiposCargaNoLectivas = item
                break
            case 'delete-detalle-carga-no-lectivas':
                this.obtenerCargaNoLectivas()
                break
        }
    }

    obtenerTiposCargaNoLectivas() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'tipos-carga-no-lectivas',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR',
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.ruta + '-' + params.prefix)
    }
    obtenerCargaNoLectivas() {
        const iYearId = this._LocalStoreService.getItem('dremoYear')
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'carga-no-lectivas',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiDocenteIdxiYearId',
                iDocenteId: this._ConstantesService.iDocenteId,
                valorBusqueda: iYearId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.ruta + '-' + params.prefix)
    }
    GuardarActualizarDetalleCargaNoLectivas(item) {
        const iYearId = this._LocalStoreService.getItem('dremoYear')
        item.iDocenteId = this._ConstantesService.iDocenteId
        item.valorBusqueda = iYearId
        const ruta = item.opcion === 'GUARDAR' ? 'store' : 'update'
        const prefix =
            item.opcion === 'GUARDAR'
                ? 'carga-no-lectivas'
                : 'detalle-carga-no-lectivas'
        item.opcion =
            item.opcion === 'GUARDAR'
                ? item.opcion + 'xDetalleCargaNoLectiva'
                : item.opcion + 'xiDetCargaNoLectId'
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: prefix,
            ruta: ruta,
            data: item,
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.ruta + '-' + params.prefix)
    }

    eliminarDetalleCargaNoLectivas(item) {
        item.opcion = 'ELIMINARxiDetCargaNoLectId'
        item.cDetCargaNoLectEvidencias = item.cDetCargaNoLectEvidencias
            ? JSON.stringify(item.cDetCargaNoLectEvidencias)
            : null
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'detalle-carga-no-lectivas',
            ruta: 'delete',
            data: item,
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.ruta + '-' + params.prefix)
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
}
