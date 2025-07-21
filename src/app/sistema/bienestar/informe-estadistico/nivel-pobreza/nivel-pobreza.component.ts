import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { ActivatedRoute } from '@angular/router'
@Component({
    selector: 'app-nivel-pobreza',
    standalone: true,
    imports: [PrimengModule, ChartModule],
    templateUrl: './nivel-pobreza.component.html',
    styleUrl: './nivel-pobreza.component.scss',
})
export class NivelPobrezaComponent implements OnInit {
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
