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
import { BulkDataImportComponent } from '../../gestion-institucional/sincronizar-archivo/bulk-data-import/bulk-data-import.component'

@Component({
    selector: 'app-importar-datos',
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

    templateUrl: './importar-datos.component.html',
    styleUrl: './importar-datos.component.scss',
})
export class ImportarDatosComponent implements OnInit {
    jsonData: any[] = [] // Aquí se almacenará el JSON resultante
    form: FormGroup
    iSedeId: number
    iYAcadId: number
    messages: Message[] | undefined

    sortedData: any[] = []
    data: any
    data2: any // Aquí se almacenará el JSON resultante
    data1: any

    reg_modulos: any[] = [
        { id: 1, modulo: 'Ambientes' }, //iiee_ambientes
        { id: 2, modulo: 'Horarios' }, //horarios_ie
        { id: 3, modulo: 'Configuraciones' }, // configuraciones
        { id: 3, modulo: 'traslados' }, // traslados
    ]

    headers: string[] = []

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private messageService: MessageService,
        public query: GeneralService
    ) {
        this.messages = []
        // Initialize any necessary properties or services here
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
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
    // onFileChange(event: any): void {
    //     const file = event.target.files[0]; // Obtiene el archivo cargado
    //     if (file) {
    //         const reader = new FileReader();

    //         reader.onload = (e: any) => {
    //             const abuf = e.target.result;
    //             const wb = XLSX.read(abuf, { type: 'array' }); // Lee el archivo Excel
    //             const ws = wb.Sheets[wb.SheetNames[0]]; // Obtiene la primera hoja
    //             const json = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Convierte la hoja a JSON (modo matriz)

    //             console.log(json); // Muestra la data completa
    //             if (json.length > 1) {
    //                 this.headers = json[0] as string[]; // Extrae los encabezados
    //                 this.jsonData = json.slice(1).map(row => {
    //                     const obj: any = {};
    //                     this.headers.forEach((header, index) => {
    //                         obj[header] = row[index];
    //                     });
    //                     return obj;
    //                 });
    //                 console.log(this.headers);
    //                 console.log(this.jsonData);
    //             }
    //         };

    //         reader.readAsArrayBuffer(file); // Aquí va la lectura del archivo
    //     }
    // }

    onFileChange(event: any): void {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()

            reader.onload = (e: any) => {
                const abuf = e.target.result
                const wb = XLSX.read(abuf, { type: 'array' })
                const ws = wb.Sheets[wb.SheetNames[0]]

                // Lee todas las filas como matriz (matriz de arrays)
                const rows: any[][] = XLSX.utils.sheet_to_json(ws, {
                    header: 1,
                })

                console.log('Todas las filas:', rows)

                const headerRowIndex = 4 // Fila 5 (base 0)
                if (rows.length > headerRowIndex) {
                    this.headers = rows[headerRowIndex] // Fila 4 como cabecera
                    const dataRows = rows.slice(headerRowIndex + 1) // Filas siguientes

                    // Convierte filas en objetos usando la cabecera
                    this.jsonData = dataRows.map((row) => {
                        //this.data1 = dataRows.map(row => {
                        const obj: any = {}
                        this.headers.forEach((header, index) => {
                            obj[header] = row[index]
                        })
                        return obj
                    })

                    this.extraerNexus(this.jsonData)

                    // Obtener registros (solo los valores, como arrays)
                    // this.jsonData = nexus.map(obj => Object.values(obj));

                    console.log('Encabezados:', this.headers)
                    console.log('Datos JSON:', this.jsonData)
                } else {
                    console.warn('No hay suficientes filas en el archivo.')
                }
            }

            reader.readAsArrayBuffer(file)
        }
    }

    extraerNexus(lista: any) {
        const nexus = lista.map((element: any) => {
            return {
                'NOMBRE DE LA INSTITUCION EDUCATIVA':
                    element['NOMBRE DE LA INSTITUCION EDUCATIVA'],
                JEC: element['JEC'],
                'TIPO DE TRABAJADOR': element['TIPO DE TRABAJADOR'],
                'SUB-TIPO DE TRABAJADOR': element['SUB-TIPO DE TRABAJADOR'],
                CARGO: element['CARGO'],
                'SITUACION LABORAL': element['SITUACION LABORAL'],
                'MOTIVO DE VACANTE': element['MOTIVO DE VACANTE'],
                'DESCRIPCION ESCALA': element['DESCRIPCION ESCALA'],
                'JORNADA LABORAL': element['JORNADA LABORAL'],
                ESTADO: element['ESTADO'],
                'FECHA DE INICIO': element['FECHA DE INICIO'],
                'FECHA DE TERMINO': element['FECHA DE TERMINO'],
                'FECHA DE INGRESO NOMB.': element['FECHA DE INGRESO NOMB.'],
                'DOCUMENTO DE IDENTIDAD': element['DOCUMENTO DE IDENTIDAD'],
                'FECHA DE NACIMIENTO': element['FECHA DE NACIMIENTO'],
                SEXO: element['SEXO'],
                'APELLIDO PATERNO': element['APELLIDO PATERNO'],
                'APELLIDO MATERNO': element['APELLIDO MATERNO'],
                NOMBRES: element['NOMBRES'],
                CELULAR: element['CELULAR'],
                EMAIL: element['EMAIL'],
            }
        })
        // Obtener cabecera (una sola vez desde el primer objeto)
        // Obtener cabecera
        this.headers = nexus.length > 0 ? Object.keys(nexus[0]) : []

        // Obtener solo los valores (array de arrays)
        const dataRows2 = nexus.map((obj) => Object.values(obj))

        // Convertir nuevamente a objetos usando cabeceras
        this.jsonData = dataRows2.map((row) => {
            const obj: any = {}
            this.headers.forEach((header, index) => {
                obj[header] = row[index]
            })
            return obj
        })
        console.log('Nexus:', nexus)
    }

    importarDocenteExcel(data: any) {
        // Método para importar los datos del JSON al sistema
        this.query
            .importarDocente_IE({
                data: data, //this.jsonData ,
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                // Llama al servicio para agregar los datos
                next: (data: any) => {
                    // Si la operación es exitosa
                    console.log('Data:', data) // Muestra la respuesta en la consola
                },
                error: (error) => {
                    console.error('Error de registro de docentes', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    this.messageService.add({
                        // Muestra un mensaje de éxito
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Datos procesados correctamente',
                    })
                },
            })
    }

    convertirExcelFecha(valor: any): string | null {
        if (typeof valor === 'number') {
            const baseDate = new Date(1899, 11, 30) // Excel base date (1900-01-00)
            const result = new Date(
                baseDate.getTime() + valor * 24 * 60 * 60 * 1000
            )
            // Formato inglés: yyyy-MM-dd
            return result.toISOString().split('T')[0]
        } else if (typeof valor === 'string') {
            // Si ya es string y está en formato fecha, lo puedes devolver o parsear
            return valor
        } else {
            return null
        }
    }

    selectTabla() {
        const option: number = this.form.value.iTabla
        alert(option)
        let condicion = ''
        switch (option) {
            case 1:
                condicion = 'iSedeId = ' + this.iSedeId
                this.gettablas('acad', 'iiee_ambientes', condicion)

                break
            case 2:
                condicion = 'iSedeId = ' + this.iSedeId
                this.gettablas('acad', 'horarios_ie', condicion)

                break

            case 3:
                condicion = 'iSedeId = ' + this.iSedeId
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
