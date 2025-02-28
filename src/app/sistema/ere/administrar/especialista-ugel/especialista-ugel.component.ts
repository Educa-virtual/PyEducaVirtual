import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { forkJoin } from 'rxjs'
import { MessageService } from 'primeng/api'
import { ApiEspecialistasUgelService } from '../../services/api.especialistas-ugel.services'

@Component({
    selector: 'app-especialista-ugel',
    standalone: true,
    templateUrl: './especialista-ugel.component.html',
    styleUrl: './especialista-ugel.component.scss',
    imports: [PrimengModule, ContainerPageComponent],
})
export class EspecialistaUgelComponent implements OnInit {
    private _ApiEspecialistasService = inject(ApiEspecialistasUgelService)
    private _MessageService = inject(MessageService)

    objectKeys = Object.keys

    titulo: string = 'Asignación de áreas a Especialistas UGEL'
    especialistas: any[] = []
    ugeles: any[] = []
    nivelPrimaria: any[] = []
    gradosPrimaria: any = []
    areasPrimaria: any = []
    nivelSecundaria: any[] = []
    gradosSecundaria: any = []
    areasSecundaria: any = []

    iDocenteId: string
    iAreasSinAsignar: number = 0
    iAreasConAsignar: number = 0
    iUgelId: string

    ngOnInit() {
        this.obtenerEspecialistasUgel()
        this.obtenerCursosxNivel()
        this.obtenerUgeles()
    }

    obtenerCursosxNivel() {
        forkJoin({
            primaria: this._ApiEspecialistasService.obtenerCursosxNivel(3),
            secundaria: this._ApiEspecialistasService.obtenerCursosxNivel(4),
        }).subscribe({
            next: (respuesta) => {
                this.nivelPrimaria = respuesta.primaria
                this.gradosPrimaria = this.agruparPorGrado(this.nivelPrimaria)
                this.areasPrimaria = this.agruparPorArea(this.nivelPrimaria)

                this.nivelSecundaria = respuesta.secundaria
                this.gradosSecundaria = this.agruparPorGrado(
                    this.nivelSecundaria
                )
                this.areasSecundaria = this.agruparPorArea(this.nivelSecundaria)
            },
            error: (error) => {
                console.error('Error obteniendo datos', error)
            },
        })
    }

    agruparPorGrado = (nivel: any[]) => {
        if (!nivel.length) {
            return
        }
        return nivel.reduce((resultado, index) => {
            // Si el grado no existe en el resultado, la creamos
            if (!resultado[index.cGradoAbreviacion]) {
                resultado[index.cGradoAbreviacion] = []
            }
            // Añadimos el index a su grado correspondiente
            resultado[index.cGradoAbreviacion].push(index)
            return resultado
        }, {}) // El objeto vacío es el valor inicial
    }

    agruparPorArea = (nivel: any[]) => {
        if (!nivel.length) {
            return
        }
        return nivel.reduce((resultado, index) => {
            // Si el grado no existe en el resultado, la creamos
            if (!resultado[index.cCursoNombre]) {
                resultado[index.cCursoNombre] = []
            }
            // Añadimos el index a su grado correspondiente
            resultado[index.cCursoNombre].push(index)
            return resultado
        }, {}) // El objeto vacío es el valor inicial
    }

    // Ugel

    obtenerEspecialistasUgel() {
        //listo
        this._ApiEspecialistasService.obtenerEspecialistasUgel().subscribe({
            next: (respuesta) => {
                this.especialistas = respuesta
            },
            error: (error) => {
                console.error('Error obteniendo datos', error)
            },
        })
    }

    obtenerUgeles() {
        //listo
        console.log('llamada a funcion')
        this._ApiEspecialistasService.obtenerUgeles().subscribe({
            next: (respuesta) => {
                this.ugeles = respuesta
                console.log(this.ugeles)
            },
            error: (error) => {
                console.error('Error obtenido'), error
            },
        })
    }

