import { Component, OnInit } from '@angular/core'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'

import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-gestion-vacantes',
    standalone: true,
    imports: [
        ContainerPageComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
        TablePrimengComponent,
    ],
    templateUrl: './gestion-vacantes.component.html',
    styleUrl: './gestion-vacantes.component.scss',
})
export class GestionVacantesComponent implements OnInit {
    form: FormGroup
    showModal: boolean = false
    selectRowData: any
    registro_vacantes: any[] = []
    tipo_constancia: any[] = []
    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // throw new Error('Method not implemented.')

        try {
            this.form = this.fb.group({
                cTipoConstancia: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
                cVacantesRegular: [0, Validators.required],
                cVacanteNEE: [0, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }
    selectRow(data) {
        this.selectRowData = data
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        switch (accion) {
            case 'guardar':
                this.showModal = true
                break
            case 'imprimir':
                this.showModal = true
                break
            default:
                break
        }
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Guardar Vacantes',
            text: 'Guardar vacantes',
            icon: 'pi pi-plus',
            accion: 'guardar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Imprimir Vacantes',
            text: 'Imprimir vacantes',
            icon: 'pi pi-pdf',
            accion: 'imprimir',
            class: 'p-button-danger',
        },
    ]
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
}
