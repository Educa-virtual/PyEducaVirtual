import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { GeneralService } from '@/app/servicios/general.service'
// Importaciones de PrimeNG
import { ToolbarModule } from 'primeng/toolbar'
import { FieldsetModule } from 'primeng/fieldset'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { ConstantesService } from '@/app/servicios/constantes.service'
@Component({
    standalone: true,
    selector: 'app-estadistica',
    templateUrl: './estadistica.component.html',
    styleUrls: ['./estadistica.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        FieldsetModule,
        DropdownModule,
        TableModule,
        ButtonModule,
    ],
})
export class EstadisticaComponent implements OnInit {
    private GeneralService = inject(GeneralService)
    selectedYear: any
    selectedGrado: any
    selectedMerito: any
    identidad: any[] = []

    escolar: any[] = [] // Se llenará con los datos del backend
    datos = [] // Se llenará con los datos del backend
    grados = []
    codigo: any
    iiee: any
    merito = [
        { label: 'General', value: 1 },
        { label: '5 Primeros Puestos', value: 2 },
        { label: 'Decimo Superior', value: 3 },
        { label: 'Quinto Superior', value: 4 },
    ]

    constructor(
        private http: HttpClient,
        private ConstantesService: ConstantesService
    ) {
        this.codigo = this.ConstantesService.codModular
        this.iiee = this.ConstantesService.iIieeId
    }

    ngOnInit() {
        this.obtenerAniosYGrados()
    }

    obtenerAniosYGrados() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'academico',
            ruta: 'estadistica/grados-por-sede',
            data: {
                iIieeId: this.iiee,
            },
        }
        this.getInformation(params, 'obtenerGrado')
        // this.http
        //     .get<any>('http://localhost:8000/api/estadistica/anios-academicos')
        //     .subscribe(
        //         (response) => {
        //             this.escolar = response.anios.map((anio: any) => ({
        //                 label: anio.iYearId,
        //                 value: anio.iYAcadId,
        //             }))
        //         },
        //         (error) => {
        //             console.error('Error al obtener los datos:', error)
        //         }
        //     )
        // // Obtener grados filtrados por sede
        // this.http
        //     .get<any>(
        //         `http://localhost:8000/api/estadistica/grados-por-sede/${this.iiee}`
        //     )
        //     .subscribe(
        //         (response) => {
        //             this.grado = response.grados.map((grado: any) => ({
        //                 label: grado.cGradoNombre,
        //                 value: grado.iGradoId,
        //             }))
        //         },
        //         (error) => console.error('Error al obtener grados:', error)
        //     )
    }
    buscar() {
        // Reiniciar los datos antes de agregar nuevos para evitar duplicados
        this.identidad = []

        // Simulación de datos con estructura correcta
        this.identidad.push({
            merito: this.selectedMerito
                ? this.selectedMerito.label
                : 'No especificado',
            grado: this.selectedGrado
                ? this.selectedGrado.label
                : 'No especificado',
            fecha: new Date().toLocaleDateString(),
            valor: 'pi pi-refresh', // Estado del reporte
            generado: 'pi pi-check-circle', // Estado generado
        })
    }

    generar() {
        if (!this.selectedYear || !this.selectedGrado || !this.selectedMerito) {
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
        this.http
            .post<any>(
                'http://localhost:8000/api/estadistica/generar-reporte',
                parametros
            )
            .subscribe(
                (response) => {
                    console.log('Reporte generado:', response.reporte)
                    alert('Reporte generado con éxito.')
                },
                (error) => {
                    console.error('Error al generar el reporte:', error)
                    alert('Hubo un error al generar el reporte.')
                }
            )
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
                this.grados = item
                console.log(this.grados)
                break
        }
    }
}
