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

    escolar: any[] = [] // Se llenará con los datos del backend
    datos = [] // Se llenará con los datos del backend
    grado: any[]
    codigo: any
    years: any
    iiee: any
    merito = [
        { label: 'General', value: 1 },
        { label: '5 Primeros Puestos', value: 2 },
        { label: 'Decimo Superior', value: 3 },
        { label: 'Quinto Superior', value: 4 },
    ]

    constructor(private ConstantesService: ConstantesService) {
        this.grado = JSON.parse(this.ConstantesService.grados)
        this.years = this.ConstantesService.years
        console.table(this.years)
        this.iiee = this.ConstantesService.iIieeId
    }

    ngOnInit() {
        return
    }

    buscar() {
        // Reiniciar los datos antes de agregar nuevos para evitar duplicados
        this.identidad = []
    }

    generar() {
        if (!this.years || !this.grado || !this.merito) {
            alert(
                'Por favor, seleccione Año Escolar, Grado y Tipo de Orden de Mérito.'
            )
            return
        }

        const parametros = {
            year: this.selectedYear.value,
            grado: this.selectedGrado.value,
            merito: this.selectedMerito.value,
            SedeID: this.iiee,
        }
        console.log('Parámetros enviados:', parametros)
    }
    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                console.log(response)
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
            case 'obtenerGrado':
                console.log(item)
                break
        }
    }
}
