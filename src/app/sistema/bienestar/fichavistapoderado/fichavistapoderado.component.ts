import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'

interface Estudiante {
    id: number
    apellidos: string
    nombres: string
    grado: string
    seccion: string
    dni: string
    anio: string
}

@Component({
    selector: 'app-fichavistapoderado',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
        TablePrimengComponent,
    ],
    templateUrl: './fichavistapoderado.component.html',
    styleUrl: './fichavistapoderado.component.scss',
})
export class FichavistapoderadoComponent {
    estudiantes: Estudiante[] = [
        {
            id: 1,
            apellidos: 'Alvarado Benavides',
            nombres: 'José Manuel',
            grado: 'Cuarto',
            seccion: 'A',
            dni: '72584639',
            anio: '2025',
        },
        {
            id: 2,
            apellidos: 'Bustamante Cárdenas',
            nombres: 'María Fernanda',
            grado: 'Quinto',
            seccion: 'C',
            dni: '84629571',
            anio: '2025',
        },
        {
            id: 3,
            apellidos: 'Castellanos Domínguez',
            nombres: 'Luis Alberto',
            grado: 'Segundo',
            seccion: 'B',
            dni: '63972854',
            anio: '2024',
        },
        {
            id: 4,
            apellidos: 'Delgado Espinoza',
            nombres: 'Ana Sofía',
            grado: 'Primero',
            seccion: 'E',
            dni: '51738462',
            anio: '2024',
        },
        {
            id: 5,
            apellidos: 'Fernández Gutiérrez',
            nombres: 'Ricardo Andrés',
            grado: 'Sexto',
            seccion: 'H',
            dni: '29467583',
            anio: '2023',
        },
        {
            id: 6,
            apellidos: 'González Herrera',
            nombres: 'Valentina Isabel',
            grado: 'Primero',
            seccion: 'F',
            dni: '38576291',
            anio: '2022',
        },
        {
            id: 7,
            apellidos: 'Hernández Ibarra',
            nombres: 'Sebastián Emilio',
            grado: 'Segundo',
            seccion: 'G',
            dni: '46819375',
            anio: '2020',
        },
        {
            id: 8,
            apellidos: 'Flores Coayla',
            nombres: 'Fernando Leandro',
            grado: 'Cuarto',
            seccion: 'B',
            dni: '57284916',
            anio: '2020',
        },
    ]

    searchForm: FormGroup

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            nombre: [''],
            dni: [''],
        })
    }
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'apellidos',
            header: 'Apellidos',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombres',
            header: 'Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'grado',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'seccion',
            header: 'Seccion',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dni',
            header: 'DNI',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'anio',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '4rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Imprimir',
            icon: 'pi pi-print',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },

        {
            labelTooltip: 'Deshacer',
            icon: 'pi pi-undo',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    accionBnt({ accion }): void {
        switch (accion) {
            case 'agregarConclusion':
                // this.mostrarModalConclusionDesc = true
                // this.enviarDatosFinales(accion, item)
                break
        }
    }
}
