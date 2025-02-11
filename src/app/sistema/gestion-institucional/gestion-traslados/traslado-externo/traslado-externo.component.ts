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
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'

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
    providers: [MessageService],
})
export class TrasladoExternoComponent implements OnInit {
    form: FormGroup
    tipo_traslados: any[] = []
    estudiante: any[] = []
    tipo_documentos: any[] = []
    matriculas: any[]
    instituciones: any[]
    grados: any[]
    year_Academicos: any
    perfil: any

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        public query: GeneralService,
        private store: LocalStoreService
    ) {}

    ngOnInit(): void {
        this.perfil = this.store.getItem('dremoPerfil')

        console.log(this.perfil)
        this.getTipoTraslado() // consulta tipo de traslados
        this.getTipoDocumento() // consulta tipo de documentos
        this.getIntitucionEducativa() // institucion educativa
        this.getNivelTipoId() // consulta los grados que cuenta
        this.getYear() // consulta años

        // throw new Error('Method not implemented.')

        try {
            this.form = this.fb.group({
                cTipoTraslado: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                iIieeId: [{ value: 0, disabled: true }, Validators.required],
                cDocumentoEstudiante: [null, Validators.required],
                cDocumento: [null, Validators.required],
                iYearId: [{ value: 0, disabled: true }, Validators.required],
                cUltimoGradoEstudio: [
                    { value: 0, disabled: true },
                    Validators.required,
                ],
                cGradoTrasladar: [0, Validators.required],
                dFechaTraslado: [null, Validators.required],
                cDeclaracionJurada: [0, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    getTipoTraslado(): void {
        // consulta tipo de traslados
        this.query.searhTipoTraslados().subscribe({
            next: (data: any) => {
                this.tipo_traslados = data.data
            },
            error: (error) => {
                console.error('Error fetching tipos de traslados:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }

    getTipoDocumento(): void {
        this.query
            .searchCalAcademico({
                esquema: 'grl',
                tabla: 'tipos_Identificaciones',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.tipo_documentos = data.data
                },
                error: (error) => {
                    console.error('Error fetching Tipo documentos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                //    complete: () => {
                //     console.log(this.tipo_documentos)
                //        // console.log('Request completed')
                //    },
            })
    }

    getIntitucionEducativa() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'institucion_educativas',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.instituciones = data.data
                },
                error: (error) => {
                    console.error('Error fetching Tipo documentos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                // complete: () => {
                //  console.log(this.instituciones)
                //     // console.log('Request completed')
                // },
            })
    }

    getYear() {
        this.query.getYear().subscribe({
            next: (data: any) => {
                this.year_Academicos = data.data
            },
            error: (error) => {
                console.error('Error fetching Año calendario', error)
                this.messageService.add({
                    severity: 'danger',
                    summary: 'Mensaje',
                    detail: 'Error en ejecución',
                })
            },
        })
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
    }

    validarDNI() {
        const cDocumentoEstudiante = this.form.value.cDocumentoEstudiante //{ dni: this.form.value.cDocumentoEstudiante }];

        if (!cDocumentoEstudiante) {
            alert('El DNI está vacío o es inválido')
            return
        } else {
            this.query
                .obtenerInformacionEstudianteDNI({ dni: cDocumentoEstudiante })
                .subscribe({
                    next: (data: any) => {
                        this.estudiante = data.data
                        this.matriculas = this.estudiante[0].matriculas
                        //  this.seccionesAsignadas = data.data.map((ambiente: any) => {
                        //     return {
                        //         ...ambiente, // Mantén todos los campos originales
                        //         arrayAmbientes: {
                        //             ciclo: ambiente.cCicloRomanos,
                        //             grado: ambiente.cGradoNombre,
                        //             seccion: ambiente.cSeccionNombre,
                        //             estudiantes: ambiente.iDetConfCantEstudiantes,
                        //             ambiente: ambiente.cAmbienteNombre,
                        //         },
                        //     }
                        // })
                    },
                    error: (error) => {
                        console.log('Error fetching validar estudiante:', error)
                    },
                    complete: () => {
                        console.log('estudiantes', this.estudiante)
                        const registro = JSON.parse(
                            this.estudiante[0].matriculas
                        )
                        // this.estudiante.iYeardId

                        this.matriculas = registro.map((m: any) => ({
                            iMatrId: m.iMatrId,
                            anio: m.anio,
                            iSeccionId: m.curso, // Verifica si "curso" realmente es el iSeccionId
                            iYearId: m.iYearId,
                            cSedeNombre: m.cSedeNombre,
                            cIieeDireccion: m.cIieeDireccion,
                            cIieeCodigoModular: m.cIieeCodigoModular,
                            iNivelGradoId: m.iNivelGradoId,
                            iTipoSectorId: m.iTipoSectorId,
                            iJuridUgelId: m.iJuridUgelId,
                            iNivelTipoId: m.iNivelTipoId,
                            cIieeRUC: m.cIieeRUC,
                            iIieeId: m.iIieeId,
                            cIieeNombre: m.cIieeNombre,
                            cMatrConclusionDescriptiva:
                                m.cMatrConclusionDescriptiva,
                        }))

                        this.form.controls['iIieeId']?.setValue(
                            this.matriculas[0].iIieeId.toString()
                        )
                        this.form.controls['iYearId']?.setValue(
                            this.matriculas[0].iYearId.toString()
                        )
                        this.form.controls['cUltimoGradoEstudio']?.setValue(
                            this.matriculas[0].iNivelGradoId.toString()
                        )
                        //  this.form.controls['cGradoTrasladar']?.setValue(this.matriculas[0].iNivelGradoId.toString());

                        // habilitar combos
                        this.form.controls['iIieeId'].enable()
                        this.form.controls['iYearId'].enable()
                        this.form.controls['cUltimoGradoEstudio'].enable()

                        //consulta los grados y ciclos

                        //alert(this.estudiante[0].cEstNombres + ' ' + this.estudiante[0].cEstMaterno + ' ' + this.estudiante[0].cEstPaterno )
                    },
                })
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
