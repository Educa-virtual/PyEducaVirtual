import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { DialogModule } from 'primeng/dialog'

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
    ],
    templateUrl: './gestion-traslados.component.html',
    styleUrl: './gestion-traslados.component.scss',
    providers: [],
})
export class GestionTrasladosComponent implements OnInit, OnChanges, OnDestroy {
    form: FormGroup
    visible: boolean = false

    constructor(private fb: FormBuilder) {}
    ngOnDestroy(): void {
        throw new Error('Method not implemented.')
    }
    ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.', changes)
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.')
    }

    showModeCreateDialog() {}
    // ngOnInit() {}

    // ngOnChanges(changes) {}

    // ngOnDestroy() {}

    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoInicio',
            header: 'Estudiante',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoFin',
            header: 'Fecha declarada',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoFin',
            header: 'IE Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
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
