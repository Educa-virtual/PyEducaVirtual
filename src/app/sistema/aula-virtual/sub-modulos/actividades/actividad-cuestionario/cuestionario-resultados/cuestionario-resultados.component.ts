import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-cuestionario-resultados',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './cuestionario-resultados.component.html',
    styleUrl: './cuestionario-resultados.component.scss',
})
export class CuestionarioResultadosComponent {
    chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' =
        'bar'

    chartData: any
    chartOptions: any
    showLegend: boolean = true

    constructor() {
        this.updateChartData()
        this.updateChartOptions()
    }

    updateChartData() {
        this.chartData = {
            labels: ['A', 'B', 'C', 'D', 'E'],
            datasets: [
                {
                    label: 'Dataset 1',
                    backgroundColor: this.getRandomColors(5),
                    borderColor: this.getRandomColors(5),
                    data: this.getRandomData(5),
                },
            ],
        }
    }

    updateChartOptions() {
        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: this.showLegend,
                    position: 'top',
                    labels: {
                        color: '#fff',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#fff',
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#fff',
                    },
                },
            },
            backgroundColor: '#444',
        }
    }

    getRandomData(num: number): number[] {
        return Array.from({ length: num }, () =>
            Math.floor(Math.random() * 100 + 1)
        )
    }

    getRandomColors(num: number): string[] {
        const colors = []
        for (let i = 0; i < num; i++) {
            colors.push(
                `#${Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0')}`
            )
        }
        return colors
    }
}
