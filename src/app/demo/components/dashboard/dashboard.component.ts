import { Component, OnInit, OnDestroy } from '@angular/core'
import { MenuItem, PrimeTemplate } from 'primeng/api'
import { Product } from '../../api/product'
import { ProductService } from '../../service/product.service'
import { Subscription, debounceTime } from 'rxjs'
import { LayoutService } from 'src/app/layout/service/app.layout.service'
import { NgStyle, CurrencyPipe } from '@angular/common'
import { TableModule } from 'primeng/table'
import { ButtonDirective } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ChartModule } from 'primeng/chart'

@Component({
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [
        NgStyle,
        TableModule,
        PrimeTemplate,
        ButtonDirective,
        MenuModule,
        ChartModule,
        CurrencyPipe,
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[]

    products!: Product[]

    chartData: unknown

    chartOptions: unknown

    subscription!: Subscription

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => {
                this.initChart()
            })
    }

    ngOnInit() {
        this.initChart()
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data))

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ]
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        )
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        }

        this.chartOptions = {
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

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
    }
}
