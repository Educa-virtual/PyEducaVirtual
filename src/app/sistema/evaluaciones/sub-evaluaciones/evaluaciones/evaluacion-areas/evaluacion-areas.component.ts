import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { forkJoin, Subject, takeUntil } from 'rxjs'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { CompartirIdEvaluacionService } from '../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { CompartirFormularioEvaluacionService } from '../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { PrimengModule } from '@/app/primeng.module'

interface NivelTipo {
    cNivelTipoNombre: string
    iNivelTipoId: string
}

@Component({
    selector: 'app-evaluacion-areas',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './evaluacion-areas.component.html',
    styleUrl: './evaluacion-areas.component.scss',
})
export class EvaluacionAreasComponent implements OnDestroy, OnInit {
    lista: any[] = [] //Aqui se guarda Lista Cursos Nivel Tipo.

    objectKeys = Object.keys
    datosPrimaria: any[] = []
    datosSecundaria: any[] = []
    nivelTipo: NivelTipo[] | undefined
    visible: boolean = false //Accion Editar, Ver, crear
    accion: string //Accion Editar, Ver, crear
    isDisabled: boolean
    cursosSeleccionados: any[] = []
    horaSeleccionada: Date = new Date() // Guarda la hora seleccionada

    @Input() _iEvaluacionId: number
    @Input() datosRecIeParticipanToAreas: any[] = [] // Recibir el dato desde el padre
    // Definimos el Output que va a emitir el evento
    @Output() closeModalEvent = new EventEmitter<any>()

