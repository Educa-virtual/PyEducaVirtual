import { Component, OnInit } from '@angular/core'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { CommonModule } from '@angular/common'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    IActionContainer,
    ContainerPageComponent,
} from '@/app/shared/container-page/container-page.component'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { MessageService } from 'primeng/api'
import { MessagesModule } from 'primeng/messages'
import { Message } from 'primeng/api'
import { CursoDetalleNavigationComponent } from '../../aula-virtual/sub-modulos/cursos/curso-detalle/curso-detalle-navigation/curso-detalle-navigation.component'
import { BulkDataImportComponent } from './bulk-data-import/bulk-data-import.component'

@Component({
    selector: 'app-sincronizar-archivo',
    providers: [MessageService],
    standalone: true,
    imports: [
        CommonModule,
        TablePrimengComponent,
        ContainerPageComponent,
        PrimengModule,
        ReactiveFormsModule,
        MessagesModule,
        FormsModule,
        CursoDetalleNavigationComponent,
        BulkDataImportComponent,
    ],
    templateUrl: './sincronizar-archivo.component.html',
    styleUrl: './sincronizar-archivo.component.scss',
})
export class SincronizarArchivoComponent implements OnInit {
    jsonData: any[] = [] // Aquí se almacenará el JSON resultante
    form: FormGroup

    messages: Message[] | undefined

    sortedData: any[] = []
    data: any
    data1: any[] = [
        { nombre: 'Juan', edad: 30, email: 'juan@example.com' },
        { nombre: 'Ana', edad: 25, email: 'ana@example.com' },
        { nombre: 'Pedro', edad: 40, email: 'pedro@example.com' },
    ]

    reg_modulos: any[] = [
        { id: 1, modulo: 'Ambientes' }, //iiee_ambientes
        { id: 2, modulo: 'Horarios' }, //horarios_ie
        { id: 3, modulo: 'Configuraciones' }, // configuraciones
        { id: 3, modulo: 'traslados' }, // traslados
    ]

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private messageService: MessageService,
        public query: GeneralService
    ) {
        this.messages = []
        // Initialize any necessary properties or services here
    }
    ngOnInit(): void {
        this.messages = [
            {
                severity: 'info',
                detail: 'Solo podra procesaar archivos en .xls y .xlsx',
            },
        ]
        this.form = this.fb.group({
            iTabla: [1],
        })
    }

    // Este método se ejecutará cuando el usuario seleccione un archivo
    onFileChange(event: any): void {
        const file = event.target.files[0] // Obtiene el archivo cargado
        if (file) {
            const reader = new FileReader()

            reader.onload = (e: any) => {
                const abuf = e.target.result
                const wb = XLSX.read(abuf, { type: 'array' }) // Lee el archivo Excel
                const ws = wb.Sheets[wb.SheetNames[0]] // Obtiene la primera hoja
                const json = XLSX.utils.sheet_to_json(ws) // Convierte la hoja a JSON
                this.jsonData = json // Asigna el JSON al array
                console.log(this.jsonData) // Muestra el JSON en la consola
                const headers = json.slice(0)
                console.log(headers)
            }

            reader.readAsArrayBuffer(file) // Lee el archivo como un array buffer
        }
    }

    selectTabla() {
        const option: number = this.form.value.iTabla
        alert(option)
        let condicion = ''
        switch (option) {
            case 1:
                condicion = 'iSedeId = 1'
                this.gettablas('acad', 'iiee_ambientes', condicion)

                break
            case 2:
                condicion = 'iSedeId = 1'
                this.gettablas('acad', 'horarios_ie', condicion)

                break

            case 3:
                condicion = 'iSedeId = 1'
                this.gettablas('acad', 'configuraciones', condicion)

                break
            // Add more cases as needed
            default:
                console.log('No matching case')
        }
    }

    exportToExcel(resultado, name): void {
        // 1. Convertir el JSON a una hoja de cálculo (worksheet)
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resultado)

        // 2. Crear un libro de trabajo (workbook) y agregar la hoja de cálculo
        const workbook: XLSX.WorkBook = {
            Sheets: { Datos: worksheet },
            SheetNames: ['Datos'],
        }

        // 3. Escribir el libro de trabajo a un array de bytes
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        })

        // 4. Convertir el array de bytes en un Blob y descargar el archivo
        const blob: Blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        })
        saveAs(blob, name + '.xlsx')
    }

    sortData() {
        // Extraer las cabeceras
        const headers = this.data.slice(6, 7)

        // Extraer los datos
        const rows = this.data.slice(6)

        // Filtrar solo las filas que tienen datos relevantes (eliminar filas vacías o de totales)
        const filteredRows = rows.filter(
            (row) => row.__EMPTY && !isNaN(row.__EMPTY)
        )

        // Ordenar los datos por el número de aula (__EMPTY)
        this.sortedData = filteredRows.sort((a, b) => {
            return parseInt(a.__EMPTY) - parseInt(b.__EMPTY)
        })

        // Agregar las cabeceras al inicio del array ordenado
        this.sortedData = [...headers, ...this.sortedData]
    }

    gettablas(esquema, tabla, condicion) {
        this.query
            .searchCalAcademico({
                esquema: esquema,
                tabla: tabla,
                campos: '*',
                condicion: condicion,
            })
            .subscribe({
                next: (data: any) => {
                    this.data1 = data.data
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    this.exportToExcel(this.data1, tabla)
                },
            })

        // grado 3-8 primaria  9-13 secundaria 1-2 inicial
    }

    accionBtnItem(event) {
        console.log(event)
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Procesar datos del esxel',
            text: 'Procesar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
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
            type: 'item',
            width: '1%',
            field: 'Id',
            header: 'Id',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'Aula',
            header: 'Aula',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8%',
            field: 'Ubicacion',
            header: 'Ubicación',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8%',
            field: 'Area',
            header: 'Área m2',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8%',
            field: 'Cap',
            header: 'Capacidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'Estado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'C_Bueno',
            header: 'Carpeta Bueno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'C_Regular',
            header: 'Carpeta Regular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'C_Malo',
            header: 'Carpeta Malo',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '5%',
            field: 'M_Bueno',
            header: 'Mueble Bueno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'M_Regular',
            header: 'Mueble Regular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'M_Malo',
            header: 'Mueble Malo',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '5%',
            field: 'C_Bueno',
            header: 'Silla Buena',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'S_Regular',
            header: 'Silla Regular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5%',
            field: 'S_Malo',
            header: 'Silla Mala',
            text_header: 'center',
            text: 'center',
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
}
