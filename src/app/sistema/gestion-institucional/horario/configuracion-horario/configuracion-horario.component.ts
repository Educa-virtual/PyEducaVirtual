import { Component, inject, OnInit } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { PrimengModule } from '@/app/primeng.module'

import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ConfHorariosComponent } from '@/app/shared/horario/conf-horario.component'
import { ApiService } from '@/app/servicios/api.service'
import { ToolbarPrimengComponent } from '../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
interface Curso {
    iCursoId: number
    cCursoNombre: string
    cDocente: string
    horasDisponibles: number
    horasAsignadas: number
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

    cursos: Curso[] = [
        {
            iCursoId: 1,
            cCursoNombre: 'Matemáticas',
            cDocente: 'Dr. García',
            horasDisponibles: 6,
            horasAsignadas: 1,
        },
        {
            iCursoId: 2,
            cCursoNombre: 'Física',
            cDocente: 'Dra. Rodríguez',
            horasDisponibles: 4,
            horasAsignadas: 2,
        },
        {
            iCursoId: 3,
            cCursoNombre: 'Química',
            cDocente: 'Lic. Pérez',
            horasDisponibles: 3,
            horasAsignadas: 0,
        },
        {
            iCursoId: 4,
            cCursoNombre: 'Historia',
            cDocente: 'Mg. Ramírez',
            horasDisponibles: 5,
            horasAsignadas: 0,
        },
        {
            iCursoId: 5,
            cCursoNombre: 'Lenguaje',
            cDocente: 'Lic. Torres',
            horasDisponibles: 4,
            horasAsignadas: 0,
        },
    ]
    dias: any = []
    configHoras: any = [
        {
            iHorarioIeId: '19',
            inicio: '07:00:00',
            fin: '07:45:00',
            iBloqueHorarioId: 1,
            bloque: 'Bloque 01',
            iTipoBloqueId: null,
            iHorarioIeDetId: 124,
        },
        {
            iHorarioIeId: '19',
            inicio: '07:45:00',
            fin: '08:30:00',
            iBloqueHorarioId: 2,
            bloque: 'Bloque 02',
            iTipoBloqueId: null,
            iHorarioIeDetId: 125,
        },
        {
            iHorarioIeId: '19',
            inicio: '08:30:00',
            fin: '09:15:00',
            iBloqueHorarioId: 3,
            bloque: 'Bloque 03',
            iTipoBloqueId: null,
            iHorarioIeDetId: 126,
        },
        {
            iHorarioIeId: '19',
            inicio: '09:15:00',
            fin: '10:00:00',
            iBloqueHorarioId: 4,
            bloque: 'Bloque 04',
            iTipoBloqueId: null,
            iHorarioIeDetId: 127,
        },
        {
            iHorarioIeId: '19',
            inicio: '10:00:00',
            fin: '10:15:00',
            iBloqueHorarioId: 9,
            bloque: 'Receso 01',
            iTipoBloqueId: null,
            iHorarioIeDetId: 128,
        },
        {
            iHorarioIeId: '19',
            inicio: '10:15:00',
            fin: '11:00:00',
            iBloqueHorarioId: 5,
            bloque: 'Bloque 05',
            iTipoBloqueId: null,
            iHorarioIeDetId: 129,
        },
        {
            iHorarioIeId: '19',
            inicio: '11:00:00',
            fin: '11:45:00',
            iBloqueHorarioId: 6,
            bloque: 'Bloque 06',
            iTipoBloqueId: null,
            iHorarioIeDetId: 130,
        },
        {
            iHorarioIeId: '19',
            inicio: '11:45:00',
            fin: '12:30:00',
            iBloqueHorarioId: 7,
            bloque: 'Bloque 07',
            iTipoBloqueId: null,
            iHorarioIeDetId: 131,
        },
        {
            iHorarioIeId: '19',
            inicio: '12:30:00',
            fin: '13:15:00',
            iBloqueHorarioId: 8,
            bloque: 'Bloque 08',
            iTipoBloqueId: null,
            iHorarioIeDetId: 132,
        },
        {
            iHorarioIeId: '19',
            inicio: '13:15:00',
            fin: '14:00:00',
            iBloqueHorarioId: 10,
            bloque: 'Receso 02',
            iTipoBloqueId: null,
            iHorarioIeDetId: 133,
        },
    ]

