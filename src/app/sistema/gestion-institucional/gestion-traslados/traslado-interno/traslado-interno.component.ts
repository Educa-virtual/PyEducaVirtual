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
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'

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
    perfil: any
    grados: any[] = []
    secciones: any[] = []
    params_nivel: string
    vacantes: any[]

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

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private messageService: MessageService,
        public query: GeneralService
    ) {}

    //   ngOnDestroy(): void {
    //     throw new Error('Method not implemented.')
    // }
    ngOnInit(): void {
        // throw new Error('Method not implemented.')
        this.perfil = this.store.getItem('dremoPerfil')
        const iYAcadId = this.store.getItem('dremoiYAcadId')
        this.searchVacantes(iYAcadId, this.perfil.iSedeId) //valida año seleccionado

        this.getNivelTipoId() // consulta los grados
        this.getSeccion() // conuslta las seciones
        try {
            this.form = this.fb.group({
                iGrado: [0, Validators.required],
                iSeccion: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
                cDisponible: [
                    { value: 0, disabled: true },
                    Validators.required,
                ],
                cVacantes: [{ value: 0, disabled: true }, Validators.required],
                cVacantesRegular: [{ value: 0, disabled: true }],
                cVacantesNEE: [{ value: 0, disabled: true }],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    getNivelTipoId() {
        this.query
            .searchGradoCiclo({
                iNivelTipoId: this.perfil.iNivelTipoId,
            })
            .subscribe({
                next: (data: any) => {
                    this.grados = data.data
                    console.log('this.grados', this.grados)
                },
                error: (error) => {
                    console.error('Error fetching grados:', error)
                },
            })

        // grado 3-8 primaria  9-13 secundaria 1-2 inicial
    }

    getSeccion() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'secciones',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.secciones = data.data
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    this.secciones.unshift({
                        iSeccionId: '0',
                        cSeccionDescripcion: 'Todas las secciones',
                    }) // console.log('Request completed')
                },
            })

        // grado 3-8 primaria  9-13 secundaria 1-2 inicial
    }

    selectRow(data) {
        this.selectRowData = data
    }

    searchVacantes(iYearId, iSedeId) {
        const params = 'iYAcadId = ' + iYearId + ' and  iSedeId= ' + iSedeId
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'vacantes_ies',
                campos: '*',
                condicion: params,
            })
            .subscribe({
                next: (data: any) => {
                    this.vacantes = data.data
                    console.log(this.vacantes)
                },
                error: (error) => {
                    console.error('Error fetching vacantes:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    const totalVacantesRegular = this.vacantes.reduce(
                        (sum, item) => sum + Number(item.iVacantesRegular),
                        0
                    )
                    const totalVacantesNEE = this.vacantes.reduce(
                        (sum, item) => sum + Number(item.iVacantesNEE),
                        0
                    )
                    const total = totalVacantesRegular + totalVacantesNEE

                    this.form.controls['cVacantesRegular'].setValue(
                        totalVacantesRegular
                    )
                    this.form.controls['cVacantesNEE'].setValue(
                        totalVacantesNEE
                    )
                    this.form.controls['cVacantes'].setValue(total)
                },
            })
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
