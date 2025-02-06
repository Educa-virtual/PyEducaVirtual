import {
    Component,
    OnInit,
    // SimpleChanges,
} from '@angular/core'
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
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { ActivatedRoute } from '@angular/router'
import { TrasladoExternoComponent } from './traslado-externo/traslado-externo.component'
import { TrasladoInternoComponent } from './traslado-interno/traslado-interno.component'

@Component({
    selector: 'app-gestion-traslados',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        CheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        TrasladoExternoComponent,
        TrasladoInternoComponent,
    ],
    templateUrl: './gestion-traslados.component.html',
    styleUrl: './gestion-traslados.component.scss',
    providers: [],
})
export class GestionTrasladosComponent implements OnInit {
    form: FormGroup
    visible: boolean = false
    modal: string = ''
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

    constructor(
        private fb: FormBuilder,
        public route: ActivatedRoute
    ) {}

    // ngOnDestroy(): void {
    //     throw new Error('Method not implemented.')
    // }
    // ngOnChanges(changes: SimpleChanges): void {
    //     throw new Error('Method not implemented.', changes)
    //     this.showModeCreateDialog();
    // }
    ngOnInit(): void {
        // throw new Error('Method not implemented.')

        try {
            this.form = this.fb.group({
                cTipoConstancia: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    trasladar(elemento): void {
        const { accion } = elemento
        switch (accion) {
            case 'externo':
                this.visible = true
                this.modal = 'externo'
                break
            default:
                this.visible = true
                this.modal = 'interno'
                break
        }
    }

    // ngOnInit() {}

    // ngOnChanges(changes) {}

    // ngOnDestroy() {}

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
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoInicio',
            header: 'Cod. Mod Origen',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'I.E Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Fecha Matricula Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Nivel Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Grado Destino',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Año Destino',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'N° de Resolución',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