    horario = [
        {
            iCursoId: 1,
            cCursoNombre: 'Matemáticas',
            iDiaId: '1',
            cDiaNombre: 'Lunes',
            iHorarioIeId: '19',
            inicio: '07:00:00',
            fin: '07:45:00',
            cDocente: 'Dr. García',
            iHorarioIeDetId: 124,
        },
        {
            iCursoId: 2,
            cCursoNombre: 'Física',
            iDiaId: '2',
            cDiaNombre: 'Martesf',
            iHorarioIeId: '19',
            inicio: '07:45:00',
            fin: '08:30:00',
            cDocente: 'Dra. Rodríguez',
            iHorarioIeDetId: 125,
        },
        {
            iCursoId: 2,
            cCursoNombre: 'Física',
            iDiaId: '1',
            cDiaNombre: 'Lunes',
            iHorarioIeId: '19',
            inicio: '07:45:00',
            fin: '08:30:00',
            cDocente: 'Dra. Rodríguez',
            iHorarioIeDetId: 125,
        },
    ]

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'agregar-horario':
                this.horario.push(item)
                for (const key in this.cursos) {
                    this.cursos[key].horasAsignadas = this.horario.filter(
                        (hour) => hour.iCursoId === this.cursos[key].iCursoId
                    ).length
                }
                break
            case 'remover-horario':
                const index = this.horario.findIndex(
                    (h) =>
                        h.iCursoId === item.iCursoId &&
                        h.iDiaId === item.iDiaId &&
                        h.iHorarioIeDetId === item.iHorarioIeDetId
                )
                if (index !== -1) {
                    this.horario.splice(index, 1)
                }
                for (const key in this.cursos) {
                    this.cursos[key].horasAsignadas = this.horario.filter(
                        (hour) => hour.iCursoId === this.cursos[key].iCursoId
                    ).length
                }
                break
            default:
                break
        }
    }

    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _GeneralService = inject(GeneralService)
    private _ConstantesService = inject(ConstantesService)
    private _MessageService = inject(MessageService)
    private _ApiService = inject(ApiService)

    async ngOnInit() {
        this.dias = await this._ApiService.getData({
            esquema: 'grl',
            tabla: 'dias',
            campos: '*',
            where: '1=1',
        })

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
        console.log(this.iGradoId)
        console.log(
            this.gradosSecciones.filter(
                (item) => item.iGradoId === this.iGradoId
            )
        )
        this.secciones = this.gradosSecciones.filter(
            (item) => item.iGradoId === this.iGradoId
        )
    }

    obtenerCursosxiGradoIdxiSeccionId() {
        this._GeneralService
            .searchCalendario({
                json: JSON.stringify({
                    iSedeId: this._ConstantesService.iSedeId,
                    iYAcadId: this._ConstantesService.iYAcadId,
                    iGradoId: this.iGradoId,
                    iSeccionId: this.iSeccionId,
                }),
                _opcion: 'getAreasXiSeccionIdXiGradoId',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(
                        this.gradosSecciones.filter(
                            (item) => item.iGradoId === this.iGradoId
                        )
                    )
                    console.log(data)
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

    // confirm() {
    //     this._ConfirmationModalService.openConfiSave({
    //         message: '¿Estás seguro de que deseas guardar y continuar?',
    //         header: 'Advertencia de autoguardado',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             // Acción para eliminar el registro
    //             this.router.navigate(['/gestion-institucional/resumen'])
    //         },
    //         reject: () => {
    //             // Mensaje de cancelación (opcional)
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Cancelado',
    //                 detail: 'Acción cancelada',
    //             })
    //         },
    //     })
    // }
}
