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
    selector: 'app-traslado-externo',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
    ],
    templateUrl: './traslado-externo.component.html',
    styleUrl: './traslado-externo.component.scss',
})
export class TrasladoExternoComponent implements OnInit {
    form: FormGroup
    tipo_constancia: any[] = [
        {
            iTipoConstancia: 1,
            cTipoConstancia: 'Constancia de Estudios',
        },
        {
            iTipoConstancia: 2,
            cTipoConstancia: 'Constancia de Matrícula',
        },
        {
            iTipoConstancia: 3,
            cTipoConstancia: 'Constancia de Egreso',
        },
        {
            iTipoConstancia: 4,
            cTipoConstancia: 'Constancia de Conducta',
        },
        {
            iTipoConstancia: 5,
            cTipoConstancia: 'Constancia de Notas',
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

    ngOnInit(): void {
        // throw new Error('Method not implemented.')

        try {
            this.form = this.fb.group({
                cTipoTraslado: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
                cIEOrigen: [0, Validators.required],
                cDocumentoEstudiante: [0, Validators.required],
                cDocumento: [0, Validators.required],
                cUltimoAnioEstudio: [0, Validators.required],
                cUltimoGradoEstudio: [0, Validators.required],
                cGradoTrasladar: [0, Validators.required],
                dFechaTraslado: [0, Validators.required],
                cDeclaracionJurada: [0, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }
    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Cod. Estudiante',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Estudiante',
            text_header: 'center',
            text: 'center',
        },
    ]

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Traslado Externo',
            text: 'Registrar traslado',
            icon: 'pi pi-plus',
            accion: 'externo',
            class: 'p-button-warning',
        },
    ]
}