    public cursos: any[] = [] // Asegúrate de tener esta variable declarada en tu componente
    public data: ICurso[] = []
    public selectedCursos: any[] = []
    public cursosTipo: any[] = [] //Aqui se guarda Lista Cursos Nivel Tipo.
    public searchText: Event
    public text: string = ''
    public sortField: string = ''
    public sortOrder: number = 0

    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }

    private _ref = inject(DynamicDialogRef)
    private unsubscribe$ = new Subject<boolean>()
    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)
    private _store = inject(LocalStoreService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    private _formBuilder = inject(FormBuilder)

    constructor(
        private store: LocalStoreService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig, // Inyección de configuración
        private cdRef: ChangeDetectorRef,
        private query: GeneralService,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService
    ) {}

    ngOnInit(): void {
        // Inicializar evaluaciones con valores vacíos
        this.getCursos()
        this.accion = this._config.data?.accion || 'crear'
        switch (this.accion) {
            case 'nuevo':
            case 'editar':
                this.searchAmbienteAcademico()
                break
            case 'ver':
                this.searchAmbienteAcademico()
                this.isDisabled = true
                break
        }
    }

    //Funcion de oncoruseSelect
    onCursoSelect(curso: any): void {
        //const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        const iEvaluacionId_ = this._iEvaluacionId
        if (curso.isSelected) {
            this.insertarCursos([curso], iEvaluacionId_)
        } else {
            this.eliminarCursos([curso], iEvaluacionId_)
        }
    }

    insertarCursos(cursos: any[], iEvaluacionId: number): void {
        // Determinar qué valor de iEvaluacionId usar
        const id =
            iEvaluacionId || this.compartirIdEvaluacionService.iEvaluacionId

        // Validar si se proporcionó un `iEvaluacionId` válido
        if (!id) {
            console.error('No se ha proporcionado un iEvaluacionId válido')
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha proporcionado un iEvaluacionId válido.',
            })
            return
        }

        // Validar si los cursos contienen el campo `iCursoNivelGradId`
        if (!cursos.every((curso) => curso.iCursoNivelGradId)) {
            console.error(
                'Error: Algunos cursos no contienen iCursoNivelGradId'
            )
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Algunos cursos no contienen iCursoNivelGradId.',
            })
            return
        }

        // Llamar a la API para insertar los cursos
        this._apiEre
            .insertarCursos({
                iEvaluacionId: id,
                selectedCursos: cursos, // Cursos con iCursoNivelGradId
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    if (this.accion == 'nuevo') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Cursos registrados',
                            detail: 'Los cursos se han registrado correctamente.',
                        })
                    } else if (this.accion == 'editar') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Cursos editados',
                            detail: 'Los cursos se han editado correctamente.',
                        })
                    }
                    console.log('Respuesta de la API:', resp)
                },
                error: (err) => {
                    console.error('Error al insertar cursos:', err)
                },
            })
    }

    eliminarCursos(cursos: any[], iEvaluacionId: number): void {
        const evaluacionId =
            this.compartirIdEvaluacionService.iEvaluacionId ||
            this._iEvaluacionId

        // Asegúrate de que iEvaluacionId y cursos están definidos
        if (!evaluacionId || !cursos || cursos.length === 0) {
            console.error(
                'Datos incompletos para eliminar cursos.',
                iEvaluacionId
            )
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se proporcionaron datos válidos para eliminar cursos.',
            })
            return
        }

        this._apiEre
            .eliminarCursos({
                iEvaluacionId: evaluacionId, // ID de la evaluación
                selectedCursos: cursos, // Lista de cursos seleccionados
            })
            .pipe(takeUntil(this.unsubscribe$)) // Para manejar la suscripción y evitar fugas de memoria
            .subscribe({
                next: (resp: any) => {
                    // Notifica el éxito
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Curso eliminado',
                        detail: 'El curso se eliminó correctamente.',
                    })
                    console.log('Cursos eliminados:', resp)
                },
                error: (err) => {
                    // Notifica el error
                    console.error('Error al eliminar cursos:', err)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo eliminar el curso.',
                    })
                },
            })
    }

    getCursos() {
        const year = this.store.getItem('dremoYear')
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'docente-cursos',
            ruta: 'list', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTARxiPersIdxiYearId',
                iCredId: this._constantesService.iCredId,
                valorBusqueda: year, //iYearId
                iSemAcadId: null,
                iIieeId: null,
            },
            params: { skipSuccessMessage: true },
        }
        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    this.cursos = response.data.map((curso) => ({
                        iCursoId: curso.idDocCursoId,
                        ...curso,
                    }))
                    this.data = this.cursos

                    console.log('datos', this.data)
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    obtenerCursosEvaluacion(evaluacionId: number) {
        evaluacionId

        return new Promise((resolve, reject) => {
            const evaluacionId =
                this.compartirIdEvaluacionService.iEvaluacionId ||
                this._iEvaluacionId

            this._apiEre
                .obtenerCursosEvaluacion(evaluacionId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (resp: any) => {
                        // Crear un mapa con los cursos obtenidos del backend
                        const cursosSeleccionados = new Map(
                            resp.cursos.map((curso: any) => [
                                curso.iCursoNivelGradId,
                                curso.isSelected === '1', // Convertir "1" a true
                            ])
                        )

                        // Actualizar el estado de los cursos en la estructura actual
                        this.lista.forEach((nivel: any) => {
                            Object.keys(nivel.grados).forEach((grado) => {
                                nivel.grados[grado].forEach((curso: any) => {
                                    curso.isSelected =
                                        cursosSeleccionados.get(
                                            curso.iCursoNivelGradId
                                        ) || false
                                })
                            })
                        })
                        // Forzar detección de cambios para actualizar la vista
                        this.cdRef.markForCheck()

                        resolve(resp.cursos)
                    },
                    error: (err) => {
                        console.error('Error al obtener cursos:', err)
                        reject(err)
                    },
                })
        })
    }

    obtenerCursosSeleccionados(): Promise<Map<number, boolean>> {
        return new Promise((resolve, reject) => {
            const evaluacionId = this._iEvaluacionId
            if (!evaluacionId) {
                return reject('El ID de la evaluación no está definido.')
            }

            this._apiEre
                .obtenerCursosEvaluacion(evaluacionId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (resp: any) => {
                        // Crear un mapa con los cursos seleccionados
                        const cursosSeleccionados: Map<number, boolean> =
                            new Map(
                                resp.cursos.map((curso: any) => [
                                    curso.iCursoNivelGradId as number, // Asegurar que sea número
                                    curso.isSelected === '1', // Convertir "1" a true
                                ])
                            )

                        // Limpia la lista para evitar datos residuales
                        this.lista.forEach((nivel: any) => {
                            Object.keys(nivel.grados).forEach((grado) => {
                                nivel.grados[grado].forEach((curso: any) => {
                                    curso.isSelected = false // Resetear a false
                                })
                            })
                        })

                        // Actualizar con los nuevos datos
                        this.lista.forEach((nivel: any) => {
                            Object.keys(nivel.grados).forEach((grado) => {
                                nivel.grados[grado].forEach((curso: any) => {
                                    // Si el curso está en el mapa, actualizamos su estado
                                    curso.isSelected =
                                        cursosSeleccionados.get(
                                            curso.iCursoNivelGradId
                                        ) || false
                                })
                            })
                        })
                        resolve(cursosSeleccionados)
                    },
                    error: (err) => {
                        console.error('Error al obtener cursos:', err)
                        reject(err)
                    },
                })
        })
    }

    // Llamar a la función para obtener los datos de primaria y secundaria
    searchAmbienteAcademico() {
        // Realizamos ambas solicitudes al mismo tiempo utilizando forkJoin
        forkJoin({
            primaria: this.query.searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelGradoId: 3, // Primaria
                }),
                _opcion: 'getCursosNivelGrado',
            }),
            secundaria: this.query.searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelGradoId: 4, // Secundaria
                }),
                _opcion: 'getCursosNivelGrado',
            }),
        }).subscribe({
            next: (data: any) => {
                // Combinamos los datos
                this.lista = [
                    ...this.extraerAsignatura(data.primaria.data),
                    ...this.extraerAsignatura(data.secundaria.data),
                ]
                this.obtenerCursosSeleccionados()
            },
            error: (err: any) => {
                console.error('Error al obtener los datos:', err)
            },
        })
    }
    // Función para estructurar los datos
    extraerAsignatura(data: any): any[] {
        if (!Array.isArray(data)) {
            console.error('Error: Los datos no son un arreglo')
            return []
        }

        // Estructuramos los datos por nivel y grado
        const groupedData = data.reduce((acc: any, item: any) => {
            const nivel = item.cNivelTipoNombre ?? 'Sin Descripción'
            const grado = item.cGradoAbreviacion ?? 'Sin Abreviación'
            if (!acc[nivel]) {
                acc[nivel] = [] // Cada nivel contiene grados
            }

            if (!acc[nivel][grado]) {
                acc[nivel][grado] = [] // Cada grado contiene cursos
            }

            acc[nivel][grado].push({
                iCursoNivelGradId: item.iCursosNivelGradId, // Nuevo campo
                cCursoNombre: item.cCursoNombre ?? 'Sin Nombre',
                isSelected: false, // Propiedad para checkbox
            })

            return acc
        }, {})

        // Convertir el objeto agrupado en un arreglo
        return Object.keys(groupedData).map((nivel) => ({
            nivel,
            grados: groupedData[nivel],
        }))
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
    onChange() {}
    closeModal(data) {
        this._ref.close(data)
    }
}