    // Obtener Curso Niveles Grados 9:40 AM
    obteneriCursosNivelGradIdxiDocenteId() {
        if (!this.iDocenteId) {
            return
        }
        this._ApiEspecialistasService
            .obtenerAreasPorEspecialistaUgel(this.iUgelId, this.iDocenteId)
            .subscribe({
                next: (respuesta) => {
                    this.iAreasConAsignar = respuesta.length
                    this.iAreasSinAsignar =
                        this.nivelPrimaria.length +
                        this.nivelSecundaria.length -
                        this.iAreasConAsignar

                    this.nivelPrimaria.forEach((nivelSinAsignar) => {
                        nivelSinAsignar.isSelected = false
                        respuesta.forEach((nivelConAsignar) => {
                            if (
                                nivelSinAsignar.iCursosNivelGradId ===
                                nivelConAsignar.iCursosNivelGradId
                            ) {
                                nivelSinAsignar.isSelected = true
                            }
                        })
                    })

                    this.nivelSecundaria.forEach((nivelSinAsignar) => {
                        nivelSinAsignar.isSelected = false
                        respuesta.forEach((nivelConAsignar) => {
                            if (
                                nivelSinAsignar.iCursosNivelGradId ===
                                nivelConAsignar.iCursosNivelGradId
                            ) {
                                nivelSinAsignar.isSelected = true
                            }
                        })
                    })
                },
                error: (error) => {
                    console.error('Error obteniendo datos', error)
                },
            })
    }

    obtenerAreasPorEspecialistaUgel() {
        if (!this.iDocenteId || !this.ugeles) {
            // Si no hay docente o UGEL, no hacemos nada o mostramos error
            return
        }

        this._ApiEspecialistasService
            .obtenerAreasPorEspecialistaUgel(this.iUgelId, this.iDocenteId)
            .subscribe({
                next: (respuesta) => {
                    // respuesta son las áreas asignadas al especialista en esa UGEL
                    this.iAreasConAsignar = respuesta.length
                    this.iAreasSinAsignar =
                        this.nivelPrimaria.length +
                        this.nivelSecundaria.length -
                        this.iAreasConAsignar

                    // Recorre Primaria y marca checks
                    this.nivelPrimaria.forEach((nivel) => {
                        nivel.isSelected = false
                        respuesta.forEach((asignado) => {
                            if (
                                nivel.iCursosNivelGradId ===
                                asignado.iCursosNivelGradId
                            ) {
                                nivel.isSelected = true
                            }
                        })
                    })

                    // Recorre Secundaria y marca checks
                    this.nivelSecundaria.forEach((nivel) => {
                        nivel.isSelected = false
                        respuesta.forEach((asignado) => {
                            if (
                                nivel.iCursosNivelGradId ===
                                asignado.iCursosNivelGradId
                            ) {
                                nivel.isSelected = true
                            }
                        })
                    })
                },
                error: (error) => {
                    console.error('Error obteniendo áreas UGEL', error)
                },
            })
    }

    eliminarCursos(curso) {
        const data = {
            iCursosNivelGradId: curso.iCursosNivelGradId,
        }
        this._ApiEspecialistasService
            .eliminarAreaEspecialistaUgel(this.iUgelId, this.iDocenteId, data)
            .subscribe({
                next: (respuesta) => {
                    this.mostrarMensaje(
                        'success',
                        'Eliminado!',
                        respuesta.message
                    )
                    this.iAreasConAsignar--
                    this.iAreasSinAsignar++
                },
                error: (err) => {
                    console.error('Error al eliminar el área', err)
                },
            })
    }

    insertarCursos(curso) {
        const data = {
            iCursosNivelGradId: curso.iCursosNivelGradId,
        }
        this._ApiEspecialistasService
            .asignarAreaEspecialistaUgel(this.iUgelId, this.iDocenteId, data)
            .subscribe({
                next: (respuesta) => {
                    this.mostrarMensaje(
                        'success',
                        'Guardado!',
                        respuesta.message
                    )
                    this.iAreasConAsignar++
                    this.iAreasSinAsignar--
                },
                error: (error) => {
                    console.error('Error obteniendo datos', error)
                },
            })
    }

    checkedCurso(item) {
        if (!this.iDocenteId) {
            this.mostrarMensaje(
                'error',
                'Error',
                'No ha seleccionado un docente'
            )
            return
        }
        if (item.isSelected) {
            this.insertarCursos(item)
        } else {
            this.eliminarCursos(item)
        }
    }

    mostrarMensaje(severity, title, detail) {
        this._MessageService.add({
            severity: severity,
            summary: title,
            detail: detail,
        })
    }

    formatearData() {
        this.nivelPrimaria.forEach((nivelSinAsignar) => {
            nivelSinAsignar.isSelected = false
        })

        this.nivelSecundaria.forEach((nivelSinAsignar) => {
            nivelSinAsignar.isSelected = false
        })

        this.iAreasConAsignar = 0
        this.iAreasSinAsignar = 0
    }
}
