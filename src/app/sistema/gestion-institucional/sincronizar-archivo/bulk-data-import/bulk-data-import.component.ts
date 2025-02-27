import { Component } from '@angular/core'
import { DropdownModule } from 'primeng/dropdown'
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
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

@Component({
    selector: 'app-bulk-data-import',
    standalone: true,
    imports: [
        ContainerPageComponent,
        DropdownModule,
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
export class BulkDataImportComponent {
    typeCollectionForm: FormGroup
    typeCollections = [
        { label: 'Docente', name: 'plantilla-docente.xlsx' },
        { label: 'Estudiante', name: 'plantilla-estudiante.xlsx' },
    ]
    fileUploadForm: FormGroup
    fileOrigin: File
    disabled

    columns: IColumn[]
    unverified_data
    verified_data

    importLoad: boolean = false

    constructor(
        private fb: FormBuilder,
        public bulkDataImport: BulkDataImportService,

        private messageService: MessageService
    ) {
        this.typeCollectionForm = this.fb.group({
            typeCollection: [''],
        })

        this.fileUploadForm = this.fb.group({
            file: new FormControl(''),
        })
    }

    downloadCollectionTemplate(typeCollection) {
        if (!typeCollection['name']) {
            this.messageService.clear()
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No ha seleccionado una colección valida.',
            })
            return
        }

        this.bulkDataImport.downloadCollectionTemplate(typeCollection)
    }

    loadCollectionTemplate(file: any) {
        console.log('file')
        console.log(file)

        const reader = new FileReader()

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })

            // Obtener el nombre de la primera hoja
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]

            // Convertir los datos de la hoja a formato JSON
            const jsonData: Array<any> = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            })
            console.log('Datos del archivo XLSX:', jsonData)

            this.columns = jsonData[0]
                .map((data, index) => {
                    if (!jsonData[0][index]) {
                        return null
                    }

                    return {
                        type: 'text',
                        width: '5rem',
                        field: jsonData[1][index],
                        header: jsonData[0][index],
                        text_header: 'center',
                        text: 'center',
                    }
                })
                .filter(
                    (column): column is { [key: string]: any } =>
                        column !== null
                )

            this.unverified_data = jsonData.slice(2).map((row) =>
                row.reduce(
                    (acc, cell, index) => ({
                        ...acc,
                        [jsonData[1][index]]: cell,
                    }),
                    {}
                )
            )

            console.log(this.unverified_data)
        }

        reader.readAsArrayBuffer(file)
    }

    validaImportData() {
        console.log(this.fileUploadForm.value)

        this.bulkDataImport
            .validateCollectionData(this.unverified_data)
            .subscribe({
                next: (response) => {
                    this.verified_data = response.data

                    console.log('Respuesta del servidor:', response)
                },
                error: (error) => {
                    console.error('Error en la solicitud:', error)
                },
            })
    }
}
