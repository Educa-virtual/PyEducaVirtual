import { Component, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { GeneralService } from '@/app/servicios/general.service'
import { FormsModule } from '@angular/forms'
@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [PrimengModule, CommonModule, FormsModule],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.scss',
})
export class ReporteComponent {
    private GeneralService = inject(GeneralService)
    datos = []
    persona: boolean = false //  muestra la tabla de la identidad del estudiante
    historico: boolean = false //  muestra la tabla del historico del estudiante
    documento: string = ''
    identidad: any // datos del alumno
    historial: any[]
    columna = []
    fila: any = []
    final: any
    limpiar() {
        this.documento = ''
        this.persona = false
        this.historico = false
    }
    buscarDocumento() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'reporte_academico',
            data: {
                cPersDocumento: this.documento,
            },
        }
        this.getInformation(params, 'obtenerHistorial')
    }
    mostrarHistorial() {
        this.historial = JSON.parse(this.datos[0]['historial'])
        this.historial.forEach((item) => {
            const area = this.fila.find(
                (box) => box.cCursoNombre === item.cCursoNombre
            )
            if (!area) {
                this.fila.push({
                    cCursoNombre: item.cCursoNombre,
                    nota: [{ promedio: item.nDetMatrPromedio }],
                })
            } else {
                const nuevo = this.fila.find(
                    (box) => box.cCursoNombre === item.cCursoNombre
                )
                nuevo.nota.push({ promedio: item.nDetMatrPromedio })
            }
            const encabezado = this.columna.find(
                (box) => box.cGradoAbreviacion === item.cGradoAbreviacion
            )
            if (!encabezado) {
                this.columna.push({
                    cGradoAbreviacion: item.cGradoAbreviacion,
                    cYAcadNombre: item.cYAcadNombre,
                })
            }
        })

        this.final = [
            { promedio: '#' },
            { promedio: 'Resultados' },
            { promedio: '-' },
            { promedio: '-' },
            { promedio: '-' },
            { promedio: '-' },
            { promedio: '-' },
        ]

        this.columna.sort((a, b) => {
            return a.cYAcadNombre - b.cYAcadNombre
        })
        this.fila.sort((a, b) => {
            return a.cCursoNombre.localeCompare(b.cCursoNombre)
        })
        this.fila.forEach((box) => {
            box.nota.sort((a, b) => {
                return a.year - b.year
            })
        })

        this.historico = true
    }
    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
        })
    }

    accionBtnItem(event): void {
        const { accion } = event
        const { item } = event

        switch (accion) {
            case 'obtenerHistorial':
                this.datos = item
                if (this.datos) {
                    this.identidad = [
                        {
                            nombre: this.datos[0]['cEstNombres'],
                            paterno: this.datos[0]['cEstPaterno'],
                            materno: this.datos[0]['cEstMaterno'],
                        },
                    ]
                    this.persona = true
                }
                break
        }
    }
}
