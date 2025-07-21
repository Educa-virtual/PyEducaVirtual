import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
//import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-vivienda',
    standalone: true,
    imports: [PrimengModule, ChartModule],
    templateUrl: './vivienda.component.html',
    styleUrl: './vivienda.component.scss',
})
export class ViviendaComponent implements OnInit {
    //primer panel
    data: any
    options: any
    //segundo panel
    basicData: any
    basicOptions: any

    ngOnInit() {
        console.log('ViviendaComponent initialized')

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                    ],
                },
            ],
        }

        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
        }

        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        )
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

        this.basicData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                    ],
                    borderWidth: 1,
                },
            ],
        }

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        }
    }
}
