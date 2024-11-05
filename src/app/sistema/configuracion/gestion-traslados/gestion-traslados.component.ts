import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'


@Component({
    selector: 'app-gestion-traslados',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
    ],
    templateUrl: './gestion-traslados.component.html',
    styleUrl: './gestion-traslados.component.scss',
    providers: [],
})
export class GestionTrasladosComponent implements OnInit, OnChanges, OnDestroy {
    constructor() {}
    ngOnInit() {}

    ngOnChanges(changes) {}

    ngOnDestroy() {}
}
