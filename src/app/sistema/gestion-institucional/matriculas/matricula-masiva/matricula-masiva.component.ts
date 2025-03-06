import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputFileUploadComponent } from '@/app/shared/input-file-upload/input-file-upload.component'
import { DatosMatriculaService } from '../../services/datos-matricula.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MessageService } from 'primeng/api'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-matricula-masiva',
    standalone: true,
    imports: [
        PrimengModule,
        InputNumberModule,
        InputFileUploadComponent,
        TablePrimengComponent,
    ],
    templateUrl: './matricula-masiva.component.html',
    styleUrl: './matricula-masiva.component.scss',
})
export class MatriculaMasivaComponent implements OnInit {
    iSedeId: string
    iYAcadId: string
    resultados: any
    hay_resultados: boolean = false

    constructor(
        private fb: FormBuilder,
        private datosMatriculaService: DatosMatriculaService,
        private store: LocalStoreService,
        private constantesService: ConstantesService,
        private messageService: MessageService
    ) {}

    form: FormGroup
    visible: boolean = false

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

    importarMatriculas() {
        this.visible = true
    }

    importarAulas() {
        this.visible = true
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
        formData.append('iCredId', this.constantesService.iCredId)
        formData.append('tipo', 'matriculas')

        this.datosMatriculaService.subirArchivoMatriculas(formData).subscribe({
            next: (data: any) => {
                console.log(data, 'subir archivo')
                this.visible = false
                this.mostrarResultados(data.data)
            },
            error: (error) => {
                console.error('Error subiendo archivo:', error)
                this.messageService.add({
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
        this.resultados = data
        this.hay_resultados = true
    }

    resetearInput() {
        this.form.get('archivo').setValue('')
    }

    resetearResultados() {
        this.hay_resultados = false
        this.resultados = []
        this.selectedItems = []
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
            width: '6rem',
            field: 'codigo_estudiante',
            header: 'Codigo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'grado_seccion',
            header: 'Grado y sección',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'persona_importado',
            header: 'Persona',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'estudiante_importado',
            header: 'Estudiante',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'matricula_importado',
            header: 'Matricula',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'usuario_creado',
            header: 'Usuario',
            text_header: 'center',
            text: 'center',
        },
    ]
}
