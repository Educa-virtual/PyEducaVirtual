import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    inject,
} from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { Subject } from 'rxjs'
import { ModalPrimengComponent } from '../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-reporte-asistencia',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './reporte-asistencia.component.html',
    styleUrl: './reporte-asistencia.component.scss',
})
export class ReporteAsistenciaComponent implements OnChanges {
    private GeneralService = inject(GeneralService)
    private unsubscribe$ = new Subject<boolean>()

    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() iCursoId: string
    @Input() iDocenteId: string
    @Input() iNivelGradoId: string
    @Input() iSeccionId: string
    @Input() iYAcadId: string
    @Input() iGradoId: string
    @Input() cCursoNombre: string = ''
    @Input() cGradoAbreviacion: string = ''
    @Input() cSeccion: string = ''
    @Input() cNivelTipoNombre: string = ''
    @Input() cNivelNombreCursos: string = ''
    @Input() nombrecompleto: string = ''
    @Input() cCicloRomanos: string = ''
    @Input() cSeccionNombre: string = ''
    @Input() cPersNombreLargo: string = ''
    @Input() iSedeId: string
    @Input() iIieeId: string
    @Input() cIieeNombre: string
    @Input() year: string
    @Input() idDocCursoId: string
    minimo: Date
    maximo: Date
    fechas: string
    ngOnChanges(changes) {
        this.minimo = new Date(this.year + '/01/01')
        this.maximo = new Date(this.year + '/12/31')

        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
        if (changes.cCursoNombre?.currentValue) {
            this.cCursoNombre = changes.cCursoNombre.currentValue
        }
        if (changes.cGradoAbreviacion?.currentValue) {
            this.cGradoAbreviacion = changes.cGradoAbreviacion.currentValue
        }
        if (changes.cSeccion?.currentValue) {
            this.cSeccion = changes.cSeccion.currentValue
        }
        if (changes.cNivelTipoNombre?.currentValue) {
            this.cNivelTipoNombre = changes.cNivelTipoNombre.currentValue
        }
        if (changes.cNivelNombreCursos?.currentValue) {
            this.cNivelNombreCursos = changes.cNivelNombreCursos.currentValue
        }
        if (changes.nombrecompleto?.currentValue) {
            this.nombrecompleto = changes.nombrecompleto.currentValue
        }
        if (changes.cCicloRomanos?.currentValue) {
            this.cCicloRomanos = changes.cCicloRomanos.currentValue
        }
        if (changes.iCursoId?.currentValue) {
            this.iCursoId = changes.iCursoId.currentValue
        }
        if (changes.iNivelGradoId?.currentValue) {
            this.iNivelGradoId = changes.iNivelGradoId.currentValue
        }
        if (changes.iYAcadId?.currentValue) {
            this.iYAcadId = changes.iYAcadId.currentValue
        }
        if (changes.iGradoId?.currentValue) {
            this.iGradoId = changes.iGradoId.currentValue
        }
        if (changes.iDocenteId?.currentValue) {
            this.iDocenteId = changes.iDocenteId.currentValue
        }
        if (changes.iSeccionId?.currentValue) {
            this.iSeccionId = changes.iSeccionId.currentValue
        }
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }

