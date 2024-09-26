import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, Input, OnChanges } from '@angular/core'
import { FormMetodologiaComponent } from '../form-metodologia/form-metodologia.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { FormBuilder } from '@angular/forms'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-metodologia',
    standalone: true,
    imports: [
        TablePrimengComponent,
        FormMetodologiaComponent,
        ContainerPageComponent,
        ConfirmDialogModule,
    ],
    templateUrl: './metodologia.component.html',
    styleUrl: './metodologia.component.scss',
})
export class MetodologiaComponent implements OnChanges {
    @Input() iSilaboId: string
    @Input() tipoMetodologias: []

    constructor(
        private GeneralService: GeneralService,
        private ConstantesService: ConstantesService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}
    ngOnChanges(changes) {
        if (changes.iSilaboId?.currentValue) {
            this.iSilaboId = changes.iSilaboId.currentValue
            this.getSilabosMetodologias()
        }
    }
    showModal: boolean = false
    itemData = []
    option: string

    actionsContainer = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
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

    columns = [
        {
            type: 'text',
            width: '3rem',
            field: 'cTipoMetNombre',
            header: 'Tipo de Recurso',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cSilMetDescripcion',
            header: 'Descripción',
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

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        let params
        switch (accion) {
            case 'agregar':
            case 'actualizar':
                this.showModal = true
                this.itemData = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                break
            case 'eliminar':
                this.deleteSilaboMetodologias(item)
                break
            case 'close-modal':
                this.showModal = false
                this.itemData = item
                break
            case 'guardar':
                item.iSilaboId = this.iSilaboId
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabo-metodologias',
                    ruta: 'store',
                    data: item,
                }
                this.getInformation(params, true)

                break
            case 'modificar':
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabo-metodologias',
                    ruta: 'store',
                    data: item,
                }
                this.getInformation(params, true)

                break
            default:
                break
        }
    }

    getSilabosMetodologias() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'silabo-metodologias',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiSilaboId',
                iCredId: this.ConstantesService.iCredId,
                iSilaboId: this.iSilaboId,
            },
        }
        this.getInformation(params, false)
    }

    deleteSilaboMetodologias(item) {
        this.confirmationService.confirm({
            message:
                'Deseas eliminar la metodología ' +
                item.cSilMetDescripcion +
                ' ?',
            header: 'Eliminar Metodología',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Si',
            rejectLabel: 'No',

            accept: () => {
                item.opcion = 'ELIMINARxidSilMetId'
                item.iCredId = this.ConstantesService.iCredId
                const params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabo-metodologias',
                    ruta: 'store',
                    data: item,
                }
                this.getInformation(params, true)
                //this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminando Metodología' });
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: '', detail: 'You have rejected' });
            },
        })
    }

    getInformation(params, api) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: Data) => {
                if (api) {
                    this.showModal = false
                    this.getSilabosMetodologias()
                } else {
                    this.data = response.data
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
}
