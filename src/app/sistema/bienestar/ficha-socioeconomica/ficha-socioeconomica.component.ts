import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Router } from '@angular/router'

interface Estudiante {
    id: number
    apellidos: string
    nombres: string
    grado: string
    seccion: string
    dni: string
    fecha: string
}

@Component({
    selector: 'app-ficha-socioeconomica',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
        TablePrimengComponent,
    ],
    templateUrl: './ficha-socioeconomica.component.html',
    styleUrls: ['./ficha-socioeconomica.component.scss'],
})
export class FichaSocioeconomicaComponent {
    estudiantes: Estudiante[] = [
        {
            id: 1,
            apellidos: 'Alvarado Benavides',
            nombres: 'José Manuel',
            grado: 'Cuarto',
            seccion: 'A',
            dni: '72584639',
            fecha: '20/02/2025',
        },
        {
            id: 2,
            apellidos: 'Bustamante Cárdenas',
            nombres: 'María Fernanda',
            grado: 'Quinto',
            seccion: 'C',
            dni: '84629571',
            fecha: '21/02/2025',
        },
        {
            id: 3,
            apellidos: 'Castellanos Domínguez',
            nombres: 'Luis Alberto',
            grado: 'Segundo',
            seccion: 'B',
            dni: '63972854',
            fecha: '22/02/2025',
        },
        {
            id: 4,
            apellidos: 'Delgado Espinoza',
            nombres: 'Ana Sofía',
            grado: 'Primero',
            seccion: 'E',
            dni: '51738462',
            fecha: '23/02/2025',
        },
        {
            id: 5,
            apellidos: 'Fernández Gutiérrez',
            nombres: 'Ricardo Andrés',
            grado: 'Sexto',
            seccion: 'H',
            dni: '29467583',
            fecha: '24/02/2025',
        },
        {
            id: 6,
            apellidos: 'González Herrera',
            nombres: 'Valentina Isabel',
            grado: 'Primero',
            seccion: 'F',
            dni: '38576291',
            fecha: '25/02/2025',
        },
        {
            id: 7,
            apellidos: 'Hernández Ibarra',
            nombres: 'Sebastián Emilio',
            grado: 'Segundo',
            seccion: 'G',
            dni: '46819375',
            fecha: '26/02/2025',
        },
        {
            id: 8,
            apellidos: 'Flores Coayla',
            nombres: 'Fernando Leandro',
            grado: 'Cuarto',
            seccion: 'B',
            dni: '57284916',
            fecha: '27/02/2025',
        },
    ]

    searchForm: FormGroup

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
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
            width: '5rem',
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
            field: 'fecha',
            header: 'fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '5rem',
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
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
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

    nuevoIngreso() {
        this.router.navigate(['/bienestar/ficha/general'])
    }
    accionBnt({ accion }): void {
        switch (accion) {
            case 'agregarConclusion':
                // this.mostrarModalConclusionDesc = true
                // this.enviarDatosFinales(accion, item)
                break
        }
    }
}
