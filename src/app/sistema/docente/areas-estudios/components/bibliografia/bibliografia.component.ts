import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, Input, OnChanges } from '@angular/core'
import { FormBibliografiaComponent } from '../form-bibliografia/form-bibliografia.component'
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
    selector: 'app-bibliografia',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        FormBibliografiaComponent,
        ConfirmDialogModule,
    ],
    templateUrl: './bibliografia.component.html',
    styleUrl: './bibliografia.component.scss',
})
export class BibliografiaComponent implements OnChanges {
    @Input() iSilaboId: string

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
            this.getBibliografias()
        }
    }

    showModal: boolean = false
    itemBibliografia = []
    option: string

    actionsContainer = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Refrescar lista de bibliografía',
            text: 'Refrescar',
            icon: 'pi pi-sync',
            accion: 'refrescar',
            class: 'p-button-danger',
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
            field: 'cTipoBiblioNombre',
            header: 'Tipo',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'cBiblioTitulo',
            header: 'Título',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '7rem',
            field: 'cBiblioAutor',
            header: 'Autor',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'cBiblioAnioEdicion',
            header: 'Año de Edición',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cBiblioEditorial',
            header: 'Editorial',
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
                this.itemBibliografia = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                break
            case 'eliminar':
                this.deleteBibliografias(item)
                break
            case 'close-modal':
                this.showModal = false
                this.itemBibliografia = item
                break
            case 'guardar':
                item.iSilaboId = this.iSilaboId
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'bibliografias',
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
                    prefix: 'bibliografias',
                    ruta: 'store',
                    data: item,
                }
                this.getInformation(params, true)

                break
            case 'refrescar':
                this.getBibliografias()
                break
            default:
                break
        }
    }

    getBibliografias() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'bibliografias',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiSilaboId',
                iCredId: this.ConstantesService.iCredId,
                iSilaboId: this.iSilaboId,
                iEstado: 1,
            },
        }
        this.getInformation(params, false)
    }
    deleteBibliografias(item) {
        this.confirmationService.confirm({
            message:
                'Deseas eliminar la biliobrafía ' + item.cBiblioTitulo + ' ?',
            header: 'Eliminar Bibliografía',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Si',
            rejectLabel: 'No',

            accept: () => {
                item.opcion = 'ELIMINARxiBiblioId'
                item.iCredId = this.ConstantesService.iCredId
                const params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'bibliografias',
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
                    this.getBibliografias()
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
