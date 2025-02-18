import { Component, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { FormsModule } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { FormatoService } from '@/app/servicios/formato.service'
@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [PrimengModule, CommonModule, FormsModule],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.scss',
    providers: [MessageService],
})
export class ReporteComponent {
    private GeneralService = inject(GeneralService)
    datos = []
    persona: boolean = false //  muestra la tabla de la identidad del estudiante
    historico: boolean = false //  muestra la tabla del historico del estudiante
    documento: string = ''
    identidad: any // datos del alumno
    historial: any[]
    columna = [] // almacena los años y grados de los estudiantes por busqueda por estudiante
    fila: any = [] // almacena el area curricular y sus notas las notas de los estudiantes por busqueda por estudiante
    final: any
    iiee: any
    curricular: any
    grados: any[]
    years: any[]
    selectYear: any[]
    selectGrado: any[]
    areasColumnas: string[]
    estudianteFilas: string[]
    academicoGrado: string[]
    notas: string[]
    areas: any[] = []
    secciones: any[] = []
    showGrados: boolean = false
    ListGarados: string

    constructor(
        private messageService: MessageService,
        private ConstantesService: ConstantesService,
        private formatoService: FormatoService
    ) {
        this.iiee = this.ConstantesService.iIieeId
        this.grados = JSON.parse(this.ConstantesService.grados)
        this.years = this.ConstantesService.years
    }

    limpiar() {
        this.documento = ''
        this.persona = false
        this.historico = false
    }
    buscarGrado() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'obtener_academico_grado',
            data: {
                iGrado: this.selectGrado,
                iYear: this.selectYear,
                iIieeId: this.iiee,
            },
        }
        this.getInformation(params, 'obtenerAcademicoGrado')
    }
    // Genera la tabla de grados
    generarListaGrados() {
        if (this.notas) {
            this.showGrados = true
            const indexGrado = this.grados.findIndex(
                (item) => item.iGradoId == this.selectGrado
            )
            this.ListGarados = `${this.grados[indexGrado]['cGradoNombre']} (${this.grados[indexGrado]['cGradoAbreviacion']})`

            this.notas.map((item) => {
                const verSeccion = this.secciones.find(
                    (sec) => sec['seccion'] == item['cSeccionNombre']
                )
                if (!verSeccion) {
                    this.secciones.push({ seccion: item['cSeccionNombre'] })
                }
            })
        } else {
            console.log(
                this.formatoService.standardizeDateTime('2025-02-18 14:30')
            )
            //this.messageService.add({ severity: 'error', summary: 'Mensaje', detail: 'No existen datos' });
        }
    }
    buscarDocumento() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'obtener_datos',
            data: {
                cPersDocumento: this.documento,
                iIieeId: this.iiee,
            },
        }
        this.getInformation(params, 'obtenerHistorial')
    }
    mostrarReporte() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'reporte_academico',
            data: {
                cPersDocumento: this.documento,
                iIieeId: this.iiee,
            },
        }
        this.getReportePdf(params)
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
    getReportePdf(data: any) {
        this.GeneralService.generarPdf(data).subscribe({
            next: (response) => {
                const blob = new Blob([response], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'archivo.pdf'
                a.click()
                window.URL.revokeObjectURL(url)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
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
            case 'obtenerAcademicoGrado':
                this.academicoGrado = item
                this.notas = JSON.parse(this.academicoGrado[0]['notas'])
                this.generarListaGrados()
                break
        }
    }
}
