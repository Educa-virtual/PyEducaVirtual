import { Component, OnInit } from '@angular/core'
import { NodeService } from 'src/app/demo/service/node.service'
import { TreeNode, PrimeTemplate, MessageService } from 'primeng/api'
import { TreeModule } from 'primeng/tree'
import { TreeTableModule } from 'primeng/treetable'
import { NgFor, NgIf, CurrencyPipe } from '@angular/common'
import { Product } from 'src/app/demo/api/product'

import { DropdownModule } from 'primeng/dropdown'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { CalendarModule } from 'primeng/calendar'
import { TableModule, Table } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ToastModule } from 'primeng/toast'
import { FormsModule } from '@angular/forms'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { AccordionModule } from 'primeng/accordion'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'

@Component({
    //templateUrl: './01.component.html',
    templateUrl: './recurso.component.html',
    styleUrl: './recurso.component.scss',
    providers: [MessageService],
    standalone: true,
    imports: [
        TreeModule,
        AccordionModule,
        InputTextareaModule,
        ToastModule,
        FormsModule,
        ContainerPageComponent,
        CurrencyPipe,
        DialogModule,
        ButtonModule,
        TableModule,
        CalendarModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        DropdownModule,
        TreeTableModule,
        PrimeTemplate,
        NgFor,
        NgIf,
    ],
})
export class RecursoComponent implements OnInit {
    files1: TreeNode[] = []

    files2: TreeNode[] = []

    files3: TreeNode[] = []

    selectedFiles1: TreeNode[] = []

    selectedFiles2: TreeNode[] = []

    selectedFiles3: TreeNode = {}

    submitted: boolean = false

    products: Product[] = []

    product: Product = {}

    cols: unknown[] = []

    productDialog: boolean = false

    public actividadSelected: IActividad | undefined

    public actividades: IActividad[] = [
        {
            id: '1',
            tipoActividadNombre: 'Tarea',
            tipoActividad: 1,
            nombreActividad: 'Actividad I',
        },
        {
            id: '2',
            tipoActividadNombre: 'Foro',
            tipoActividad: 2,
            nombreActividad: 'Foro Debate',
        },
        {
            id: '3',
            tipoActividadNombre: 'Evaluacion',
            tipoActividad: 3,
            nombreActividad: 'Exámen Unidad',
        },
        {
            id: '4',
            tipoActividadNombre: 'Videoconferencia',
            tipoActividad: 4,
            nombreActividad: 'Reunión explicación',
        },
        {
            id: '5',
            tipoActividadNombre: 'Material',
            tipoActividad: 5,
            nombreActividad: 'Glosario',
        },
    ]

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFiles().then((files) => (this.files1 = files))
        this.nodeService.getFilesystem().then((files) => (this.files2 = files))
        this.nodeService.getFiles().then((files) => {
            this.files3 = [
                {
                    label: 'Root',
                    children: files,
                },
            ]
        })

        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'size', header: 'size' },
            { field: 'tipe', header: 'tipe' },
            { field: 'Acción', header: 'Acción' },
        ]
    }
    openNew() {
        this.product = {}
        this.submitted = false
        this.productDialog = true
    }
    hideDialog() {
        this.productDialog = false
        this.submitted = false
    }
    /*saveProduct() {
       
        /*this.submitted = true

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus
                this.products[this.findIndexById(this.product.id)] =
                    this.product
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                })
            } else {
                this.product.id = this.createId()
                this.product.code = this.createId()
                this.product.image = 'product-placeholder.svg'
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.inventoryStatus.value
                    : 'INSTOCK'
                this.products.push(this.product)
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                })
            }

            

            this.products = [...this.products]
            this.productDialog = false
            this.product = {}
        }
    }*/
    findIndexById(id: string): number {
        let index = -1
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i
                break
            }
        }

        return index
    }
    createId(): string {
        let id = ''
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return id
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }
}
