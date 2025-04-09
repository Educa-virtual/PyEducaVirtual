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
    visible: boolean = false
    exito: boolean = false
    hay_excluidos: boolean = false
    titulo: string = ''
    form: FormGroup

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

    subirArchivo() {
        const formData: FormData = new FormData()
        formData.append('archivo', this.form.controls['archivo'].value)
        formData.append('iYAcadId', this.iYAcadId)
        formData.append('iSedeId', this.iSedeId)
        formData.append('iCredId', this.store.getItem('dremoPerfil').iCredId)
        formData.append(
            'iEvaluacionIdHashed',
            this.curso.iEvaluacionIdHashed ?? null
        )
        formData.append('cCursoNombre', this.curso.cCursoNombre ?? null)
        formData.append(
            'cGradoAbreviacion',
            this.curso.cGradoAbreviacion ?? null
        )
        formData.append(
            'iCursosNivelGradId',
            this.curso.iCursosNivelGradId ?? null
        )
        formData.append('tipo', 'resultados')

        this.datosInformesService.importarResultados(formData).subscribe({
            next: (data: any) => {
                // this.visible = false
                this.mostrarResultados(data.data)
                // setTimeout(() => {
                //     this.archivoSubidoEvent.emit({
                //         curso: this.curso,
                //     })
                // }, 1000)
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
