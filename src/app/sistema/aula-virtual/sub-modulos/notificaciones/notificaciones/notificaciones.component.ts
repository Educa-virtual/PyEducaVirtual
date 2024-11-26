import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { DataViewModule } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-notificaciones',
    standalone: true,
    templateUrl: './notificaciones.component.html',
    styleUrls: ['./notificaciones.component.scss'],
    imports: [
        TablePrimengComponent,
        DataViewModule,
        InputIconModule,
        IconFieldModule,
        ContainerPageComponent,
        InputTextModule,
        DropdownModule,
    ],
})
export class NotificacionesComponent {
    constructor() {}

    // ngOnInit() {
    //implements OnInit
    // }
}
