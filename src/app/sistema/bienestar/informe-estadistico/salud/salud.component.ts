import { Component, OnInit } from '@angular/core'
//import { ActivatedRoute } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
@Component({
    selector: 'app-salud',
    standalone: true,
    imports: [PrimengModule, ChartModule],
    templateUrl: './salud.component.html',
    styleUrl: './salud.component.scss',
})
export class SaludComponent implements OnInit {
    //grafivco panel izquierdo
    nivelPobreza: any
    options: any

    //gradifco panel deerecho
    basicData: any
    basicOptions: any

    //route
    //private route: ActivatedRoute

    ngOnInit() {
        this.nivelPobreza = {
            labels: ['Extrema pobreza', 'Pobreza', 'Regular'],
            datasets: [
                {
                    data: [40, 55, 20],
                    backgroundColor: ['#c53030', '#f6ad55', '#38a169'],
                    borderWidth: 0,
                },
            ],
        }

        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const total = context.dataset.data.reduce(
                                (a: number, b: number) => a + b,
                                0
                            )
                            const percentage = Math.round(
                                (context.parsed * 100) / total
                            )
                            return context.label + ': ' + percentage + '%'
                        },
                    },
                },
            },
            maintainAspectRatio: false,
        }

        // Datos para el gráfico de barras derecho panel

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        )
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

        this.basicData = {
            labels: ['CONADIS', 'Programa Aura'],
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
