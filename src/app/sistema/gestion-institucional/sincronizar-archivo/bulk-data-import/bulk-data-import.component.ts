import { Component, OnInit, ViewChild } from '@angular/core'
import { DropdownModule } from 'primeng/dropdown'
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { Button, ButtonModule } from 'primeng/button'
import { FileUploadModule } from 'primeng/fileupload'
import { BtnFileUploadComponent } from '@/app/shared/btn-file-upload/btn-file-upload.component'
import { TabViewModule } from 'primeng/tabview'
import { TabViewComponent } from '@/app/shared/tab-view/tab-view.component'
import { TabPanelComponent } from '@/app/shared/tab-panel/tab-panel.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { BulkDataImportService } from '../services/bulk-data-import.service'
import * as XLSX from 'xlsx'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { CarouselModule } from 'primeng/carousel'
import { dropdownGroupConfig } from './config/dropdown/dropdownGroup'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { SheetToMatrix } from './utils/sheetToMatrix'

@Component({
    selector: 'app-bulk-data-import',
    standalone: true,
    imports: [
        ContainerPageComponent,
        InputGroupAddonModule,
        InputGroupModule,
        DropdownModule,
        CarouselModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        FileUploadModule,
        BtnFileUploadComponent,
        TabViewModule,
        TabViewComponent,
        TabPanelComponent,
        TablePrimengComponent,
        CommonModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './bulk-data-import.component.html',
    styleUrl: './bulk-data-import.component.scss',
})
export class BulkDataImportComponent implements OnInit {
    @ViewChild('importBtn') importBtn!: Button

    isDisabled = {
        downloadTemplate: false,
    }

    file
    dropdownConfigs = dropdownGroupConfig
    collection

    typeCollectionForm: FormGroup

    columns: IColumn[]
    columnsGroup: IColumn[][]
    data: Array<any> = []
    extraData = []
    responseDataImport
    importLoad: boolean = false

    constructor(
        private fb: FormBuilder,
        public bulkDataImport: BulkDataImportService,

        private messageService: MessageService
    ) {
        this.typeCollectionForm = this.fb.group({})

        this.dropdownConfigs.forEach((dropdown) => {
            this.typeCollectionForm.addControl(
                `${dropdown.label}${dropdown.id}`,
                new FormControl('')
            )
        })
    }

    ngOnInit(): void {
        this.dropdownConfigs.forEach((config) => {
            if (config.dependency) {
                const parentControlName = `${this.dropdownConfigs.find((dropdown) => dropdown.id === config.dependency).label}${config.dependency}`
                this.typeCollectionForm
                    .get(parentControlName)
                    ?.valueChanges.subscribe(() => {
                        // Al cambiar el valor del dropdown padre, reinicia el valor del hijo
                        const currentControlName = `${config.label}${config.id}`
                        this.typeCollectionForm.get(currentControlName)?.reset()
                        ;(this.bulkDataImport.importEndPoint = ''),
                            (this.bulkDataImport.params = {})

                        this.clearDescendants(config.id)
                    })
            }
        })

        this.typeCollectionForm.valueChanges.subscribe((value) => {
            console.log('value')
            console.log(value)
            this.data = []
            this.columns = []
            this.columnsGroup = []

            this.file = null

            console.log('cambio en el formulario?')
            console.log(this.file)

            this.isDisabled.downloadTemplate =
                !this.isSelectedTypeCollection(value)
            this.loadCollectionTemplate()
        })
    }

    isSelectedTypeCollection(obj: Record<string, any>): boolean {
        return Object.keys(obj).some(
            (key) => /Tipo de plantilla:\d+/i.test(key) && obj[key]
        )
    }

    clearDescendants(parentId: number) {
        // Encontrar todos los dropdowns cuyo dependency sea mayor o igual al parentId
        this.dropdownConfigs.forEach((config) => {
            if (config.dependency && config.dependency >= parentId) {
                const controlName = `${config.label}${config.id}`
                this.typeCollectionForm.get(controlName)?.reset()
                config.options = [] // Limpia las opciones
            }
        })
    }

    shouldShowDropdown(config): boolean {
        if (!config.dependency) {
            return true
        }

        const dependentDropdown = this.dropdownConfigs.find(
            (dropdown) => dropdown.id === config.dependency
        )

        if (!dependentDropdown) {
            return false
        }

        return (
            this.typeCollectionForm.get(
                dependentDropdown.label + dependentDropdown.id
            )?.value.id === config.optionValue
        )
    }

    loadCollectionTemplate() {
        const foundEntry: [any, any] = Object.entries(
            this.typeCollectionForm.value
        ).find(
            ([key, value]) =>
                key.startsWith('Tipo de plantilla:') && value !== null
        )

        if (!foundEntry) {
            return
        }

        const [, collection] = foundEntry

        this.collection = collection

        // this.columns = this.collection.columns

        this.bulkDataImport.importEndPoint = this.collection.importEndPoint
        this.bulkDataImport.params = this.collection.params
    }

    uploadFile(file: any) {
        this.data = undefined
        this.columns = []
        this.columnsGroup = []
        SheetToMatrix.resetInstance('hojaDeDatosAImportar')

        if (!file) return

        if (this.collection.typeSend === 'file') {
            this.file = file
        }

        const reader = new FileReader()

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })

            // Obtener el nombre de la primera hoja
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]

            // const row = XLSX.utils.decode_cell(this.collection.cellData).r

            // const headers = this.collection.columns.map(
            //     (column) => column.field
            // )

            // const excelData: any = XLSX.utils.sheet_to_json(worksheet, {
            //     header: 1,
            //     range: row,
            // })

            const excelData = SheetToMatrix.setInstance(
                'hojaDeDatosAImportar',
                worksheet,
                {
                    structures: this.collection.structures,
                }
            )

            // const excelData2 = SheetToMatrix.setInstance(
            //     'hojaDeDatosAImportar',
            //     worksheet,
            //     {
            //         structures: this.collection.structures,
            //     },
            //     this.collection.columns
            // )

            console.log('excelData')
            console.log(excelData)

            this.columnsGroup = excelData.inTableColumnsGroup
            this.columns = excelData.inTableColumns
            this.data = excelData.inTableData

            // const [info, otro] = excelData.extraData
            // console.log('info', info)
            // console.log(excelData2)
        }

        reader.readAsArrayBuffer(file)
    }

    downloadTemplate() {
        this.bulkDataImport.downloadCollectionTemplate({
            name: this.collection.template,
        })
    }

    validaImportData() {
        this.importLoad = true

        console.log(
            'SheetToMatrix',
            SheetToMatrix.getInstance(
                'hojaDeDatosAImportar'
            ).setDataAccordingColumns()
        )

        const fileImport = () => {
            switch (this.collection.typeSend) {
                case 'file':
                    return this.file
                case 'json':
                    SheetToMatrix.getInstance(
                        'hojaDeDatosAImportar'
                    ).setDataAccordingColumns()
                    return undefined
                default:
                    return undefined
            }
        }

        this.bulkDataImport
            .importDataCollection(
                fileImport(),
                SheetToMatrix.getInstance('hojaDeDatosAImportar')
                    .dataAccordingColumns
            )
            .subscribe({
                next: (response) => {
                    this.importLoad = false
                    this.responseDataImport =
                        this.collection.response(response) ?? undefined

                    console.log('this.responseDataImport')
                    console.log(this.responseDataImport)
                },
                error: (error) => {
                    console.log('error')
                    console.log(error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Importación de datos',
                        detail: 'Ha ocurrido un error al importar los datos',
                        life: 3000,
                    })
                    this.importLoad = false
                },
                complete: () => {
                    this.importLoad = false

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Importación de datos',
                        detail: 'Los datos han sido importados correctamente',
                        life: 3000,
                    })
                },
            })
    }
}
