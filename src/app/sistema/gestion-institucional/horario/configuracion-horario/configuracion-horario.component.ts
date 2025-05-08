import { Component, inject, OnInit } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { PrimengModule } from '@/app/primeng.module'

import { ConfHorariosComponent } from '@/app/shared/horario/conf-horario.component'
import { ToolbarPrimengComponent } from '../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MessageService } from 'primeng/api'
interface Curso {
    iCursoId: number
    cCursoNombre: string
    nombre_completo: string
    nombre_corto: string
    nCursoTotalHoras: number
    iDocHoraAsignada: number
    horarios: any[]
}
@Component({
    selector: 'app-configuracion-horario',
    standalone: true,
    templateUrl: './configuracion-horario.component.html',
    styleUrls: ['./configuracion-horario.component.scss'],
    imports: [PrimengModule, ConfHorariosComponent, ToolbarPrimengComponent],
})
export class ConfiguracionHorarioComponent implements OnInit {
    gradosSecciones: any[] = []
    grados: any[] = []
    secciones: any[] = []
    iGradoId: string = ''
    iSeccionId: string = ''

    cursos: Curso[] = []
    dias: any = []
    bloques: number = 0
    horario = []

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'agregar-horario':
            case 'remover-horario':
                this.guardarRemoverCursosDiasHorarios(item)
                break
            default:
                break
        }
    }

    private _GeneralService = inject(GeneralService)
    private _ConstantesService = inject(ConstantesService)
    private _MessageService = inject(MessageService)

    async ngOnInit() {
        this.obtenerGradoSeccion()
    }

    obtenerGradoSeccion() {
        this._GeneralService
            .searchCalendario({
                json: JSON.stringify({
                    iSedeId: this._ConstantesService.iSedeId,
                    iYAcadId: this._ConstantesService.iYAcadId,
                }),
                _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
            })
            .subscribe({
                next: (data: any) => {
                    this.gradosSecciones = data.data
                    this.grados = this.removeDuplicatesByiGradoId(
                        this.gradosSecciones
                    )
                },
                error: (error) => {
                    console.error(
                        'Error fetching Servicios de Atención:',
                        error
                    )
                },
                complete: () => {
                    //   console.log('Request completed')
                },
            })
    }

    obtenerSecciones() {
        this.secciones = this.gradosSecciones.filter(
            (item) => item.iGradoId === this.iGradoId
        )
    }

    obtenerCursosxiGradoIdxiSeccionId() {
        const data = {
            iSedeId: this._ConstantesService.iSedeId,
            iYAcadId: this._ConstantesService.iYAcadId,
            iGradoId: this.iGradoId,
            iSeccionId: this.iSeccionId,
        }
        this._GeneralService.obtenerCursosDiasHorarios(data).subscribe({
            next: (data: any) => {
                const horarioIe = data.data
                if (horarioIe.length > 0) {
                    this.cursos = horarioIe[0]['cursos']
                        ? JSON.parse(horarioIe[0]['cursos'])
                        : []
                    this.dias = horarioIe[0]['dias']
                        ? JSON.parse(horarioIe[0]['dias'])
                        : []
                    this.horario = horarioIe[0]['horarios']
                        ? JSON.parse(horarioIe[0]['horarios'])
                        : []
                    this.bloques = horarioIe[0]['iTotalBloques']
                }
            },
            error: (error) => {
                console.error('Error fetching Servicios de Atención:', error)
            },
            complete: () => {
                //   console.log('Request completed')
            },
        })
    }

    removeDuplicatesByiGradoId(array: any[]): any[] {
        const seen = new Set<number>()
        return array.filter((item) => {
            if (seen.has(item.iGradoId)) {
                return false
            }
            seen.add(item.iGradoId)
            return true
        })
    }

    guardarRemoverCursosDiasHorarios(item) {
        this._GeneralService.guardarRemoverCursosDiasHorarios(item).subscribe({
            next: (data: any) => {
                if (data.validated) {
                    this.obtenerCursosxiGradoIdxiSeccionId()
                }
                // console.log(data)
            },
            error: (error) => {
                // console.error(
                //     'Error fetching Servicios de Atención:',
                //     error
                // )
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
            complete: () => {
                //   console.log('Request completed')
            },
        })
    }
}
