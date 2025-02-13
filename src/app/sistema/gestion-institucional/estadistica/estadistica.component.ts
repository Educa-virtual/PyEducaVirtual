import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
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
    selectedYear: any
    selectedGrado: any
    selectedMerito: any
    identidad: any[] = []

    escolar: any[] = [] // Se llenará con los datos del backend
    grado: any[] = [] // Se llenará con los datos del backend
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
        this.http
            .get<any>('http://localhost:8000/api/estadistica/anios-academicos')
            .subscribe(
                (response) => {
                    this.escolar = response.anios.map((anio: any) => ({
                        label: anio.iYearId,
                        value: anio.iYAcadId,
                    }))
                },
                (error) => {
                    console.error('Error al obtener los datos:', error)
                }
            )
        // Obtener grados filtrados por sede
        this.http
            .get<any>(
                `http://localhost:8000/api/estadistica/grados-por-sede/${this.iiee}`
            )
            .subscribe(
                (response) => {
                    this.grado = response.grados.map((grado: any) => ({
                        label: grado.cGradoNombre,
                        value: grado.iNivelGradoId,
                    }))
                },
                (error) => console.error('Error al obtener grados:', error)
            )
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
            cmodular: this.codigo,
            SedeID: this.iiee,
        }

        console.log('Enviando datos para generación del reporte:', parametros)
    }
}
