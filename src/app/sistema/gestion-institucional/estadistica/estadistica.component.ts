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
        this.identidad = []
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
            ruta: 'reporte_ranking',
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
        this.getReportePdf(params)

        // Fecha de hoy
        const today = new Date().toLocaleDateString() // Formato "dd/mm/yyyy" (puedes ajustarlo según tu necesidad)

        // Crear el objeto para la tabla con los datos
        const rowData = {
            merito: this.selectedMerito.label,
            grado: this.gradoValue,
            fecha: today, // Fecha actual
            valor: 'Sin Valor Oficial', // Puedes modificar este valor según tu lógica
            generado: 'Generado', // Puedes modificar este valor según tu lógica
        }

        // Asignar los datos a la variable 'identidad' para mostrar en la tabla
        this.identidad = [rowData]
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
