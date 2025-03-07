import { Component, ViewChild } from '@angular/core'
import { DropdownModule } from 'primeng/dropdown'
import {
    FormBuilder,
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
import { derive, trash, upload } from './actions-table-primeng'
import {
    estudianteTemplateSiagieColumns,
    ieTemplateSiagieColumns,
} from './bulk-table-columns'

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
        {
            label: 'Docente',
            name: 'plantilla-docente.xlsx',
            api: 'validatedDocentes',
        },
        {
            label: 'Estudiante',
            name: 'plantilla-estudiante.xlsx',
            api: 'validatedEstudiantes',
        },
    ]
    fileUploadForm: FormGroup
    fileOrigin: File
    disabled

    columns: IColumn[]
    unverified_columns
    unverified_data
    verified_data
    verified_columns_recorded
    verified_actions_recorded = [derive]
    import_data_actions = [upload, trash]
    import_data_columns
    groupRowsBy = 'cPersDocumento'
    import_data

    importLoad: boolean = false

    constructor(
        private fb: FormBuilder,
        public bulkDataImport: BulkDataImportService,

        private messageService: MessageService
    ) {
        this.typeCollectionForm = this.fb.group({
            typeCollection: [''],
        })
    }

    // downloadCollectionTemplate(typeCollection) {
    //     if (!typeCollection['name']) {
    //         this.messageService.clear()
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'No ha seleccionado una colección valida.',
    //         })
    //         return
    //     }

    //     this.bulkDataImport.downloadCollectionTemplate(typeCollection)
    // }

    // mapColumnsImport() {
    //     this.unverified_data = undefined
    //     switch (this.typeCollectionForm.value.typeCollection.label) {
    //         case 'Docente':
    //             this.columns = docenteTemplateColumns

    //             break
    //         case 'Estudiante':
    //             this.columns = estudianteTemplateColumns

    //             break

    //         default:
    //             break
    //     }

    //     console.log(this.columns)
    // }

    ieData

    file

    loadCollectionTemplate(file: any) {
        const reader = new FileReader()

        this.file = file

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })

            // Obtener el nombre de la primera hoja
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]

            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            let keys

            this.ieData = sheetData
                .slice(7, 8)
                .map((row) =>
                    Array.isArray(row)
                        ? row
                              .flatMap((cell) =>
                                  typeof cell == 'string'
                                      ? cell.replace(/\s+/g, ' ').trim()
                                      : cell
                              )
                              .filter(Boolean)
                        : []
                )

            keys = ieTemplateSiagieColumns.map((column) => column.field)

            this.ieData = this.ieData.map((row) =>
                Object.fromEntries(keys.map((key, i) => [key, row[i]]))
            )[0]

            console.log('sheetData')
            console.log(this.ieData)

            this.unverified_data = sheetData
                .slice(12)
                .map((row) =>
                    Array.isArray(row)
                        ? row
                              .map((cell) =>
                                  typeof cell == 'string'
                                      ? cell.replace(/\s+/g, ' ').trim()
                                      : cell
                              )
                              .filter(Boolean)
                        : []
                )

            keys = estudianteTemplateSiagieColumns.map((column) => column.field)

            this.unverified_data = this.unverified_data.map((row) =>
                Object.fromEntries(keys.map((key, i) => [key, row[i]]))
            )

            console.log('this.unverified_data')
            console.log(this.unverified_data)

            this.unverified_columns = estudianteTemplateSiagieColumns

            // const matrix = this.getMatrix(worksheet)

            // const sheetData = this.getMatrixData(matrix)

            console.log('sheetData')
            console.log(sheetData)
        }

        reader.readAsArrayBuffer(file)
    }

    @ViewChild('importBtn') importBtn!: Button

    validaImportData() {
        this.importBtn.label = 'Importar datos'
        this.importBtn.icon = 'pi pi-database'
        this.importBtn.loading = true

        this.bulkDataImport
            .importDataCollection(this.file, this.unverified_data)
            .subscribe({
                next: (response) => {
                    console.log('response')
                    console.log(response)
                    this.importBtn.loading = false
                },
                error: (error) => {
                    console.log('error')
                    console.log(error)
                },
                complete: () => {
                    this.importBtn.loading = false
                },
            })
    }

    // getMatrixData(matrix){

    //     console.log(matrix);
    //     console.log(matrix);

    //     const lastIndexValid = []

    //     const mappingGuideIndex = [
    //         1
    //     ]

    //     let lastIndex
    //     let lastHeader
    //     let lastRowIndex

    //     matrix.map((row, indexRow) => {
    //         row.map((cell, index) => {

    //             if (cell && lastIndexValid.length == 0) {
    //                 lastIndexValid.push({
    //                     headers: [
    //                         {
    //                             value: cell,
    //                             columnIndex: index,
    //                             RowIndex: indexRow,

    //                         }
    //                     ]
    //                 })

    //                 lastRowIndex = indexRow
    //             }

    //             if (cell && lastIndexValid.length > 0) {
    //                 lastIndex = lastIndexValid[lastIndexValid.length - 1]

    //                 lastHeader = lastIndex.headers[lastIndex.headers.length - 1]
    //             }

    //             if (cell && lastRowIndex) {
    //                 lastIndexValid.push({
    //                     headers: [
    //                         {
    //                             value: cell,
    //                             columnIndex: index,
    //                             RowIndex: indexRow,

    //                         }
    //                     ]
    //                 })

    //                 lastRowIndex = indexRow
    //             } else {
    //                 lastRowIndex = null
    //             }

    //             cell
    //         })
    //     })

    //     console.log('lastIndexValid');
    //     console.log(lastIndexValid);

    //     return

    // }

    // getMatrix(sheet) {
    //     if (!sheet || !sheet['!ref']) return []

    //     const range = XLSX.utils.decode_range(sheet['!ref']) // Decodifica el rango de la hoja
    //     const matrix = []

    //     for (let R = range.s.r; R <= range.e.r; ++R) {
    //         const row = []
    //         for (let C = range.s.c; C <= range.e.c; ++C) {
    //             const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
    //             const cell = sheet[cellRef]
    //             row.push(cell ? XLSX.utils.format_cell(cell).trim() : null) // Agrega celda vacía si no existe
    //         }
    //         matrix.push(row)
    //     }

    //     return matrix
    // }

    // validFormatTemplate() {
    //     console.log('isValid')
    //     console.log(this.columns)
    //     console.log(this.jsonData)

    //     console.log(this.unverified_data)

    //     const validFormat = this.columns.some(
    //         (obj, index) => obj.header === this.jsonData?.[0][index]
    //     )

    //     if (!validFormat) {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Plantilla',
    //             detail: 'La plantilla no cumple el formato de la colección.',
    //         })

    //         this.unverified_data = undefined

    //         return
    //     }
    // }

    // status = []

    // validaImportData() {
    //     if (!this.unverified_data) {
    //         this.messageService.clear()
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'No se ha cargado datos a verificar.',
    //         })
    //         return
    //     }

    //     this.bulkDataImport
    //         .validateCollectionData(
    //             this.unverified_data,
    //             this.typeCollectionForm.value.typeCollection.api
    //         )
    //         .subscribe({
    //             next: (response) => {
    //                 // this.verified_data = response.data

    //                 console.log('Respuesta del servidor:', response)

    //                 const excel = []

    //                 const filteredData = response.data.map((obj) => {
    //                     const { json_excel, lista_no_d, ...rest } = obj

    //                     this.status.push(
    //                         Object.keys(obj)
    //                             .filter(
    //                                 (key) =>
    //                                     key.startsWith('v_') ||
    //                                     key === 'cPersDocumento'
    //                             ) // Filtra solo las claves que inician con "v_"
    //                             .reduce((acc, key) => {
    //                                 const newKey = key.replace('v_', '')
    //                                 acc[newKey] = obj[key] // Agrega las claves filtradas al nuevo objeto
    //                                 return acc
    //                             }, {} as any)
    //                     )
    //                     excel.push(...JSON.parse(json_excel))
    //                     console.log(json_excel, lista_no_d)
    //                     return { ...rest }
    //                 })

    //                 this.verified_data = [...filteredData, ...excel]

    //                 console.log('filteredData')
    //                 console.log(this.verified_data)

    //                 if (this.unverified_data) {
    //                     console.log(this.columns)

    //                     this.import_data_columns = [
    //                         ...this.columns,
    //                         // {
    //                         //     type: 'actions',
    //                         //     width: '3rem',
    //                         //     field: 'actions',
    //                         //     header: 'Acciones',
    //                         //     text_header: 'center',
    //                         //     text: 'center',
    //                         // },
    //                         {
    //                             field: 'checked',
    //                             header: '',
    //                             type: 'checkbox',
    //                             width: '1rem',
    //                             text: 'left',
    //                             text_header: '',
    //                         },
    //                     ]

    //                     // this.import_data_columns = [
    //                     //     ...this.columns.map((column) => ({
    //                     //         ...column,
    //                     //         type: 'cell-editor',
    //                     //     })),
    //                     //     {
    //                     //         type: 'actions',
    //                     //         width: '3rem',
    //                     //         field: 'actions',
    //                     //         header: 'Acciones',
    //                     //         text_header: 'center',
    //                     //         text: 'center',
    //                     //     },
    //                     // ]

    //                     this.verified_columns_recorded = this.columns.map(
    //                         (column) => ({
    //                             ...column,
    //                             type: 'expansion',
    //                         })
    //                     )

    //                     this.verified_columns_recorded = [
    //                         {
    //                             field: 'radio',
    //                             header: '',
    //                             type: 'radio',
    //                             width: '5rem',
    //                             text: 'left',
    //                             text_header: '',
    //                         },
    //                         ...this.columns,
    //                         {
    //                             type: 'actions',
    //                             width: '3rem',
    //                             field: 'actions',
    //                             header: 'Acciones',
    //                             text_header: 'center',
    //                             text: 'center',
    //                         },
    //                     ]

    //                     // this.import_data = this.unverified_data.filter(un_obj => !this.verified_data.some(v_obj => un_obj['cPersDocumento'] === v_obj['cPersDocumento']));

    //                     console.log('this.import_data')
    //                     console.log(this.unverified_data)
    //                     console.log(this.verified_data)
    //                     this.import_data = this.unverified_data.filter(
    //                         (unData) =>
    //                             !this.verified_data.some(
    //                                 (vData) =>
    //                                     vData.cPersDocumento ==
    //                                     unData.cPersDocumento
    //                             )
    //                     )

    //                     // this.unverified_data = []
    //                 }

    //                 console.log('this.verified_data_not_recorded')
    //                 console.log(this.unverified_data)
    //             },
    //             error: (error) => {
    //                 console.error('Error en la solicitud:', error)
    //             },
    //         })
    // }

    // handleActionsVerifiedData(row) {
    //     const actions = {
    //         derivar: () => {
    //             // Lógica para la acción "ver"
    //             if (!row.item) {
    //                 this.messageService.clear()
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'No se ha seleccionado un item para derivar.',
    //                 })
    //             } else {
    //                 // this.import_data = this.import_data.unshift(row.item)

    //                 this.import_data = [row.item, ...this.import_data]

    //                 this.verified_data = this.verified_data.filter(
    //                     (item) =>
    //                         item[this.groupRowsBy] !==
    //                         row.item[this.groupRowsBy]
    //                 )

    //                 console.log('this.import_data')
    //                 console.log(this.import_data)
    //             }
    //         },
    //     }

    //     const action = actions[row.accion]
    //     if (action) {
    //         action()
    //     } else {
    //         console.log(`Acción desconocida: ${row.action}`)
    //     }
    // }

    // handleActionsImportData(row) {
    //     const actions = {
    //         derivar: () => {
    //             // Lógica para la acción "ver"
    //             if (!row.item) {
    //                 this.messageService.clear()
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'No se ha seleccionado un item para derivar.',
    //                 })
    //             } else {
    //                 // this.import_data = this.import_data.unshift(row.item)

    //                 this.import_data = [row.item, ...this.import_data]

    //                 this.verified_data = this.verified_data.filter(
    //                     (item) =>
    //                         item[this.groupRowsBy] !==
    //                         row.item[this.groupRowsBy]
    //                 )

    //                 console.log('this.import_data')
    //                 console.log(this.import_data)
    //             }
    //         },
    //     }

    //     const action = actions[row.accion]
    //     if (action) {
    //         action()
    //     } else {
    //         console.log(`Acción desconocida: ${row.action}`)
    //     }
    // }

    // selectedRowImportData = []
}
