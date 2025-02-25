import { Component, OnInit, OnDestroy } from '@angular/core'

import { RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { BreadcrumbService } from './breadcrumb-nav.service'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'

export interface Breadcrumb {
    label: string
    link: string
}
@Component({
    selector: 'app-breadcrumb-primeng',
    standalone: true,
    imports: [CommonModule, RouterLink, PrimengModule],
    templateUrl: './breadcrumb-primeng.component.html',
    styleUrl: './breadcrumb-primeng.component.scss',
})
export class BreadcrumbPrimengComponent implements OnInit, OnDestroy {
    breadcrumbs: Array<{ label: string; url: string }> = []
    private breadcrumbSubscription: Subscription

    constructor(private breadcrumbService: BreadcrumbService) {}
    home: MenuItem | undefined
    items: MenuItem[] | undefined

    ngOnInit(): void {
        // Nos suscribimos al observable de breadcrumbs
        this.breadcrumbSubscription =
            this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
                this.breadcrumbs = breadcrumbs
            })
        console.log(this.breadcrumbs)
        // this.breadcrumbs.forEach((i)=>{console.log(i)})
    }

    ngOnDestroy(): void {
        // Asegúrate de desuscribirte para evitar fugas de memoria
        if (this.breadcrumbSubscription) {
            this.breadcrumbSubscription.unsubscribe()
        }
    }
}
