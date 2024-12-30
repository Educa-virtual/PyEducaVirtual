import { PrimengModule } from '@/app/primeng.module'

import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    OnInit,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-add-docente',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './add-docente.component.html',
    styleUrl: './add-docente.component.scss',
})
export class AddDocenteComponent implements OnChanges, OnInit {
    @Output() filtrarDocente = new EventEmitter()

    @Input() configuracion
    @Input() minimo
    @Input() caption
    @Input() visible
    @Input() turnos
    @Input() grados
    @Input() secciones
    @Input() areas
    @Input() docentes
    @Input() c_accion
    @Input() horas_asignadas
    @Input() lista_areas_docente
    @Input() area

    form: FormGroup

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            idDocCursoId: [0], // PK,
            iSemAcadId: [0], // tabla docente_curso (FK)
            iYAcadId: [0], // tabla docente_curso (FK)
            iDocenteId: [0, Validators.required], // tabla docente_curso (FK)
            iIeCursoId: [{ value: 0, disabled: true }],

            iModalServId: [0],

            iSeccionId: [{ value: 0, disabled: true }, Validators.required], // tabla docente_curso (FK)
            iTurnoId: [{ value: 0, disabled: true }, Validators.required], // tabla docente_curso (FK)
            cDocCursoObsevaciones: [''], // tabla docente_curso (FK)
            // iDocCursoHorasLectivas: [0, [Validators.pattern(/^\d+$/),  Validators.min(4), Validators.max(40)]],
            iEstado: [1],
            iCursoId: [{ value: 0, disabled: true }],

            iNivelGradoId: [{ value: 0, disabled: true }],
            cCicloNombre: [{ value: '', disabled: true }],
            cNivelNombre: [{ value: '', disabled: true }],
            cNivelTipoNombre: [{ value: '', disabled: true }],
            ihora_disponible: [{ value: 0 }],
            ihora_total: [
                { value: 0, disabled: true },
                [Validators.pattern(/^\d+$/)],
                Validators.required,
            ],
            ihora_asignada: [
                { value: 0, disabled: true },
                [Validators.pattern(/^\d+$/)],
                Validators.required,
            ],

            iCursosNivelGradId: [],
            iCursosNivelGradId_ies_cursos: [],
            iDocenteId_ies_curso: [],
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['area'] && changes['area'].currentValue) {
            this.formulario()
        }
    }

    formulario() {
        this.form.get('iYAcadId').setValue(this.configuracion[0].iYAcadId)
        console.log(this.configuracion, 'configuracion')
        console.log(this.minimo, 'minimo')
        console.log(this.caption, 'caption')
        console.log(this.visible, 'visible')
        console.log(this.turnos, 'turnos')
        console.log(this.grados, 'grados')
        console.log(this.secciones, 'secciones')
        console.log(this.areas, 'areas')
        console.log(this.docentes, 'docentes')
        console.log(this.c_accion, 'c_accion')
        console.log(this.horas_asignadas, 'horas_asignadas')
        console.log(this.lista_areas_docente, 'lista_areas_docente')
        console.log(this.area, 'area')
    }

    onChange(event: any, action: string) {
        switch (action) {
            case 'docente':
                console.log(event, 'event onchange')
                break
            case 'grado':
                console.log(event, 'event onchange')
                break
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                //this.addPersonal();

                break
            case 'editar':
                //this.updatePersonal();

                break
        }
    }
    selectedItems = []

    actionsArea: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    columnaArea = [
        {
            type: 'item',
            width: '3%',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '1rem',
            field: 'cCursoNombre',
            header: 'Área',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cGradoNombre',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cSeccionNombre',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'nCursoTotalHoras',
            header: 'Hora',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actionsArea',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
