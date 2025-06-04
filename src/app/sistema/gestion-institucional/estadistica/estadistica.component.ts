import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { PrimengModule } from '@/app/primeng.module'
import { environment } from '@/environments/environment'
import { MessageService, ConfirmationService } from 'primeng/api'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Component({
    standalone: true,
    selector: 'app-estadistica',
    templateUrl: './estadistica.component.html',
    styleUrls: ['./estadistica.component.scss'],
    imports: [CommonModule, FormsModule, PrimengModule],
    providers: [MessageService, ConfirmationService],
})
export class EstadisticaComponent implements OnInit {
    private GeneralService = inject(GeneralService)
    selectedYear: any
    selectedGrado: any
    selectedMerito: any
    identidad: any[] = []
    selectYear: any
    escolar: any[] = [] // Se llenará con los datos del backend
    datos = [] // Se llenará con los datos del backend
    grado: any[]
    codigo: any
    years: any
    yearid: any
    yearValue: any
    gradoValue: any
    gradoid: any
    meritoid: any
    iiee: any
    Isede: any
    cIieeNombre: any
    codModular: any
    reporteParams: any
    respuestaRecord: any
    respuestatabla: any
    pdfBaseUrl: any
    merito = [
        { label: 'General', value: 1 },
        { label: '5 Primeros Puestos', value: 2 },
        { label: 'Decimo Superior', value: 3 },
        { label: 'Quinto Superior', value: 4 },
    ]

    constructor(
        private ConstantesService: ConstantesService,
        private messageService: MessageService,
        private sanitizer: DomSanitizer,
        private confirmationService: ConfirmationService
    ) {
        this.grado = JSON.parse(this.ConstantesService.grados)
        this.years = this.ConstantesService.years
        this.iiee = this.ConstantesService.iIieeId
        this.Isede = this.ConstantesService.iSedeId
        this.cIieeNombre = this.ConstantesService.cIieeNombre
        this.codModular = this.ConstantesService.codModular
    }

    ngOnInit() {
        return
    }

    buscar() {
        // Reiniciar los datos antes de agregar nuevos para evitar duplicados
        // this.identidad = []
    }

    generarReporte() {
        if (!this.selectYear || !this.selectedGrado || !this.selectedMerito) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Error de Datos',
                detail: 'Debe seleccionar Año Escolar, Grado y Orden de Mérito para Generar un reporte',
            })
            return
        }

        this.years.map((item) => {
            if (item['iYAcadId'] == this.selectYear) {
                this.yearValue = item['cYearNombre']
            }
        })
        this.grado.map((item) => {
            if (item['iGradoId'] == this.selectedGrado) {
                this.gradoValue = item['cGradoNombre']
            }
        })

        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'guardar_record',
            data: {
                cIieeNombre: this.cIieeNombre,
                year: this.yearValue,
                grado: this.gradoValue,
                merito: this.selectedMerito.label,
                codModular: this.codModular,
                sede: this.iiee,
                yearid: this.selectYear,
                gradoid: this.selectedGrado,
                meritoid: this.selectedMerito.value,
                pdfBaseUrl: environment.backend,
            },
        }
        this.getInformation(params, 'guardarRecord')
    }
    descargarPdf(url: string): void {
        if (url) {
            // Abrir en una pestaña sin afectar la vista del usuario
            window.open(url, '_blank', 'noopener,noreferrer')
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo descargar el archivo',
            })
        }
    }
    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            error: (error) => {
                // capturamos el error desde el backend y mostramos al usuario
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
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
        const { accion, item } = event

        switch (accion) {
            case 'guardarRecord':
                // this.respuestaRecord = item;
                console.log(item)
                this.obtenerReportes()
                break
            case 'obtenerReportes':
                if (item && Array.isArray(item)) {
                    this.identidad = item.map((reporte: any) => ({
                        id: reporte.iReporteId,
                        merito: reporte.cTipoOrdenMerito,
                        grado: reporte.cGrado,
                        fecha: reporte.dtReporteCreacion,
                        url: reporte.cUrlGenerado,
                        expanded: false,
                    }))
                } else {
                    console.warn('No se encontraron reportes.')
                    this.identidad = []
                }
                break
        }
    }
    obtenerReportes() {
        if (!this.selectYear || !this.selectedGrado || !this.selectedMerito) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Error de Datos',
                detail: 'Debe seleccionar Año Escolar, Grado',
            })
            return
        }

        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'obtener-reportes',
            data: {
                year: this.selectYear,
                codModular: this.codModular,
                grado: this.selectedGrado,
                pdfBaseUrl: environment.backend,
                merito: this.selectedMerito.label,
            },
        }
        this.getInformation(params, 'obtenerReportes')
    }

    eliminarRegistro(registro: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const params = {
                    petition: 'post',
                    group: 'aula-virtual',
                    prefix: 'academico',
                    ruta: 'eliminar-record',
                    data: {
                        id: registro.id, // (iReporteId)
                    },
                }

                this.GeneralService.getGralPrefix(params).subscribe({
                    next: (response: any) => {
                        if (response.validated) {
                            this.identidad = this.identidad.filter(
                                (r) => r.id !== registro.id
                            )
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Eliminado',
                                detail: 'El registro se eliminó correctamente.',
                            })
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    response.message ||
                                    'No se pudo eliminar el registro.',
                            })
                        }
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Ocurrió un error en la solicitud de eliminación.',
                        })
                    },
                })
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'La eliminación ha sido cancelada.',
                })
            },
        })
    }

    togglePreview(row: any) {
        // sanitizamos la URL para usarla en un <iframe>
        if (!row.expanded) {
            row.safeUrl = this.getSafeUrl(row.url)
        }
        // Alternar el estado
        row.expanded = !row.expanded
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }

    imprimirIframe(iframeRef: HTMLIFrameElement) {
        if (iframeRef && iframeRef.contentWindow) {
            iframeRef.contentWindow.focus()
            iframeRef.contentWindow.print()
        }
    }
    compartirUrl(url: string): void {
        if (url) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: '¡Link copiado!',
                        detail: 'La URL del reporte se ha copiado al portapapeles.',
                    })
                })
                .catch(() => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo copiar la URL.',
                    })
                })
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'No hay URL para copiar.',
            })
        }
    }
}
