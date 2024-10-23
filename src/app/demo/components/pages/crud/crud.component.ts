import { Component, OnInit } from '@angular/core'
import { Product } from 'src/app/demo/api/product'
import { MessageService, PrimeTemplate } from 'primeng/api'
import { Table, TableModule } from 'primeng/table'
import { ProductService } from 'src/app/demo/service/product.service'
import { ToastModule } from 'primeng/toast'
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonDirective } from 'primeng/button'
import { Ripple } from 'primeng/ripple'
import { FileUploadModule } from 'primeng/fileupload'
import { InputTextModule } from 'primeng/inputtext'
import { RatingModule } from 'primeng/rating'
import { FormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { NgIf, NgClass, CurrencyPipe } from '@angular/common'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { DropdownModule } from 'primeng/dropdown'
import { RadioButtonModule } from 'primeng/radiobutton'
import { InputNumberModule } from 'primeng/inputnumber'

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
    standalone: true,
    imports: [
        ToastModule,
        ToolbarModule,
        PrimeTemplate,
        ButtonDirective,
        Ripple,
        FileUploadModule,
        TableModule,
        InputTextModule,
        RatingModule,
        FormsModule,
        DialogModule,
        NgIf,
        NgClass,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        CurrencyPipe,
    ],
})
export class CrudComponent implements OnInit {
    productDialog: boolean = false

    deleteProductDialog: boolean = false

    deleteProductsDialog: boolean = false

    products: Product[] = []

    product: Product = {}

    selectedProducts: Product[] = []

    submitted: boolean = false

    cols: unknown[] = []

    statuses: unknown[] = []

    rowsPerPageOptions = [5, 10, 20]

    constructor(
        private productService: ProductService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.productService.getProducts().then((data) => (this.products = data))

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ]

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ]
    }

    openNew() {
        this.product = {}
        this.submitted = false
        this.productDialog = true
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true
    }

    editProduct(product: Product) {
        this.product = { ...product }
        this.productDialog = true
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true
        this.product = { ...product }
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        )
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        })
        this.selectedProducts = []
    }

    confirmDelete() {
        this.deleteProductDialog = false
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        )
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        })
        this.product = {}
    }

    hideDialog() {
        this.productDialog = false
        this.submitted = false
    }

    saveProduct() {
        this.submitted = true

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
    }

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