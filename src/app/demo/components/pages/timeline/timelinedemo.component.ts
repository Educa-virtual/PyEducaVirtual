import { Component, OnInit } from '@angular/core'
import { PrimeIcons, PrimeTemplate } from 'primeng/api'
import { TimelineModule } from 'primeng/timeline'
import { NgClass, NgIf } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ButtonDirective } from 'primeng/button'

@Component({
    templateUrl: './timelinedemo.component.html',
    styleUrls: ['./timelinedemo.scss'],
    standalone: true,
    imports: [
        TimelineModule,
        PrimeTemplate,
        NgClass,
        CardModule,
        NgIf,
        ButtonDirective,
    ],
})
export class TimelineDemoComponent implements OnInit {
    events1: unknown[] = []

    events2: unknown[] = []

    ngOnInit() {
        this.events1 = [
            {
                status: 'Ordered',
                date: '15/10/2020 10:30',
                icon: PrimeIcons.SHOPPING_CART,
                color: '#9C27B0',
                image: 'game-controller.jpg',
            },
            {
                status: 'Processing',
                date: '15/10/2020 14:00',
                icon: PrimeIcons.COG,
                color: '#673AB7',
            },
            {
                status: 'Shipped',
                date: '15/10/2020 16:15',
                icon: PrimeIcons.ENVELOPE,
                color: '#FF9800',
            },
            {
                status: 'Delivered',
                date: '16/10/2020 10:00',
                icon: PrimeIcons.CHECK,
                color: '#607D8B',
            },
        ]

        this.events2 = ['2020', '2021', '2022', '2023']
    }
}