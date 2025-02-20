import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, Input, OnChanges, OnDestroy } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ConfirmationService, MessageService } from 'primeng/api'
import { FormActividadesComponent } from '../form-actividades/form-actividades.component'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-actividades',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        ContainerPageComponent,
        FormActividadesComponent,
    ],
    templateUrl: './actividades.component.html',
    styleUrl: './actividades.component.scss',
})
export class ActividadesComponent implements OnChanges, OnDestroy {
    @Input() iSilaboId: string
    private unsubscribe$ = new Subject<boolean>()
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
            this.getSilaboActividadAprendizajes()
        }
    }
    data = []
    showModal: boolean = false
    itemSilaboActividadAprendizajes = []
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
            labelTooltip: 'Refrescar lista de actividades',
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
            type: 'text',
            width: '8rem',
            field: 'cSilaboActAprendNombre',
            header: 'Nombre de la Actividad',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cSilaboActAprendElementos',
            header: 'Elemento de la Capacidad',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '7rem',
            field: 'cSilaboActIndLogro',
            header: 'Indicador de Logro',
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
                this.itemSilaboActividadAprendizajes = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                break
            case 'eliminar':
                this.deleteSilaboActividadAprendizajes(item)
                break
            case 'close-modal':
                this.showModal = false
                this.itemSilaboActividadAprendizajes = item
                break
            case 'guardar':
                item.iSilaboId = this.iSilaboId
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabo-actividad-aprendizajes',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
                }

                this.getInformation(params, true)

                break
            case 'modificar':
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabo-actividad-aprendizajes',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, true)

                break
            case 'refrescar':
                this.getSilaboActividadAprendizajes()
                break
            default:
                break
        }
    }

    getSilaboActividadAprendizajes() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'silabo-actividad-aprendizajes',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiSilaboId',
                iCredId: this.ConstantesService.iCredId,
                iSilaboId: this.iSilaboId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, false)
    }
    deleteSilaboActividadAprendizajes(item) {
        this.confirmationService.confirm({
            message:
                'Deseas eliminar la actividad ' +
                item.cSilaboActAprendNombre +
                ' ?',
            header: 'Eliminar Actividad',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Si',
            rejectLabel: 'No',

            accept: () => {
                item.opcion = 'ELIMINARxiSilaboActAprendId'
                item.iCredId = this.ConstantesService.iCredId
                const params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'silabo-actividad-aprendizajes',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
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
        this.GeneralService.getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    if (api) {
                        this.showModal = false
                        this.getSilaboActividadAprendizajes()
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
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
