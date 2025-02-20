import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, Input, OnChanges, OnDestroy } from '@angular/core'
import { ConfirmationService } from 'primeng/api'
import { FormContenidoSemanasComponent } from '../form-contenido-semanas/form-contenido-semanas.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-contenido-semanas',
    standalone: true,
    imports: [
        FormContenidoSemanasComponent,
        ContainerPageComponent,
        TablePrimengComponent,
    ],
    templateUrl: './contenido-semanas.component.html',
    styleUrl: './contenido-semanas.component.scss',
})
export class ContenidoSemanasComponent implements OnChanges, OnDestroy {
    @Input() iSilaboId: string
    private unsubscribe$ = new Subject<boolean>()
    constructor(
        private ConstantesService: ConstantesService,
        private GeneralService: GeneralService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnChanges(changes) {
        if (changes.iSilaboId?.currentValue) {
            this.iSilaboId = changes.iSilaboId.currentValue
            this.getContenidoSemanas()
        }
    }
    data = []
    showModal: boolean = false
    itemContenidoSemanas = []
    indicadorActividades = []
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
            labelTooltip: 'Refrescar lista de contenidos',
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

    columns = [
        {
            type: 'icon-tooltip',
            width: '1rem',
            field: 'cIndActNombre',
            header: 'Indicador',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'cContenidoSemTitulo',
            header: 'Nombre del Contenido',
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

    getContenidoSemanas() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'contenido-semanas',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiSilaboId',
                valorBusqueda: this.iSilaboId,
                iCredId: this.ConstantesService.iCredId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get_data')
    }

    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    this.accionBtnItem({ accion, item: response?.data })
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }
    deleteContenidoSemanas(item) {
        this.confirmationService.confirm({
            message:
                'Deseas eliminar el contenido: ' +
                item.cContenidoSemTitulo +
                ' ?',
            header: 'Eliminar Contenido',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Si',
            rejectLabel: 'No',

            accept: () => {
                item.opcion = 'ELIMINARxiContenidoSemId'
                item.iCredId = this.ConstantesService.iCredId
                const params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'contenido-semanas',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, 'refrescar')
                //this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminando Metodología' });
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: '', detail: 'You have rejected' });
            },
        })
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        let params
        switch (accion) {
            case 'agregar':
            case 'actualizar':
                this.showModal = true
                this.itemContenidoSemanas = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                break
            case 'eliminar':
                this.deleteContenidoSemanas(item)
                break
            case 'close-modal':
                this.showModal = false
                this.itemContenidoSemanas = item
                break
            case 'guardar':
                item.iSilaboId = this.iSilaboId
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'contenido-semanas',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, 'refrescar')

                break
            case 'modificar':
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'contenido-semanas',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, 'refrescar')

                break
            case 'refrescar':
                this.showModal = false
                this.getContenidoSemanas()
                break
            case 'get_data':
                this.data = item
                break
            default:
                break
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
