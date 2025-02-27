import { Component, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'

@Component({
    selector: 'app-informes-ere',
    standalone: true,
    templateUrl: './informes-ere.component.html',
    styleUrls: ['./informes-ere.component.scss'],
    imports: [ContainerPageComponent, PrimengModule, ChartModule],
})
export class InformesEreComponent implements OnInit {
    data: any
    options: any

    constructor() {}

    ngOnInit() {
        this.mostrarEstadisticaNIvel()
        console.log('Hola xkts')
    }

    mostrarEstadisticaNIvel() {
        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.data = {
            labels: ['Satisfactorio', 'Inicio', 'Proceso'],
            datasets: [
                {
                    data: [70, 10, 20],
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
    }
}
