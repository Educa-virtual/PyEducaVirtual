import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
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
    //route
    private route: ActivatedRoute

    data: any
    options: any
    ngOnInit() {
        this.data = {
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
    }
}
