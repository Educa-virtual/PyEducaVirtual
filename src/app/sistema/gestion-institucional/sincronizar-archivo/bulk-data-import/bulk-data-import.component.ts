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

@Component({
    selector: 'app-bulk-data-import',
    standalone: true,
    imports: [
        ContainerPageComponent,
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

    dropdownConfigs = dropdownGroupConfig

    typeCollectionForm: FormGroup

    columns: IColumn[]
    data
    responseDataImport
    responseColumnsImport
    groupRowsBy = 'cPersDocumento'
    import_data

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

    ieData

    file

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
                        this.data = undefined
                        this.columns = undefined

                        this.clearDescendants(config.id)
                    })
            }
        })

        this.typeCollectionForm.valueChanges.subscribe((value) => {
            console.log('value')
            console.log(value)
            this.isDisabled.downloadTemplate =
                !this.isSelectedTypeCollection(value)
        })
    }

    isSelectedTypeCollection(obj: Record<string, any>): boolean {
        return Object.keys(obj).some(
            (key) => /Tipo de la colección:\d+/i.test(key) && obj[key]
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

    loadCollectionTemplate(file: any) {
        const [, collection] = Object.entries(
            this.typeCollectionForm.value
        ).find(
            ([key, value]) =>
                key.startsWith('Tipo de la colección:') && value !== null
        )

        this.bulkDataImport.importEndPoint = collection['importEndPoint']
        this.bulkDataImport.params = collection['params']

        this.columns = collection['columns']
        this.responseColumnsImport = collection['columnsResultImport']

        const reader = new FileReader()

        this.file = file

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })

            // Obtener el nombre de la primera hoja
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]

            const row = XLSX.utils.decode_cell(collection['cellData']).r

            const headers = this.columns.map((column) => column.field)

            const excelData: any = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                range: row,
            })

            const cleanColumnsEmpty = excelData.map((row) =>
                row.filter((cell) => cell != null)
            )

            this.data = cleanColumnsEmpty.map((row) =>
                Object.fromEntries(
                    headers.map((key, index) => [key, row[index] ?? null])
                )
            )
        }

        reader.readAsArrayBuffer(file)
    }

    validaImportData() {
        this.importLoad = true

        this.bulkDataImport
            .importDataCollection(this.file, this.data)
            .subscribe({
                next: (response) => {
                    console.log('response')
                    console.log(response)
                    this.importLoad = false
                    this.responseDataImport = response.data ?? undefined
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
