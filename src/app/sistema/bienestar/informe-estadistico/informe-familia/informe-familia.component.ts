import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-informe-familia',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './informe-familia.component.html',
    styleUrl: './informe-familia.component.scss',
})
export class InformeFamiliaComponent implements OnInit {
    //oanel izquierdo
    sexoData: any
    sexoOptions: any
    //panel derecho
    edadData: any
    edadOptions: any

    ngOnInit() {
        console.log('DemograficaComponent initialized')

        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')

        this.sexoData = {
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

        this.sexoOptions = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
        }

        this.edadData = {
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

        this.edadOptions = {
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
