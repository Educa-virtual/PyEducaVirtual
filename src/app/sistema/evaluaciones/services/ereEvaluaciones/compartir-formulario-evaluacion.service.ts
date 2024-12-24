import { inject, Injectable } from '@angular/core'
import { ApiEvaluacionesRService } from '../api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { GeneralService } from '@/app/servicios/general.service'

//import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CompartirFormularioEvaluacionService {
    lista: any[] = []

    private cEvaluacionNombre: string | null = null // Nombre de la evaluacion
    private grado: string | null = null
    private nivel: string | null = null
    private seccion: string | null = null
    private areas: any[] = [] // Lista de áreas procesadas
    private areasIdNivelGradoString: string | null = null
    private _iEvaluacionId: number | null = null // ID de la evaluación
    private _apiEre = inject(ApiEvaluacionesRService)
    private unsubscribe$ = new Subject<boolean>()

    setcEvaluacionNombre(nombre: string) {
        this.cEvaluacionNombre = nombre
        // Guardar en el localStorage
        localStorage.setItem('cEvaluacionNombre', nombre)
    }

    getcEvaluacionNombre(): string | null {
        // Intentar recuperar del localStorage si está vacío
        if (!this.cEvaluacionNombre) {
            this.cEvaluacionNombre = localStorage.getItem('cEvaluacionNombre')
        }
        return this.cEvaluacionNombre
    }

    setGrado(grado: string) {
        this.grado = grado
        localStorage.setItem('grado', grado)
    }

    getGrado(): string | null {
        if (!this.grado) {
            this.grado = localStorage.getItem('grado')
        }
        return this.grado
    }

    setNivel(nivel: string) {
        this.nivel = nivel
        localStorage.setItem('nivel', nivel)
    }

    getNivel(): string | null {
        if (!this.nivel) {
            this.nivel = localStorage.getItem('nivel')
        }
        return this.nivel
    }
    setSeccion(seccion: string) {
        this.seccion = seccion
        localStorage.setItem('seccion', seccion)
    }

    getSeccion(): string | null {
        if (!this.seccion) {
            this.seccion = localStorage.getItem('seccion')
        }
        return this.seccion
    }

    // MÉTODO PARA GUARDAR ÁREAS
    setAreas(areas: any[]): void {
        this.areas = areas
        // Guardar en localStorage como string JSON
        localStorage.setItem('areas', JSON.stringify(areas))
    }

    // MÉTODO PARA OBTENER ÁREAS
    getAreas(): any[] {
        // Si las áreas no están en memoria, intentar recuperarlas del localStorage
        if (!this.areas || this.areas.length === 0) {
            const storedAreas = localStorage.getItem('areas')
            this.areas = storedAreas ? JSON.parse(storedAreas) : []
        }
        return this.areas
    }

    setAreasId(areasIdNivelGradoString: string) {
        this.areasIdNivelGradoString = areasIdNivelGradoString
        localStorage.setItem('areasIdNivelGradoString', areasIdNivelGradoString)
    }

    getAreasId(): string | null {
        if (!this.areasIdNivelGradoString) {
            this.areasIdNivelGradoString = localStorage.getItem(
                'areasIdNivelGradoString'
            )
        }
        return this.areasIdNivelGradoString
    }

    constructor(private query: GeneralService) {}

    setEvaluacionId(id: number): void {
        this._iEvaluacionId = id
    }
    obtenerCursosSeleccionados(): Promise<any[]> {
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
                        const cursosSeleccionados = resp.cursos
                            .map((curso: any) => ({
                                iCursoNivelGradId: curso.iCursoNivelGradId,
                                isSelected: curso.isSelected === '1', // Convertir a booleano
                            }))
                            .filter((curso: any) => curso.isSelected) // Filtrar los cursos seleccionados

                        // Estructuramos los cursos por nivel y grado
                        const listaAgrupada = this.extraerAsignatura(
                            resp.cursos
                        )

                        // Aplicar la selección a los cursos
                        listaAgrupada.forEach((nivel: any) => {
                            Object.keys(nivel.grados).forEach((grado) => {
                                nivel.grados[grado].forEach((curso: any) => {
                                    // Si el curso está en el arreglo de cursos seleccionados, actualizar su estado
                                    curso.isSelected = cursosSeleccionados.some(
                                        (selectedCurso: any) =>
                                            selectedCurso.iCursoNivelGradId ===
                                            curso.iCursoNivelGradId
                                    )
                                })
                            })
                        })

                        // Filtrar los cursos con isSelected = true
                        const cursosFiltrados = listaAgrupada
                            .map((nivel: any) => ({
                                ...nivel,
                                grados: Object.keys(nivel.grados).reduce(
                                    (acc: any, grado: string) => {
                                        acc[grado] = nivel.grados[grado].filter(
                                            (curso: any) => curso.isSelected
                                        )
                                        return acc
                                    },
                                    {}
                                ),
                            }))
                            .filter((nivel: any) =>
                                Object.keys(nivel.grados).some(
                                    (grado) => nivel.grados[grado].length > 0
                                )
                            ) // Solo incluir niveles con cursos seleccionados

                        resolve(cursosFiltrados)
                    },
                    error: (err) => {
                        console.error('Error al obtener cursos:', err)
                        reject(err)
                    },
                })
        })
    }

    // Función para estructurar los datos
    extraerAsignatura(data: any): any[] {
        console.log('Datos recibidos en extraerAsignatura:', data)

        if (!Array.isArray(data)) {
            console.error('Error: Los datos no son un arreglo')
            return []
        }

        // Estructuramos los datos por nivel y grado
        const groupedData = data.reduce((acc: any, item: any) => {
            console.log(acc)
            console.log(item)
            // item.isSelected = item.isSelected == 0 ? false : true
            // const nivel = item.cNivelTipoNombre ?? 'Sin Descripción'
            // const grado = item.cGradoAbreviacion ?? 'Sin Abreviación'

            // if (!acc[nivel]) {
            //     acc[nivel] = [] // Cada nivel contiene grados
            // }

            // if (!acc[nivel][grado]) {
            //     acc[nivel][grado] = [] // Cada grado contiene cursos
            // }

            // acc[nivel][grado].push({
            //     iCursoNivelGradId: item.iCursosNivelGradId, // Nuevo campo
            //     cCursoNombre: item.cCursoNombre ?? 'Sin Nombre',
            //     isSelected: false, // Propiedad para checkbox
            // })

            // return acc
        }, {})

        console.log('Datos agrupados:', groupedData)

        // Convertir el objeto agrupado en un arreglo
        return Object.keys(groupedData).map((nivel) => ({
            nivel,
            grados: groupedData[nivel],
        }))
    }
}
