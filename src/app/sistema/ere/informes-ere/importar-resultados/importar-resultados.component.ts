import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DatosInformesService } from '../../services/datos-informes.service'
import { InputFileUploadComponent } from '../../../../shared/input-file-upload/input-file-upload.component'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import * as XLSX from 'xlsx'

@Component({
    selector: 'app-importar-resultados',
    standalone: true,
    imports: [PrimengModule, InputFileUploadComponent, TablePrimengComponent],
    templateUrl: './importar-resultados.component.html',
    styleUrl: './importar-resultados.component.scss',
})
export class ImportarResultadosComponent implements OnInit {
    @Output() archivoSubidoEvent = new EventEmitter<{ curso: ICurso }>()

    curso: ICurso
    iSedeId: string
    iYAcadId: string
    resultados: any
    datos_hojas: Array<object>
    visible: boolean = false
    exito: boolean = false
    hay_excluidos: boolean = false
    titulo: string = ''
    form: FormGroup

    file: File
    collection: any

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private datosInformesService: DatosInformesService
    ) {}

    ngOnInit(): void {
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.iSedeId = this.store.getItem('dremoPerfil').iSedeId
        try {
            this.form = this.fb.group({
                archivo: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }
    }

    accionBtn(elemento: any): void {
        const { accion } = elemento

        switch (accion) {
            case 'close-modal':
                this.archivoSubidoEvent.emit({
                    curso: this.curso,
                })
                break
        }
    }

    mostrarDialog(datos: { curso: ICurso }) {
        this.titulo = `Importar resultados: ${datos.curso.cCursoNombre} - ${datos.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
            - ${datos.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`
        this.visible = true
        this.curso = datos.curso
        this.form.reset()
    }

    handleArchivo(event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.form.patchValue({
            archivo: file,
        })
    }

    async handleFormSubmit() {
        this.datos_hojas = await this.leerArchivo()
        await this.subirArchivo(this.datos_hojas)
    }

    async subirArchivo(datos_hojas: Array<object>) {
        this.datosInformesService
            .importarResultados({
                datos_hojas: datos_hojas,
                iYAcadId: this.iYAcadId,
                iSedeId: this.iSedeId,
                iCredId: this.store.getItem('dremoPerfil').iCredId,
                iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed ?? null,
                cCursoNombre: this.curso.cCursoNombre ?? null,
                cGradoAbreviacion: this.curso.cGradoAbreviacion ?? null,
                iCursosNivelGradId: this.curso.iCursosNivelGradId ?? null,
                tipo: 'resultados',
            })
            .subscribe({
                next: (data: any) => {
                    this.mostrarResultados(data.data)
                },
                error: (error) => {
                    console.error('Error subiendo archivo:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    async leerArchivo(): Promise<Array<object>> {
        const file = this.form.controls['archivo'].value
        if (!file) {
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar un archivo',
            })
            return Promise.reject()
        }

        const reader = new FileReader()
        this.file = file

        let objeto_inicial: any = {}

        return new Promise((resolve, reject) => {
            try {
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer)
                    const workbook = XLSX.read(data, {
                        type: 'array',
                        sheetStubs: true,
                    })

                    const inicio = workbook.Sheets['Inicio']
                    const consolidado = workbook.Sheets['Consolidado']

                    // Obtener el nombre de la primera hoja
                    objeto_inicial = [
                        this.configurarFilasColumnas(inicio),
                        this.configurarFilasColumnas(consolidado),
                    ]
                    resolve(objeto_inicial)
                }
            } catch (error) {
                reject(error)
            }
            reader.onerror = () => {
                reject('Error procesando el archivo')
            }
            reader.readAsArrayBuffer(file)
        })
    }

    configurarFilasColumnas(worksheet: XLSX.WorkSheet) {
        const objeto_final = {}
        for (const key in worksheet) {
            const match = key.match(/^([A-Z]+)(\d+)$/)
            if (match) {
                const letra_columna = match[1]
                const numero_fila = Number(match[2])
                if (!objeto_final[numero_fila]) {
                    objeto_final[numero_fila] = {}
                }
                objeto_final[numero_fila][letra_columna] = worksheet[key].v
            }
        }
        console.log(objeto_final)
        return objeto_final
    }

    mostrarResultados(data) {
        if (data?.length > 0) {
            this.resultados = data
            this.hay_excluidos = true
        } else {
            this.exito = true
        }
    }

    resetearInput() {
        this.form.get('archivo').setValue('')
        this.resultados = []
        this.exito = false
        this.hay_excluidos = false
    }

    resetearResultados() {
        this.hay_excluidos = false
    }

    selectedItems = []

    actions: IActionTable[] = []

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'persona_nomape',
            header: 'Estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'documento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'seccion_importado',
            header: 'Sec.',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'persona_importado',
            header: 'Per.',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'estudiante_importado',
            header: 'Est.',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'matricula_importado',
            header: 'Mat.',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'resultado_importado',
            header: 'Res.',
            text_header: 'center',
            text: 'center',
        },
    ]
}
