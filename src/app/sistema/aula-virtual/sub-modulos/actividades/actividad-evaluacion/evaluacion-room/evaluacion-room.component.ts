import { IconComponent } from '@/app/shared/icon/icon.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { TabViewModule } from 'primeng/tabview'
import { LeyendaTareasComponent } from '../../components/leyenda-tareas/leyenda-tareas.component'
import { provideIcons } from '@ng-icons/core'
import {
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-evaluacion-room',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        TabViewModule,
        ButtonModule,
        TablePrimengComponent,
        LeyendaTareasComponent,
    ],
    templateUrl: './evaluacion-room.component.html',
    styleUrl: './evaluacion-room.component.scss',
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
        }),
    ],
})
export class EvaluacionRoomComponent implements OnInit {
    private _route = inject(ActivatedRoute)
    public iPerfilId = 1

    ngOnInit() {
        this._route.queryParams.subscribe((params) => {
            this.iPerfilId = params['iPerfilId']
        })
    }
}
