import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-economica',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './economica.component.html',
    styleUrl: './economica.component.scss',
})
export class EconomicaComponent implements OnInit {
    //panel izquierdo
    dataIngresoFamiliar: any
    optionsIngresoFamiliar: any
    //panel derecho
    basicData: any
    basicOptions: any

    ngOnInit() {
        console.log('EconomicaComponent initialized')

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')
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

        this.dataIngresoFamiliar = {
            labels: [
                '800',
                '600 - 1500',
                '1500 - 2500',
                '2500 - 4000',
                '4000 - 6000',
                '6000 - 10,000',
                '10,000',
            ],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor:
                        documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40],
                },
                {
                    label: 'My Second dataset',
                    backgroundColor:
                        documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [28, 48, 40, 19, 86, 27, 90],
                },
            ],
        }

        this.optionsIngresoFamiliar = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
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
