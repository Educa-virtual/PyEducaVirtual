import { Component, OnInit } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { NgFor, NgIf, CurrencyPipe } from '@angular/common'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputIconModule } from 'primeng/inputicon'
import { ToastModule } from 'primeng/toast'
import { ButtonModule } from 'primeng/button' /* botones */
import { DropdownModule } from 'primeng/dropdown'
import { TreeTableModule } from 'primeng/treetable'
import { IconFieldModule } from 'primeng/iconfield'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CarouselModule } from 'primeng/carousel'
import { ImageModule } from 'primeng/image'
import { GalleriaModule } from 'primeng/galleria'
import { OrderListModule } from 'primeng/orderlist'
import { DataViewModule } from 'primeng/dataview'
import { ObtenerPerfilesService } from 'src/app/sistema/roles/roles/services/obtenerPerfiles.service' //Obtener datos
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { FormsModule } from '@angular/forms'

export interface IRole {
    iCredEntPerfId: string
    ieCodigo: string
    cPersNombreLargo: string
    codigoModular: string
    nivel: string
    direccion: string
    ugel: string
}
@Component({
    selector: 'app-roles',
    standalone: true,
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    imports: [
        DialogModule,
        NgFor,
        DataViewModule,
        DataViewModule,
        NgIf,
        CurrencyPipe,
        InputTextModule,
        InputTextareaModule,
        GalleriaModule,
        InputIconModule,
        CarouselModule,
        ToastModule,
        ImageModule,
        ButtonModule,
        DropdownModule,
        TreeTableModule,
        IconFieldModule,
        OrderListModule,
        ContainerPageComponent,
        FormsModule,
        TablePrimengComponent,
    ],
})
export class RolesComponent implements OnInit {
    //item: any
    submitted: boolean = false
    productDialog: boolean = false
    roles: IRole[] = []

    public actions = [
        {
            labelTooltip: 'Ingresar',
            icon: 'pi pi-user',
            text: 'Refrescar',
            header: 'DNI',
            text_header: 'center',
            accion: 'ingresar',
            type: 'item',
            class: 'bg-cyan-500 hover:bg-cyan-600 borde-none text-slate-900',
        },
    ]

    public columnas = [
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
            width: '5rem',
            field: 'cPersDocumento',
            header: 'DNI',
            text_header: 'left',
            text: 'justify',
            class: 'w-5',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPersNombreLargo',
            header: 'Nombre',
            text_header: 'left',
            text: 'justify',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPerfilNombre',
            header: 'Prefil',
            text_header: 'left',
            text: 'justify',
        },

        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
            text_size: 'text-lg',
        },
    ]
    constructor(private perfilesService: ObtenerPerfilesService) {}
    ngOnInit() {
        const userId = 1
        this.perfilesService.obtenerPerfiles(userId).subscribe((Data) => {
            this.roles = Data['data']
            console.log('datos recibidos:', Data)
        })
    }
    openNew() {
        //this.product = {}
        this.submitted = false
        this.productDialog = true
    }
    hideDialog() {
        this.productDialog = false
        this.submitted = false
    }
    /*accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        let params
        switch (accion) {
            //case 'agregar':
            case 'ingresar':
                this.productDialog = false
                this.submitted = false

                break
            /*case 'actualizar':
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
            case 'get_indicador_actividades':
                this.indicadorActividades = item
                break
            default:
                break
        }
    }*/
}
