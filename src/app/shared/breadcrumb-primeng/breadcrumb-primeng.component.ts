import { Component, inject, OnInit } from '@angular/core'

import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
import { BreadcrumbService } from '@/app/servicios/breadcrumb.service'

@Component({
    selector: 'app-breadcrumb-primeng',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './breadcrumb-primeng.component.html',
    styleUrl: './breadcrumb-primeng.component.scss',
})
export class BreadcrumbPrimengComponent implements OnInit {
    private _BreadcrumbService = inject(BreadcrumbService)
    breadcrumbs: any[] = []

    ngOnInit(): void {
        this._BreadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
            this.breadcrumbs = breadcrumbs
        })
    }
}
