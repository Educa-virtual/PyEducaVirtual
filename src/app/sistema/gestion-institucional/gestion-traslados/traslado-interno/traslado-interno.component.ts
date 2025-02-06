import { Component, OnInit } from '@angular/core'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-traslado-interno',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
    ],
    templateUrl: './traslado-interno.component.html',
    styleUrl: './traslado-interno.component.scss',
})
export class TrasladoInternoComponent implements OnInit {
    form: FormGroup
    selectRowData: any

    data: any[] = [
        {
            iTipoConstancia: 1,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 2,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 3,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 4,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 5,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 6,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 7,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 8,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 9,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
        {
            iTipoConstancia: 10,
            nEstudianteDni: 45037011,
            cEstudianteNombre: 'Gonzales, Juan',
            cGradoEdadAnterior: '1° Secundaria',
            cValidacion: 'Validado',
        },
    ]
    tipo_constancia: any[] = [
        {
            iTipoConstancia: 1,
            cTipoConstancia: 'Primero',
        },
        {
            iTipoConstancia: 2,
            cTipoConstancia: 'Segundo',
        },
        {
            iTipoConstancia: 3,
            cTipoConstancia: 'Tercero',
        },
        {
            iTipoConstancia: 4,
            cTipoConstancia: 'Cuarto',
        },
        {
            iTipoConstancia: 5,
            cTipoConstancia: 'quinto',
        },
    ]

    anio_constancia: any[] = [
        {
            iAnioConstancia: 1,
            cAnioConstancia: '2021',
        },
        {
            iAnioConstancia: 2,
            cAnioConstancia: '2022',
        },
        {
            iAnioConstancia: 3,
            cAnioConstancia: '2023',
        },
        {
            iAnioConstancia: 4,
            cAnioConstancia: '2024',
        },
        {
            iAnioConstancia: 5,
            cAnioConstancia: '2025',
        },
    ]

    constructor(private fb: FormBuilder) {}

    //   ngOnDestroy(): void {
    //     throw new Error('Method not implemented.')
    // }
    ngOnInit(): void {
        // throw new Error('Method not implemented.')

        try {
            this.form = this.fb.group({
                cTipoConstancia: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
                cDisponible: [0, Validators.required],
                cVacantes: [0, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    selectRow(data) {
        this.selectRowData = data
    }

    columns: IColumn[] = [
        {
            type: 'item',
            width: '5rem',
            field: 'item',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nEstudianteDni',
            header: 'DNI',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cEstudianteNombre',
            header: 'Apellidos y Nombres',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '5rem',
            field: 'cGradoEdadAnterior',
            header: 'Grado/edad (Año anterior)',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cValidacion',
            header: 'Validación DNI',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'checkbox',
            width: '5rem',
            field: 'checkbox',
            header: '',
            text_header: 'center',
            text: 'center',
        },
    ]

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Traslado Externo',
            text: 'Solicitud Externa',
            icon: 'pi pi-plus',
            accion: 'externo',
            class: 'p-button-warning',
        },
        {
            labelTooltip: 'Traslado Interno',
            text: 'Traslado Interno',
            icon: 'pi pi-plus',
            accion: 'interno',
            class: 'p-button-primary',
        },
    ]
}
