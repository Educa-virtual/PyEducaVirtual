import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ConfirmationService } from 'primeng/api'
import { FormIndicadorActividadesComponent } from '../form-indicador-actividades/form-indicador-actividades.component'
import { PrimengModule } from '@/app/primeng.module'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-indicador-actividades',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        FormIndicadorActividadesComponent,
        PrimengModule,
    ],
    templateUrl: './indicador-actividades.component.html',
    styleUrl: './indicador-actividades.component.scss',
})
export class IndicadorActividadesComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() iSilaboId: string
    private unsubscribe$ = new Subject<boolean>()

    tipoIndicadorLogros = []

    constructor(
        private ConstantesService: ConstantesService,
        private GeneralService: GeneralService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getSilaboActividadAprendizajes()
        this.getTipoIndicadorLogros()
    }
    ngOnChanges(changes) {
        if (changes.iSilaboId?.currentValue) {
            this.iSilaboId = changes.iSilaboId.currentValue
            this.getIndicadorActividades()
        }
    }
    data = []
    showModal: boolean = false
    itemIndicadorActividades = []
    actividades = []
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
            labelTooltip: 'Refrescar lista de indicadores de las actividades',
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
            field: 'cSilaboActAprendNombre',
            header: 'Actividad',
            text_header: 'center',
            text: 'center',
        },
        // {
        //   type: 'text',
        //   width: '8rem',
        //   field: 'cSilaboActAprendNombre',
        //   header: 'Nombre de la Actividad',
        //   text_header: 'center',
        //   text: 'justify',
        // },
        {
            type: 'text',
            width: '3rem',
            field: 'cTipoIndLogNombre',
            header: 'Tipo Indicador',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cIndActNombre',
            header: 'Nombre del Indicador de la Actividad',
            text_header: 'center',
            text: 'justify',
        },
        // {
        //   type: 'text',
        //   width: '4rem',
        //   field: 'cIndActProcedimientos',
        //   header: 'Procedimientos',
        //   text_header: 'center',
        //   text: 'justify',
        // },
        // {
        //   type: 'text',
        //   width: '4rem',
        //   field: 'cIndActActitudes',
        //   header: 'Actitudes',
        //   text_header: 'center',
        //   text: 'justify',
        // },
        // {
        //   type: 'text',
        //   width: '4rem',
        //   field: 'cIndActConceptual',
        //   header: 'Conceptual',
        //   text_header: 'center',
        //   text: 'justify',
        // },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    getIndicadorActividades() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'indicador-actividades',
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
    getTipoIndicadorLogros() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'tipo-indicador-logros',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTAR',
                iCredId: this.ConstantesService.iCredId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get_tipo_indicador_logros')
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
        this.getInformation(params, 'get_actividades')
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
    deleteIndicadorActividades(item) {
        this.confirmationService.confirm({
            message:
                'Deseas eliminar el Indicador - Actividad ' +
                item.cIndActNombre +
                ' ?',
            header: 'Eliminar Indicador Actividad',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Si',
            rejectLabel: 'No',

            accept: () => {
                item.opcion = 'ELIMINARxiIndActId'
                item.iCredId = this.ConstantesService.iCredId
                const params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'indicador-actividades',
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
                this.itemIndicadorActividades = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                break
            case 'eliminar':
                this.deleteIndicadorActividades(item)
                break
            case 'close-modal':
                this.showModal = false
                this.itemIndicadorActividades = item
                break
            case 'guardar':
                item.iSilaboId = this.iSilaboId
                item.iCredId = this.ConstantesService.iCredId
                params = {
                    petition: 'post',
                    group: 'docente',
                    prefix: 'indicador-actividades',
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
                    prefix: 'indicador-actividades',
                    ruta: 'store',
                    data: item,
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, 'refrescar')

                break
            case 'refrescar':
                this.showModal = false
                this.getIndicadorActividades()
                break
            case 'get_data':
                this.data = item
                break
            case 'get_tipo_indicador_logros':
                this.tipoIndicadorLogros = item
                break
            case 'get_actividades':
                this.actividades = item
                break
            default:
                break
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
