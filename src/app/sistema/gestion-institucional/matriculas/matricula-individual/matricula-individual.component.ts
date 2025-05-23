import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosMatriculaService } from '../../services/datos-matricula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { PrimengModule } from '@/app/primeng.module'
import { DatosEstudianteService } from '../../services/datos-estudiante-service'
import { GeneralService } from '@/app/servicios/general.service'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { CompartirMatriculaService } from '../../services/compartir-matricula.service'

@Component({
    selector: 'app-matricula-individual',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './matricula-individual.component.html',
    styleUrl: './matricula-individual.component.scss',
})
export class MatriculaIndividualComponent implements OnInit {
    form: FormGroup

    iSedeId: number
    iYAcadId: number

    grados_secciones_turnos: Array<object>
    tipos_matriculas: Array<object>
    nivel_grados: Array<object>
    secciones: Array<object>
    turnos: Array<object>

    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private datosMatriculaService: DatosMatriculaService,
        private datosEstudianteService: DatosEstudianteService,
        private compartirMatriculaService: CompartirMatriculaService,
        private constantesService: ConstantesService,
        private store: LocalStoreService,
        private fb: FormBuilder,
        private query: GeneralService,
        private router: Router,
        private messageService: MessageService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
    }

    ngOnInit(): void {
        this.iYAcadId = this.constantesService.iYAcadId

        try {
            this.form = this.fb.group({
                iMatrId: [0],
                iTipoMatrId: [null, Validators.required],
                dtMatrFecha: [Date(), Validators.required],
                iNivelGradoId: [null, [Validators.required]],
                iSeccionId: [null],
                iTurnoId: [null, [Validators.required]],
                iEstudianteId: [null, [Validators.required]],
                cEstCodigo: ['', [Validators.required]],
                apenomEstudiante: [{ value: '', disabled: true }],
                cMatrObservaciones: [''],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }
        this.searchGradoSeccionTurno()
        this.getTiposMatriculas()

        this.form.get('iNivelGradoId').valueChanges.subscribe((value) => {
            this.secciones = []
            this.turnos = []
            this.form.get('iTurnoId')?.setValue(null)
            this.form.get('iSeccionId')?.setValue(null)
            if (value) {
                this.filterTurnos(value)
            }
        })

        this.form.get('iTurnoId').valueChanges.subscribe((value) => {
            this.secciones = []
            this.form.get('iSeccionId')?.setValue(null)
            if (value) {
                const iNivelGradoId = this.form.get('iNivelGradoId')?.value
                this.filterSecciones(iNivelGradoId, value)
            }
        })
        this.setFormMatricula()
        this.setEstudiante()
    }

    searchGradoSeccionTurno() {
        this.datosMatriculaService
            .searchGradoSeccionTurno({
                opcion: 'TODO',
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data.data)
                    this.grados_secciones_turnos = data.data
                    this.filterGrados()
                },
                error: (error) => {
                    console.error('Error consultando nivel grados:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    filterGrados() {
        this.nivel_grados = this.grados_secciones_turnos.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.id === current.iNivelGradoId &&
                        item.nombre === current.cGradoNombre
                )
                if (!x) {
                    return prev.concat([
                        {
                            id: current.iNivelGradoId,
                            nombre: current.cGradoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.nivel_grados, 'nivel grados')
    }

    filterTurnos(iNivelGradoId: any) {
        this.turnos = this.grados_secciones_turnos.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.id === current.iTurnoId &&
                        item.nombre === current.cTurnoNombre
                )
                if (!x && current.iNivelGradoId === iNivelGradoId) {
                    return prev.concat([
                        {
                            id: current.iTurnoId,
                            nombre: current.cTurnoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        if (this.turnos.length === 1) {
            this.form.get('iTurnoId')?.setValue(this.turnos[0]['id'])
        }
        console.log(this.turnos, 'turnos')
    }

    filterSecciones(iNivelGradoId: any, iTurnoId: any) {
        this.secciones = this.grados_secciones_turnos.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.id === current.iSeccionId &&
                        item.nombre === current.cSeccionNombre
                )
                if (
                    !x &&
                    current.iNivelGradoId === iNivelGradoId &&
                    current.iTurnoId === iTurnoId
                ) {
                    return prev.concat([
                        {
                            id: current.iSeccionId,
                            nombre: current.cSeccionNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        if (this.turnos.length === 1) {
            this.form.get('iSeccionId')?.setValue(this.secciones[0]['id'])
        }
        console.log(this.secciones, 'secciones')
    }

    getTiposMatriculas() {
        this.query
            .searchTablaXwhere({
                esquema: 'acad',
                tabla: 'tipo_matriculas',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.tipos_matriculas = item.map((tipo) => ({
                        id: tipo.iTipoMatrId,
                        nombre: tipo.cTipoMatrNombre,
                    }))
                    console.log(this.tipos_matriculas, 'tipos de matriculas')
                },
                error: (error) => {
                    console.error(
                        'Error consultando tipos de matriculas:',
                        error
                    )
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    searchEstudiante() {
        this.datosEstudianteService
            .searchEstudiante({
                cEstCodigo: this.form.get('cEstCodigo')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    if (!item) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Información',
                            detail: 'No se encontró el estudiante',
                        })
                    } else {
                        this.form
                            .get('iEstudianteId')
                            ?.setValue(item.iEstudianteId)
                        this.form
                            .get('apenomEstudiante')
                            ?.setValue(item._cPersApenom)
                    }
                },
                error: (error) => {
                    console.error('Error buscando estudiante:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    setFormMatricula() {
        if (this.compartirMatriculaService.getiMatrId() == null) {
            return null
        }
        this.datosMatriculaService
            .searchMatricula({
                iMatrId: this.compartirMatriculaService.getiMatrId(),
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    console.log(item)
                    this.form.get('iEstudianteId')?.setValue(item.iEstudianteId)
                    this.form.get('iTipoMatrId')?.setValue(item.iTipoMatrId)
                    this.form.get('iNivelGradoId')?.setValue(item.iNivelGradoId)
                    this.form.get('iSeccionId')?.setValue(item.iSeccionId)
                    this.form.get('iTurnoId')?.setValue(item.iTurnoId)
                    this.form.get('iEstudianteId')?.setValue(item.iEstudianteId)
                    this.form.get('cEstCodigo')?.setValue(item.cEstCodigo)
                    this.form
                        .get('apenomEstudiante')
                        ?.setValue(item._cEstApenom)
                    this.form
                        .get('cMatrObservaciones')
                        ?.setValue(item.cMatrObservaciones)
                    this.form
                        .get('dtMatrFecha')
                        ?.setValue(
                            item.dtMatrFecha ? new Date(item.dtMatrFecha) : null
                        )
                },
                error: (error) => {
                    console.error('Error obteniendo matricula:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    setEstudiante() {
        if (
            this.compartirMatriculaService.getiEstudianteId() == null ||
            this.compartirMatriculaService.getiMatrId() !== null
        ) {
            return null
        }
        this.datosEstudianteService
            .searchEstudiante({
                iEstudianteId:
                    this.compartirMatriculaService.getiEstudianteId(),
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    if (item) {
                        this.form
                            .get('iEstudianteId')
                            ?.setValue(item.iEstudianteId)
                        this.form.get('cEstCodigo')?.setValue(item.cEstCodigo)
                        this.form
                            .get('apenomEstudiante')
                            .setValue(item._cEstApenom)
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo matricula:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    guardarMatricula() {
        this.datosMatriculaService
            .guardarMatricula({
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
                iCredSesionId: this.constantesService.iCredId,
                iEstudianteId: this.form.get('iEstudianteId')?.value,
                iNivelGradoId: this.form.get('iNivelGradoId')?.value,
                iTurnoId: this.form.get('iTurnoId')?.value,
                iSeccionId: this.form.get('iSeccionId')?.value,
                dtMatrFecha: this.form.get('dtMatrFecha')?.value,
                iTipoMatrId: this.form.get('iTipoMatrId')?.value,
                cMatrObservaciones: this.form.get('cMatrObservaciones')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'guardar matricula')
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Matrícula registrada',
                    })
                    setTimeout(() => {
                        this.router.navigate([
                            '/gestion-institucional/gestion-matriculas',
                        ])
                    }, 1000)
                },
                error: (error) => {
                    console.error('Error guardando matricula:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    salir() {
        this.compartirMatriculaService.clearData()
        this.router.navigate(['/gestion-institucional/gestion-matriculas'])
    }
}
