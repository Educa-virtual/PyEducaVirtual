import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
@Component({
    selector: 'app-estadistica',
    standalone: true,
    imports: [PrimengModule, CommonModule],
    templateUrl: './estadistica.component.html',
    styleUrl: './estadistica.component.scss',
})
export class EstadisticaComponent implements OnInit {
    productService = undefined
    identidad: any
    nota: any
    escolar: any
    grado: any
    merito: any
    ngOnInit() {
        this.identidad = [
            {
                merito: 'general',
                grado: 'primero',
                fecha: '2025-05-05',
                valor: 'pi pi-file-pdf',
                generado: 'pi pi-info-circle',
            },
        ]
        this.nota = [
            {
                indice: '1',
                curricular: 'matematica',
                year1: '11',
                year2: '12',
                year3: '12',
                year4: '12',
                year5: '12',
            },
            {
                indice: '2',
                curricular: 'ingles',
                year1: '11',
                year2: '12',
                year3: '12',
                year4: '12',
                year5: '12',
            },
            {
                indice: '3',
                curricular: 'comunicaicon',
                year1: '11',
                year2: '12',
                year3: '12',
                year4: '12',
                year5: '12',
            },
            {
                indice: '4',
                curricular: 'situacion final',
                year1: 'aprobado',
                year2: 'aprobado',
                year3: 'aprobado',
                year4: 'aprobado',
                year5: 'aprobado',
            },
        ]
        this.escolar = [{ year: 2023 }, { year: 2024 }, { year: 2025 }]
        this.merito = [
            { nombre: 'GENERAL' },
            { nombre: '5 PRIMEROS PUESTOS' },
            { nombre: 'DECIMO SUPERIOR' },
            { nombre: 'QUINTO SUPERIOR' },
            { nombre: 'TERCIO SUPERIOR' },
        ]
        this.grado = [
            { numero: 'primero' },
            { numero: 'segundo' },
            { numero: 'tercero' },
        ]
    }
}
