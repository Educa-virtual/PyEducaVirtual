import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    standalone: true,
    selector: 'app-estadistica',
    templateUrl: './estadistica.component.html',
    styleUrls: ['./estadistica.component.scss'],
    imports: [CommonModule, FormsModule, PrimengModule],
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
    merito = [
        { label: 'General', value: 1 },
        { label: '5 Primeros Puestos', value: 2 },
        { label: 'Decimo Superior', value: 3 },
        { label: 'Quinto Superior', value: 4 },
    ]

    constructor(private ConstantesService: ConstantesService) {
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
            console.error(
                'Debe seleccionar Año Escolar, Grado y Orden de Mérito'
            )
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
                sede: this.Isede,
                yearid: this.selectYear,
                gradoid: this.selectedGrado,
                meritoid: this.selectedMerito.value,
            },
        }

        this.getInformation(params, 'guardarRecord')
    }
    descargarPdf(url: string): void {
        if (url) {
            window.open(url, '_blank') // Abre el PDF en una nueva pestaña
        } else {
            console.warn('No se encontró la URL del PDF.')
        }
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
        const { accion, item } = event

        switch (accion) {
            case 'guardarRecord':
                // this.respuestaRecord = item;
                // console.log(item)
                // Llamar a obtenerReportes() después de guardar el registro
                // this.obtenerReportes();
                this.obtenerReportes()
                break
            case 'obtenerReportes':
                if (item && Array.isArray(item)) {
                    this.identidad = item.map((reporte: any) => ({
                        merito: reporte.cTipoOrdenMerito,
                        grado: reporte.cGrado,
                        fecha: reporte.dtReporteCreacion,
                        url: reporte.cUrlGenerado,
                    }))
                } else {
                    console.warn('No se encontraron reportes.')
                    this.identidad = []
                }
                break
        }
    }
    obtenerReportes() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'obtener-reportes',
            data: {
                codModular: this.codModular,
            },
        }
        this.getInformation(params, 'obtenerReportes')
    }
}