    verReporte() {
        let data
        switch (this.solicitarFecha) {
            case 1:
                data = {
                    id: this.inputDia,
                    opcion: 'reporte_personalizado',
                    cSeccionNombre: this.cSeccionNombre,
                    cGradoAbreviacion: this.cGradoAbreviacion,
                    cNivelTipoNombre: this.cNivelTipoNombre,
                    cNivelNombreCursos: this.cNivelNombreCursos,
                    iCursoId: this.iCursoId,
                    iDocenteId: this.iDocenteId,
                    iSeccionId: this.iSeccionId,
                    iGradoId: this.iGradoId,
                    iNivelGradoId: this.iNivelGradoId,
                    iYAcadId: this.iYAcadId,
                    iIieeId: this.iIieeId,
                    iSedeId: this.iSedeId,
                    idDocCursoId: this.idDocCursoId,
                }
                this.rutas = 'reporte_diario'
                break
            case 3:
                data = {
                    id: this.iMesId,
                    opcion: 'REPORTE_MENSUAL',
                    cSeccionNombre: this.cSeccionNombre,
                    cGradoAbreviacion: this.cGradoAbreviacion,
                    cNivelTipoNombre: this.cNivelTipoNombre,
                    cNivelNombreCursos: this.cNivelNombreCursos,
                    cCicloRomanos: this.cCicloRomanos,
                    iCursoId: this.iCursoId,
                    iDocenteId: this.iDocenteId,
                    iSeccionId: this.iSeccionId,
                    iGradoId: this.iGradoId,
                    iNivelGradoId: this.iNivelGradoId,
                    iYAcadId: this.iYAcadId,
                    iIieeId: this.iIieeId,
                    iSedeId: this.iSedeId,
                    idDocCursoId: this.idDocCursoId,
                }
                this.rutas = 'reporte_mensual'
                break
            case 4:
                data = {
                    id: this.iDateRango,
                    opcion: 'reporte_personalizado',
                    cSeccionNombre: this.cSeccionNombre,
                    cGradoAbreviacion: this.cGradoAbreviacion,
                    cNivelTipoNombre: this.cNivelTipoNombre,
                    cNivelNombreCursos: this.cNivelNombreCursos,
                    nombrecompleto: this.nombrecompleto,
                    cCicloRomanos: this.cCicloRomanos,
                    iCursoId: this.iCursoId,
                    iDocenteId: this.iDocenteId,
                    iSeccionId: this.iSeccionId,
                    iGradoId: this.iGradoId,
                    iNivelGradoId: this.iNivelGradoId,
                    iYAcadId: this.iYAcadId,
                    iIieeId: this.iIieeId,
                    iSedeId: this.iSedeId,
                    idDocCursoId: this.idDocCursoId,
                }
                this.rutas = 'reporte_personalizado'
                break
        }

        this.getReportePdf(data)
    }

    meses = [
        { nombre: 'Enero', iMesId: 1 },
        { nombre: 'Febrero', iMesId: 2 },
        { nombre: 'Marzo', iMesId: 3 },
        { nombre: 'Abril', iMesId: 4 },
        { nombre: 'Mayo', iMesId: 5 },
        { nombre: 'Junio', iMesId: 6 },
        { nombre: 'Julio', iMesId: 7 },
        { nombre: 'Agosto', iMesId: 8 },
        { nombre: 'Setiembre', iMesId: 9 },
        { nombre: 'Octubre', iMesId: 10 },
        { nombre: 'Noviembre', iMesId: 11 },
        { nombre: 'Diciembre', iMesId: 12 },
    ]

    inputDia: Date = new Date()
    value1: number = 1
    tipoReporte: number
    solicitarFecha: number
    iMesId: number
    iDateRango
    rutas = ''
    getReportePdf(data) {
        if (this.rutas == 'reporte_diario') {
            this.fechas =
                data['id'].getFullYear() +
                '-' +
                (data['id'].getMonth() + 1) +
                '-' +
                data['id'].getDate()
        }
        if (this.rutas == 'reporte_personalizado') {
            const inicio =
                data['id'][0].getFullYear() +
                '-' +
                (data['id'][0].getMonth() + 1) +
                '-' +
                data['id'][0].getDate()
            const fin =
                data['id'][1].getFullYear() +
                '-' +
                (data['id'][1].getMonth() + 1) +
                '-' +
                data['id'][1].getDate()
            this.fechas = inicio + '_' + fin
        }
        if (this.rutas == 'reporte_mensual') {
            this.fechas = data['id']
            const fecha = new Date(this.year + '-' + this.fechas) // Por ejemplo: 2025-04-11
            const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' })
            this.fechas = nombreMes
        }

        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'reporte_asistencia',
            ruta: this.rutas,
            data: data,
            params: { skipSuccessMessage: true },
        }
        this.GeneralService.generarPdf(params).subscribe({
            next: (response) => {
                const blob = new Blob([response], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download =
                    'asistencia_' +
                    this.cCursoNombre.toLocaleLowerCase() +
                    '_' +
                    this.cGradoAbreviacion.toLocaleLowerCase() +
                    this.cSeccionNombre.toLocaleLowerCase() +
                    '_' +
                    this.fechas +
                    '.pdf'
                a.click()
                window.URL.revokeObjectURL(url)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
}
