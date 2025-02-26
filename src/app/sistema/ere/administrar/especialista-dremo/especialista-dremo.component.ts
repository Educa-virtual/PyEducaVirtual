import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ApiEspecialistasService } from '../../services/api-especialistas.service'
import { forkJoin } from 'rxjs'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-especialista-dremo',
    standalone: true,
    templateUrl: './especialista-dremo.component.html',
    styleUrl: './especialista-dremo.component.scss',
    imports: [PrimengModule, ContainerPageComponent],
})
export class EspecialistaDremoComponent implements OnInit {
    private _ApiEspecialistasService = inject(ApiEspecialistasService)
    private _MessageService = inject(MessageService)

    objectKeys = Object.keys

    titulo: string = 'Asignación de áreas a Especialistas DREMO'
    especialistas: any[] = []
    nivelPrimaria: any[] = []
    gradosPrimaria: any = []
    areasPrimaria: any = []
    nivelSecundaria: any[] = []
    gradosSecundaria: any = []
    areasSecundaria: any = []

    iDocenteId: string
    iAreasSinAsignar: number = 0
    iAreasConAsignar: number = 0

    ngOnInit() {
        this.obtenerEspecialistasDremo()
        this.obtenerCursosxNivel()
    }

    obtenerEspecialistasDremo() {
        this._ApiEspecialistasService.obtenerEspecialistasDremo().subscribe({
            next: (respuesta) => {
                this.especialistas = respuesta
            },
            error: (error) => {
                console.error('Error obteniendo datos', error)
            },
        })
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

    obteneriCursosNivelGradIdxiDocenteId() {
        if (!this.iDocenteId) {
            return
        }
        this._ApiEspecialistasService
            .obtenerAreasPorEspecialista(this.iDocenteId)
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

    insertarCursos(curso) {
        const data = {
            iCursosNivelGradId: curso.iCursosNivelGradId,
        }
        this._ApiEspecialistasService
            .asignarAreaEspecialista(this.iDocenteId, data)
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
    eliminarCursos(curso) {
        const data = {
            iCursosNivelGradId: curso.iCursosNivelGradId,
        }
        this._ApiEspecialistasService
            .eliminarAreaEspecialista(this.iDocenteId, data)
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

    mostrarMensaje(severity, title, detail) {
        this._MessageService.add({
            severity: severity,
            summary: title,
            detail: detail,
        })
    }
}
