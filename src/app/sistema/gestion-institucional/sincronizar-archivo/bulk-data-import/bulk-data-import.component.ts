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

@Component({
    selector: 'app-bulk-data-import',
    standalone: true,
    imports: [
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
    ],
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
    data

    importLoad: boolean = false

    constructor(
        private fb: FormBuilder,
        public bulkDataImport: BulkDataImportService
    ) {
        this.typeCollectionForm = this.fb.group({
            typeCollection: [''],
        })

        this.fileUploadForm = this.fb.group({
            file: new FormControl(''),
        })
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

            this.columns = jsonData[0].map((data) => {
                return {
                    type: 'text',
                    width: 'max-content',
                    padding: '1.25rem 2rem',
                    field: data,
                    header: data,
                    text_header: 'center',
                    text: 'center',
                }
            })

            this.data = jsonData.slice(1).map((row) =>
                row.reduce(
                    (acc, cell, index) => ({
                        ...acc,
                        [jsonData[0][index]]: cell,
                    }),
                    {}
                )
            )

            console.log(this.data)
        }

        reader.readAsArrayBuffer(file)
    }

    chargeImportData() {
        console.log(this.fileUploadForm.value)
    }
}
