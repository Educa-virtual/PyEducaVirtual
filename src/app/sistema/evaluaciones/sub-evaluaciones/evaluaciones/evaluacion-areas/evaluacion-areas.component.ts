import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core'
import { forkJoin, Subject, takeUntil } from 'rxjs'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { PrimengModule } from '@/app/primeng.module'

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
    accion: string //Accion Editar, Ver, crear
    isDisabled: boolean = false

    @Input() _iEvaluacionId: number

    public cursos: any[] = [] // Asegúrate de tener esta variable declarada en tu componente
    public data: ICurso[] = []
    public selectedCursos: any[] = []
    public cursosTipo: any[] = [] //Aqui se guarda Lista Cursos Nivel Tipo.

    private unsubscribe$ = new Subject<boolean>()
    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    private store = inject(LocalStoreService)
    private _config = inject(DynamicDialogConfig)

    ngOnInit(): void {
        // Inicializar evaluaciones con valores vacíos
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
        if (this.accion === 'ver') {
            return
        }
        if (curso.isSelected) {
            this.insertarCursos([curso])
        } else {
            this.eliminarCursos([curso])
        }
    }

    insertarCursos(cursos: any[]): void {
        // Validar si se proporcionó un `iEvaluacionId` válido
        if (!this._iEvaluacionId) {
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
                iEvaluacionId: this._iEvaluacionId,
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

    eliminarCursos(cursos: any[]): void {
        // Asegúrate de que iEvaluacionId y cursos están definidos
        if (!this._iEvaluacionId || !cursos || cursos.length === 0) {
            console.error(
                'Datos incompletos para eliminar cursos.',
                this._iEvaluacionId
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
                iEvaluacionId: this._iEvaluacionId, // ID de la evaluación
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

                        this.data = resp.cursos
                        const cursosSeleccionados: Map<number, boolean> =
                            new Map(
                                resp.cursos.map((curso: any) => [
                                    curso.iCursoNivelGradId as number, // Asegurar que sea número
                                    curso.isSelected === '1', // Convertir "1" a true
                                    curso.dtExamenFechaInicio,
                                ])
                            )

                        // Limpia la lista para evitar datos residuales
                        this.lista.forEach((nivel: any) => {
                            Object.keys(nivel.grados).forEach((grado) => {
                                nivel.grados[grado].forEach((curso: any) => {
                                    curso.cGrado = grado
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
                                    curso.dtExamenFechaInicio = this.data.find(
                                        (i) =>
                                            i.iCursoNivelGradId ===
                                            curso.iCursoNivelGradId
                                    )?.dtExamenFechaInicio
                                    curso.dtExamenFechaFin = this.data.find(
                                        (i) =>
                                            i.iCursoNivelGradId ===
                                            curso.iCursoNivelGradId
                                    )?.dtExamenFechaFin
                                    curso.iExamenCantidadPreguntas =
                                        this.data.find(
                                            (i) =>
                                                i.iCursoNivelGradId ===
                                                curso.iCursoNivelGradId
                                        )?.iExamenCantidadPreguntas
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
            primaria: this._generalService.searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelGradoId: 3, // Primaria
                }),
                _opcion: 'getCursosNivelGrado',
            }),
            secundaria: this._generalService.searchAmbienteAcademico({
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
    guardarFechaCantidadExamenCursos(curso) {
        if (this.accion === 'ver') {
            return
        }
        if (!this._iEvaluacionId) {
            console.error('No se ha proporcionado un iEvaluacionId válido')
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha proporcionado un iEvaluacionId válido.',
            })
            return
        }
        // Validar si los cursos contienen el campo `iCursoNivelGradId`

        if (!curso.iCursoNivelGradId) {
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
            .guardarFechaCantidadExamenCursos({
                iEvaluacionId: this._iEvaluacionId,
                iCursoNivelGradId: curso.iCursoNivelGradId,
                dtExamenFechaInicio: curso.dtExamenFechaInicio,
                iExamenCantidadPreguntas: curso.iExamenCantidadPreguntas,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Guardado',
                        detail: 'Se guardó exitosamente',
                    })
                    console.log('Respuesta de la API:', resp)
                },
                error: (err) => {
                    console.error('Error al insertar cursos:', err)
                },
            })
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
