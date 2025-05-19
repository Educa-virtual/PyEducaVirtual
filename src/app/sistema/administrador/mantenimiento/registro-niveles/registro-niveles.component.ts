import { Component } from '@angular/core'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import { FormBuilder, FormGroup } from '@angular/forms'
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
    ],
    templateUrl: './registro-niveles.component.html',
    styleUrl: './registro-niveles.component.scss',
})
export class RegistroNivelesComponent {
    value: string | undefined
    constructor(private fb: FormBuilder) {}
    form: FormGroup
    abreviaturaNivel: string = ''
    nombreCursos: string = ''
    abreviaturaCursos: string = ''
    estado: string = ''

    nombreNivel: string = ''
    siglaNivel: string = ''

    nombreCurso: string = ''
    abrevCurso: string = ''

    selectedItems = []
    datos = [
        {
            item: 1,
            nombnivel: 'Educacion Inicial',
            nivelsigla: 'EI',
            nivnombrecursos: 'Area Curricular',
            nivabrevcursos: 'AC',
            nivDenominacionTutor: 'Tuto',
            acciones: 'Editar',
        },
        {
            item: 2,
            nombnivel: 'Educacion Basica Regular',
            nivelsigla: 'EBR',
            nivnombrecursos: 'Area Curricular',
            nivabrevcursos: 'AC',
            nivDenominacionTutor: 'Consejero',
            acciones: 'Editar',
        },
    ]

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
            field: 'nombnivel',
            header: 'Nombre del Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nivelsigla',
            header: 'Abreviatura Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'nivnombrecursos',
            header: 'Nombre Cursos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'nivabrevcursos',
            header: 'Abreviatura Cursos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'nivDenominacionTutor',
            header: 'Denominacion Tutor',
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
        console.log('Nivel guardado:', {
            nombreNivel: this.nombreNivel,
            siglaNivel: this.siglaNivel,
            nombreCursos: this.nombreCursos,
            abrevCurso: this.abrevCurso,
            estado: this.estado,
        })
    }
}
