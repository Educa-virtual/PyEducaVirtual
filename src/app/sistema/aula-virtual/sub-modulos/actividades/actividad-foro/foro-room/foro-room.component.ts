import { Component, inject } from '@angular/core'
import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { provideIcons } from '@ng-icons/core'
import { TabViewModule } from 'primeng/tabview'
import { OrderListModule } from 'primeng/orderlist'
import { PrimengModule } from '@/app/primeng.module'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'

@Component({
    selector: 'app-foro-room',
    standalone: true,
    templateUrl: './foro-room.component.html',
    styleUrls: ['./foro-room.component.scss'],
    imports: [
        IconComponent,
        TablePrimengComponent,
        TabViewModule,
        OrderListModule,
        PrimengModule,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class ForoRoomComponent {
    private _aulaService = inject(ApiAulaService)
    constructor() {}

    // ngOnInit() { implements OnInit
    // }
    //   obtenerForo() {
    //     this._aulaService
    //         .obtenerActividad({
    //             iActTipoId: this.iActTopId,
    //             ixActivadadId: this.ixActivadadId,
    //         })
    //         .pipe(takeUntil(this.unsbscribe$))
    //         .subscribe({
    //             next: (resp) => {
    //                 this.evaluacion = resp
    //             },
    //         })
    //   }
    //   mostrarCategorias() {
    //     const userId = 1
    //     this._aulaService.guardarForo(userId).subscribe((Data) => {
    //         this.categorias = Data['data']
    //         console.log('Datos mit', this.categorias)
    //     })
    // }
}
