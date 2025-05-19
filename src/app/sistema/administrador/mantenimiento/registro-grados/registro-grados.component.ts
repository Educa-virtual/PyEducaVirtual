import { Component, OnInit } from '@angular/core'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
} from '@angular/forms'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { DropdownModule } from 'primeng/dropdown'

interface n_niveles {
    name: string
}

interface n_grados {
    name: string
}

@Component({
    selector: 'app-registro-grados',
    standalone: true,
    imports: [
        PanelModule,
        InputTextModule,
        TablePrimengComponent,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
    ],
    templateUrl: './registro-grados.component.html',
    styleUrl: './registro-grados.component.scss',
})
export class RegistroGradosComponent implements OnInit {
    formGroup!: FormGroup
    nNiveles: n_niveles[] = []
    nGrados: n_grados[] = []

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.nNiveles = [
            { name: 'Educacion Inicial' },
            { name: 'Educacion Primaria' },
            { name: 'Educacion Secundaria' },
        ]

        this.formGroup = this.fb.group({
            selectedNivel: [null],
            selectedGrado: [null],
            selectedAbrev: [''],
            selectedRoman: [''],
        })

        this.formGroup
            .get('selectedNivel')
            ?.valueChanges.subscribe((nivel: n_niveles | null) => {
                if (nivel?.name) {
                    this.cargarGradosPorNivel(nivel.name)
                } else {
                    this.nGrados = []
                }
                this.formGroup.get('selectedGrado')?.setValue(null)
            })

        this.formGroup
            .get('selectedGrado')
            ?.valueChanges.subscribe((grado: n_grados | null) => {
                if (grado?.name) {
                    const abrev = this.mapearGradoAAbreviatura(grado.name)
                    this.formGroup.get('selectedAbrev')?.setValue(abrev)
                } else {
                    this.formGroup.get('selectedAbrev')?.setValue('')
                }
            })

        this.formGroup
            .get('selectedGrado')
            ?.valueChanges.subscribe((grado: n_grados | null) => {
                if (grado?.name) {
                    const nRoman = this.mapearGradosRomanos(grado.name)
                    this.formGroup.get('selectedRoman')?.setValue(nRoman)
                } else {
                    this.formGroup.get('selectedRoman')?.setValue('')
                }
            })
    }

    cargarGradosPorNivel(nivel: string) {
        switch (nivel) {
            case 'Educacion Inicial':
                this.nGrados = [{ name: '0-2 años' }, { name: '3-5 años' }]
                break

            case 'Educacion Primaria':
                this.nGrados = [
                    { name: 'Primero' },
                    { name: 'Segundo' },
                    { name: 'Tercero' },
                    { name: 'Cuarto' },
                    { name: 'Quinto' },
                    { name: 'Sexto' },
                ]
                break

            case 'Educacion Secundaria':
                this.nGrados = [
                    { name: 'Primero' },
                    { name: 'Segundo' },
                    { name: 'Tercero' },
                    { name: 'Cuarto' },
                    { name: 'Quinto' },
                ]
                break

            default:
                this.nGrados = []
        }
    }

    //Linea nueva de codigo
    private mapearGradoAAbreviatura(grado: string): string {
        const mapa: Record<string, string> = {
            '0-2 años': '1ro.',
            '3-5 años': '2do.',
            Primero: '1ro.',
            Segundo: '2do.',
            Tercero: '3ro.',
            Cuarto: '4to.',
            Quinto: '5to.',
            Sexto: '6to.',
        }
        return mapa[grado] || ''
    }

    private mapearGradosRomanos(grado: string): string {
        const mapa: Record<string, string> = {
            '0-2 años': 'I',
            '3-5 años': 'II',
            Primero: 'I',
            Segundo: 'II',
            Tercero: 'III',
            Cuarto: 'IV',
            Quinto: 'V',
            Sexto: 'VI',
        }
        return mapa[grado] || ''
    }
    selectedItems = []
    datos = [
        {
            item: 1,
            nombgrado: '0-2 Años',
            gradabrev: '1ro',
            gradroman: 'I',
            acciones: 'Editar',
        },
        {
            item: 2,
            nombgrado: 'Primero',
            gradabrev: '1ro.',
            gradroman: 'I',
            acciones: 'Editar',
        },
        {
            item: 2,
            nombgrado: 'Segundo',
            gradabrev: '2do.',
            gradroman: 'III',
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
            field: 'nombgrado',
            header: 'Nombre del Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'gradabrev',
            header: 'Abreviacion del Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'gradroman',
            header: 'Nro. Grados en Romanos',
            text_header: 'center',
            text: 'center',
        },
    ]
}
