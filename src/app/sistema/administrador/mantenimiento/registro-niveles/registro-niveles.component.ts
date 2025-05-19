import { Component, OnInit } from '@angular/core'

import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'

import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-registro-niveles',
    standalone: true,
    imports: [
        PanelModule,
        InputTextModule,
        TablePrimengComponent,
        FormsModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './registro-niveles.component.html',
    styleUrl: './registro-niveles.component.scss',
})
export class RegistroNivelesComponent implements OnInit {
    value: string | undefined

    form: FormGroup
    abreviaturaNivel: string = ''
    nombreCursos: string = ''
    abreviaturaCursos: string = ''
    estado: string = ''

    nombreNivel: string = ''
    siglaNivel: string = ''

    nombreCurso: string = ''
    abrevCurso: string = ''
    iCredId: number

    constructor(
        private store: LocalStoreService,
        private messageService: MessageService,
        private query: GeneralService,
        private fb: FormBuilder
    ) {
        const perfil = this.store.getItem('dremoPerfil')

        this.iCredId = perfil.iCredId
    }

    selectedItems = []
    datos: any = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pen-to-square',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'item',
            width: '2rem',
            field: '',
            header: 'Item',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '10rem',
            field: 'cNivelNombre',
            header: 'Nombre del Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNivelSigla',
            header: 'Abreviatura Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'cNivelNombreCursos',
            header: 'Nombre Cursos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'cNivelAbreviacionCursos',
            header: 'Abreviatura Cursos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'cNivelDenominacionTutor',
            header: 'Denominacion Tutor',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '3rem',
            field: 'iEstado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    ngOnInit(): void {
        this.getNiveles()

        this.form = this.fb.group({
            iNivelId: [0],
            cNivelAbreviacionCursos: ['', Validators.required],
            cNivelDenominacionTutor: ['', Validators.required],
            cNivelNombre: ['', Validators.required],
            cNivelNombreCursos: ['', Validators.required],
            cNivelSigla: [''],
            iEstado: [0],
        })
    }

    //Metodo para generar la abreviatura de Nombre del Nivel
    generarSiglaDesdeNombre(nombre: string): string {
        return nombre
            .split(' ')
            .filter((palabra) => palabra.length > 0)
            .map((palabra) => palabra[0].toUpperCase())
            .join('')
    }

    onNombreNivelChange(event: Event): void {
        const input = event.target as HTMLInputElement
        this.nombreNivel = input.value
        this.siglaNivel = this.generarSiglaDesdeNombre(this.nombreNivel)
    }

    //Metodo para generar la abreviatura de Nombre del Nivel
    generarAbreviaturaCurso(nomb_curso: string): string {
        return nomb_curso
            .split(' ')
            .filter((palabra) => palabra.length > 0)
            .map((palabra) => palabra[0].toUpperCase())
            .join('')
    }

    onNombreCursoChange(event: Event): void {
        const input = event.target as HTMLInputElement
        this.nombreCurso = input.value
        this.abrevCurso = this.generarAbreviaturaCurso(this.nombreCurso)
    }

    guardarNivel() {
        // Aquí va la lógica para guardar los datos

        console.log(this.form.value, 'form')
        console.log('Nivel guardado:', {
            nombreNivel: this.nombreNivel,
            siglaNivel: this.siglaNivel,
            nombreCursos: this.nombreCursos,
            abrevCurso: this.abrevCurso,
            estado: this.estado,
        })
    }
    limpiarForm() {
        this.form.reset()
    }

    getNiveles() {
        // obtiene los perfiles para la sede
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'niveles',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.datos = data.data
                },
                error: (error) => {
                    console.error('Error en extraer niveles:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log(this.datos, 'niveles')
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                },
            })
    }
    accionBtnItemTable({ accion, item }) {
        // console.log(this.selectedItems, 'selectedItems')

        if (accion === 'editar') {
            this.form.get('iNivelId')?.setValue(item.iNivelId)
            this.form
                .get('cNivelAbreviacionCursos')
                ?.setValue(item.cNivelAbreviacionCursos)
            this.form
                .get('cNivelDenominacionTutor')
                ?.setValue(item.cNivelDenominacionTutor)
            this.form.get('cNivelNombre')?.setValue(item.cNivelNombre)
            this.form
                .get('cNivelNombreCursos')
                ?.setValue(item.cNivelNombreCursos)
            this.form.get('cNivelSigla')?.setValue(item.cNivelSigla)
            this.form.get('iEstado')?.setValue(item.iEstado)

            // console.log(item, 'btnTable')
        }
    }
}
