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

    merito = [
        { label: 'Excelente', value: 'A' },
        { label: 'Bueno', value: 'B' },
        { label: 'Regular', value: 'C' },
    ]

    constructor(private http: HttpClient) {}

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

                    this.grado = response.grados.map((grado: any) => ({
                        label: grado.cGradoNombre,
                        value: grado.iGradoId,
                    }))
                },
                (error) => {
                    console.error('Error al obtener los datos:', error)
                }
            )
    }

    buscar() {
        console.log(
            'Buscando datos para:',
            this.selectedYear,
            this.selectedGrado,
            this.selectedMerito
        )
        this.identidad = [
            { nombre: 'Juan Pérez', nota: 95 },
            { nombre: 'Ana López', nota: 88 },
        ]
    }
}
